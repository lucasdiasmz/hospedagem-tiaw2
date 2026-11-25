import { IconeCheck, IconeLapis, IconePerfis, IconeSos, IconeTelefone } from '@ds/Icones.jsx';

/* um atalho em linha: ícone, o que faz e um detalhe curto */
function Atalho({ Icone, titulo, detalhe, classe = '', href, aoClicar }) {
  const dentro = (
    <>
      <span className="apoio-icone" aria-hidden="true"><Icone /></span>
      <span className="apoio-texto">
        <strong>{titulo}</strong>
        {detalhe && <small>{detalhe}</small>}
      </span>
    </>
  );
  return href
    ? <a className={'apoio-atalho ' + classe} href={href}>{dentro}</a>
    : <button type="button" className={'apoio-atalho ' + classe} onClick={aoClicar}>{dentro}</button>;
}

/* coluna de apoio: pedir ajuda, ligar para o contato principal, anotar e a rede de apoio */
export default function Apoio({ idoso, contato, simples, aoAbrirAjuda, aoAbrirNota, aoConvidar, aoUsarCodigo }) {
  const nome = idoso?.nome?.split(' ')[0];

  return (
    <aside className={'apoio' + (simples ? ' apoio--simples' : '')} aria-label="Ajuda e atalhos">
      <div className="apoio-grupo">
        <Atalho Icone={IconeSos} classe="apoio-atalho--ajuda" titulo="Chamar ajuda"
          detalhe={nome && !simples ? 'Avisa a rede de ' + nome : 'Avisa a sua rede de apoio'} aoClicar={aoAbrirAjuda} />
        {contato && (
          <Atalho Icone={IconeTelefone} titulo={'Ligar para ' + contato.nome.split(' ')[0]}
            detalhe={contato.parentesco || contato.telefone} href={'tel:' + contato.telefone.replace(/\D/g, '')} />
        )}
        {aoAbrirNota && <Atalho Icone={IconeLapis} titulo="Nova anotação" detalhe="Pressão, refeição, sintomas" aoClicar={aoAbrirNota} />}
      </div>

      <section className="apoio-rede" aria-labelledby="rede-titulo">
        <h2 id="rede-titulo">Rede de apoio</h2>
        <p>{simples ? 'Quem entra na sua rede acompanha os seus cuidados.' : nome ? `Quem entra na rede acompanha os cuidados de ${nome}.` : 'Quem entra na rede acompanha os cuidados do dia.'}</p>
        <div className="apoio-rede-botoes">
          {aoConvidar && <button type="button" className="btn btn-suave" onClick={aoConvidar}><IconePerfis />Convidar</button>}
          <button type="button" className="btn btn-suave" onClick={aoUsarCodigo}><IconeCheck />Tenho um código</button>
        </div>
      </section>
    </aside>
  );
}
