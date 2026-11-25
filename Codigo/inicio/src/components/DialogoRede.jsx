import { useState } from 'react';
import Dialogo from '@ds/Dialogo.jsx';
import { IconeCheck, IconePerfis, IconeTelefone } from '@ds/Icones.jsx';
import { linkWhatsApp } from './Rede.jsx';

const iniciais = (nome = '') => nome.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

/* Quem está na rede de apoio, com ligar e WhatsApp a um toque.
   Quem cadastrou a pessoa (e a própria pessoa idosa) pode tirar alguém; qualquer um pode sair. */
export default function DialogoRede({ aberto, aoFechar, idoso, rede, euId, perfil, aoConvidar, aoUsarCodigo, aoRemover }) {
  const [confirmar, setConfirmar] = useState(null);
  const [erro, setErro] = useState('');
  const eu = rede.find((m) => m.id === euId);
  const gerencia = Boolean(eu?.responsavel) || perfil === 'idoso';
  const nome = idoso?.nome?.split(' ')[0] || '';

  function fechar() {
    setConfirmar(null);
    setErro('');
    aoFechar();
  }

  async function remover(membro) {
    setErro('');
    try {
      await aoRemover(membro);
      setConfirmar(null);
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <Dialogo aberto={aberto} aoFechar={fechar} titulo="Rede de apoio"
      descricao={perfil === 'idoso' ? 'Quem acompanha os seus cuidados.' : `Quem acompanha os cuidados de ${nome}.`}>
      <ul className="rede-lista">
        {rede.map((m) => {
          const souEu = m.id === euId;
          const podeTirar = !m.responsavel && (souEu || gerencia);
          return (
            <li key={m.id} className="rede-membro">
              <span className={'rede-avatar rede-avatar--' + m.tipo} aria-hidden="true">{iniciais(m.nome)}</span>
              <span className="rede-quem">
                <strong>{m.nome}{souEu && ' (você)'}</strong>
                <small>{m.papel}{m.responsavel && ' · cadastrou a conta'}{m.turno && ' · ' + m.turno}</small>
              </span>
              {!souEu && m.telefone && (
                <span className="rede-contato">
                  <a className="btn-icone" href={'tel:' + m.telefone.replace(/\D/g, '')} aria-label={'Ligar para ' + m.nome}><IconeTelefone /></a>
                  <a className="btn-icone rede-whats" href={linkWhatsApp('', m.telefone)} target="_blank" rel="noopener noreferrer"
                    aria-label={'Conversar com ' + m.nome + ' no WhatsApp'}>
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 5 5 0 0 0 1 2.6 11.3 11.3 0 0 0 4.3 3.8c1.6.7 2.3.7 3.1.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.3z" /></svg>
                  </a>
                </span>
              )}
              {podeTirar && (
                confirmar === m.id ? (
                  <span className="rede-confirmar">
                    <button type="button" className="btn btn-perigo" onClick={() => remover(m)}>{souEu ? 'Sair' : 'Tirar'}</button>
                    <button type="button" className="btn" onClick={() => setConfirmar(null)}>Cancelar</button>
                  </span>
                ) : (
                  <button type="button" className="btn btn-texto rede-tirar" onClick={() => setConfirmar(m.id)}>
                    {souEu ? 'Sair da rede' : 'Tirar'}
                  </button>
                )
              )}
            </li>
          );
        })}
      </ul>
      {erro && <p className="erro-form" role="alert">{erro}</p>}
      <div className="dialogo-botoes">
        <button type="button" className="btn" onClick={aoUsarCodigo}><IconeCheck />Tenho um código</button>
        {aoConvidar && <button type="button" className="btn btn-primario" onClick={aoConvidar}><IconePerfis />Convidar alguém</button>}
      </div>
    </Dialogo>
  );
}
