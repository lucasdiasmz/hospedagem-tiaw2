import { IconeLapis, IconePilula, IconeSos } from '@ds/Icones.jsx';

/* atalhos grandes para o que mais se faz durante o dia */
export default function AcoesRapidas({ med, aoRegistrarRemedio, aoAbrirNota, aoAbrirAjuda }) {
  const acoes = [
    {
      id: 'remedio',
      titulo: 'Registrar remédio',
      detalhe: med ? med.titulo + ' · ' + med.hora : 'Nenhum pendente',
      Icone: IconePilula,
      aoClicar: aoRegistrarRemedio,
      desativado: !med,
    },
    { id: 'nota', titulo: 'Nova anotação', detalhe: 'Pressão, sintomas…', Icone: IconeLapis, aoClicar: aoAbrirNota },
    { id: 'ajuda', titulo: 'Chamar ajuda', detalhe: 'Avisa a equipe', Icone: IconeSos, aoClicar: aoAbrirAjuda },
  ];

  return (
    <section className="acoes" aria-labelledby="acoes-titulo">
      <h2 id="acoes-titulo" className="somente-leitor">Ações rápidas</h2>
      {acoes.map(({ id, titulo, detalhe, Icone, aoClicar, desativado }) => (
        <button key={id} type="button" className={'acao acao--' + id} onClick={aoClicar} disabled={desativado}>
          <span className="acao-icone"><Icone /></span>
          <span className="acao-texto">
            <strong>{titulo}</strong>
            <small>{detalhe}</small>
          </span>
        </button>
      ))}
    </section>
  );
}
