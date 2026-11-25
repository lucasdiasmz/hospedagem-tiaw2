import { IconeLapis, IconePerfis, IconeSos, IconeTelefone } from '@ds/Icones.jsx';

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
const iniciais = (nome = '') => nome.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

/* "Você, Carla, Maria e mais 2." */
function resumoRede(rede, euId) {
  const outros = rede.filter((m) => m.id !== euId).map((m) => m.nome.split(' ')[0]);
  if (!outros.length) return 'Só você por enquanto. Convide a família e quem ajuda no dia a dia.';
  if (outros.length === 1) return `Você e ${outros[0]}.`;
  if (outros.length === 2) return `Você, ${outros[0]} e ${outros[1]}.`;
  return `Você, ${outros[0]}, ${outros[1]} e mais ${outros.length - 2}.`;
}

export default function Apoio({ contato, simples, idoso, rede = [], euId, aoAbrirAjuda, aoAbrirNota, aoConvidar, aoVerRede }) {
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
        <p>{resumoRede(rede, euId)}</p>
        {rede.length > 0 && (
          <ul className="apoio-rostos" aria-hidden="true">
            {rede.slice(0, 5).map((m) => <li key={m.id} className={'rede-avatar rede-avatar--' + m.tipo}>{iniciais(m.nome)}</li>)}
            {rede.length > 5 && <li className="rede-avatar">+{rede.length - 5}</li>}
          </ul>
        )}
        <div className="apoio-rede-botoes">
          <button type="button" className="btn btn-suave" onClick={aoVerRede}>Ver rede</button>
          {aoConvidar && <button type="button" className="btn btn-suave" onClick={aoConvidar}><IconePerfis />Convidar</button>}
        </div>
      </section>
    </aside>
  );
}
