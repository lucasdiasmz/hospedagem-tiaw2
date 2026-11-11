import { IconeAjuda, IconePilula } from './Icones.jsx';

function IconeLapis() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13 7l4 4" />
    </svg>
  );
}

/* atalhos grandes para o que mais se faz durante o dia */
export default function AcoesRapidas({ med, aoRegistrarRemedio, aoAbrirNota, aoAbrirAjuda }) {
  const acoes = [
    {
      id: 'remedio',
      titulo: 'Registrar remédio',
      detalhe: med ? med.titulo + ' às ' + med.hora : 'Nenhum pendente hoje',
      icone: <IconePilula />,
      aoClicar: aoRegistrarRemedio,
      desativado: !med,
    },
    { id: 'nota', titulo: 'Nova anotação', detalhe: 'Pressão, sintomas, observações', icone: <IconeLapis />, aoClicar: aoAbrirNota },
    { id: 'ajuda', titulo: 'Chamar ajuda', detalhe: 'Avisar a equipe agora', icone: <IconeAjuda />, aoClicar: aoAbrirAjuda },
  ];

  return (
    <section className="acoes-rapidas" aria-labelledby="acoes-titulo">
      <h2 id="acoes-titulo">Ações rápidas</h2>
      <div className="acoes-grade">
        {acoes.map((a) => (
          <button key={a.id} type="button" className={'acao acao-' + a.id} onClick={a.aoClicar} disabled={a.desativado}>
            <span className="acao-icone">{a.icone}</span>
            <span className="acao-texto">
              <strong>{a.titulo}</strong>
              <small>{a.detalhe}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
