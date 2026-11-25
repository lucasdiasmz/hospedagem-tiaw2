import { useEffect, useState } from 'react';
import Dialogo from '@ds/Dialogo.jsx';
import { Estado } from '@ds/Componentes.jsx';
import { api } from '../api.js';

const PAPEIS = [
  { id: 'cliente', rotulo: 'Familiar' },
  { id: 'cuidador', rotulo: 'Cuidador(a)' },
  { id: 'idoso', rotulo: 'A própria pessoa idosa' },
];

/* gera um código para outra pessoa entrar na rede do idoso; vale uma vez, por 7 dias */
export function DialogoConvite({ aberto, aoFechar, idoso }) {
  const [papel, setPapel] = useState('cliente');
  const [convite, setConvite] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!aberto) return;
    setConvite(null);
    setCopiado(false);
    setErro('');
  }, [aberto]);

  async function gerar(e) {
    e.preventDefault();
    setErro('');
    try {
      setConvite(await api(`/idosos/${idoso.id}/convites`, { metodo: 'POST', corpo: { papel } }));
    } catch (falha) {
      setErro(falha.message);
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(convite.codigo);
      setCopiado(true);
    } catch {
      setErro('Não foi possível copiar. Anote o código.');
    }
  }

  return (
    <Dialogo aberto={aberto} aoFechar={aoFechar} titulo="Convidar para a rede"
      descricao={'Quem usar o código passa a ver os cuidados de ' + (idoso?.nome || '') + '.'}>
      {convite ? (
        <>
          <p className="convite-codigo">{convite.codigo}</p>
          <p>Envie só para a pessoa certa. Vale uma vez, até {new Date(convite.expiraEm).toLocaleDateString('pt-BR')}.</p>
          {erro && <p className="erro-form" role="alert">{erro}</p>}
          <div className="dialogo-botoes">
            <button type="button" className="btn" onClick={aoFechar}>Fechar</button>
            <button type="button" className="btn btn-primario" onClick={copiar}>{copiado ? 'Código copiado' : 'Copiar código'}</button>
          </div>
        </>
      ) : (
        <form onSubmit={gerar}>
          <fieldset className="campo convite-papeis">
            <legend>Quem você quer convidar?</legend>
            <div className="pilulas">
              {PAPEIS.map((x) => (
                <label key={x.id} className="pilula">
                  <input type="radio" name="papel" checked={papel === x.id} onChange={() => setPapel(x.id)} />
                  {x.rotulo}
                </label>
              ))}
            </div>
          </fieldset>
          {erro && <p className="erro-form" role="alert">{erro}</p>}
          <div className="dialogo-botoes">
            <button type="button" className="btn" onClick={aoFechar}>Cancelar</button>
            <button type="submit" className="btn btn-primario">Gerar código</button>
          </div>
        </form>
      )}
    </Dialogo>
  );
}

/* entra na rede de um idoso com o código recebido */
export function FormCodigo() {
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    if (codigo.replace(/[^a-z0-9]/gi, '').length !== 8) {
      setErro('O código tem 8 letras e números.');
      return;
    }
    setEnviando(true);
    try {
      await api('/idosos/entrar-com-convite', { metodo: 'POST', corpo: { codigo } });
      window.location.reload();
    } catch (falha) {
      setErro(falha.message);
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <label className="campo">
        Código de convite
        <input type="text" autoComplete="off" autoCapitalize="characters" spellCheck="false" maxLength="12" placeholder="ABCD-EFGH"
          value={codigo} onChange={(e) => { setCodigo(e.target.value); setErro(''); }}
          aria-invalid={erro ? 'true' : undefined} aria-describedby={erro ? 'erro-codigo' : undefined} />
        {erro && <span className="campo-erro" id="erro-codigo" role="alert">{erro}</span>}
      </label>
      <button type="submit" className="btn btn-primario" disabled={enviando}>{enviando ? 'Entrando…' : 'Usar código'}</button>
    </form>
  );
}

export function DialogoCodigo({ aberto, aoFechar }) {
  return (
    <Dialogo aberto={aberto} aoFechar={aoFechar} titulo="Usar código de convite" descricao="Entre na rede de apoio de mais uma pessoa.">
      <FormCodigo />
    </Dialogo>
  );
}

function FormIdoso() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setData] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    try {
      await api('/idosos', { metodo: 'POST', corpo: { nome, dataNascimento } });
      window.location.reload();
    } catch (falha) {
      setErro(falha.message);
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <label className="campo">
        Nome completo da pessoa
        <input type="text" autoComplete="off" maxLength="80" required value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>
      <label className="campo">
        Data de nascimento
        <input type="date" required value={dataNascimento} onChange={(e) => setData(e.target.value)} />
      </label>
      {erro && <p className="erro-form" role="alert">{erro}</p>}
      <button type="submit" className="btn btn-primario" disabled={enviando}>{enviando ? 'Salvando…' : 'Cadastrar pessoa'}</button>
    </form>
  );
}

/* conta ainda sem ninguém vinculado */
export function SemIdoso({ perfil }) {
  return (
    <>
      <Estado titulo="Nenhuma pessoa vinculada ainda">
        <p>
          {perfil === 'cuidador'
            ? 'Quando uma família convidar você, use o código aqui para ver os cuidados.'
            : 'Cadastre a pessoa que você cuida ou use o código que a família enviou.'}
        </p>
      </Estado>
      <div className="sem-idoso">
        {perfil === 'cliente' && (
          <section className="card" aria-labelledby="novo-idoso">
            <h2 id="novo-idoso">Cadastrar a pessoa</h2>
            <FormIdoso />
          </section>
        )}
        <section className="card" aria-labelledby="com-codigo">
          <h2 id="com-codigo">Tenho um código</h2>
          <FormCodigo />
        </section>
      </div>
    </>
  );
}
