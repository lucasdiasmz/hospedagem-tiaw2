import { useState } from 'react';

const opcoesExperiencia = [
  { valor: '0-1', rotulo: 'Menos de 1 ano' },
  { valor: '1-3', rotulo: '1 a 3 anos' },
  { valor: '3-5', rotulo: '3 a 5 anos' },
  { valor: '5-10', rotulo: '5 a 10 anos' },
  { valor: '10+', rotulo: 'Mais de 10 anos' },
];

const servicos = [
  { id: 'acompanhante', rotulo: 'Acompanhante' },
  { id: 'tecnico-enfermagem', rotulo: 'Técnico de enfermagem' },
  { id: 'companhia', rotulo: 'Companhia' },
  { id: 'outro', rotulo: 'Outro' },
];

function CuidadorProfissional({ onVoltar, onFinalizar }) {
  const [experiencia, setExperiencia] = useState('');
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [disponibilidade, setDisponibilidade] = useState('');
  const [mostrarDisponibilidade, setMostrarDisponibilidade] = useState(false);

  function alternarServico(id) {
    setServicosSelecionados((atual) =>
      atual.includes(id) ? atual.filter((s) => s !== id) : [...atual, id]
    );
  }

  function handleFinalizar() {
    onFinalizar?.({
      experiencia,
      servicos: servicosSelecionados,
      disponibilidade,
    });
  }

  return (
    <main className="tela-cuidador">
      <button className="btn-voltar" onClick={onVoltar}>
        ← Voltar
      </button>

      <h1>Cuidador / Profissional</h1>
      <p className="subtitulo">
        Preencha seus dados para aumentar suas chances de contratação.
      </p>

      <h3 className="secao-titulo">Experiência (anos)</h3>
      <select
        className="campo-select"
        value={experiencia}
        onChange={(e) => setExperiencia(e.target.value)}
        aria-label="Experiência em anos"
      >
        <option value="">Selecione</option>
        {opcoesExperiencia.map((op) => (
          <option key={op.valor} value={op.valor}>
            {op.rotulo}
          </option>
        ))}
      </select>

      <h3 className="secao-titulo">Serviços oferecidos</h3>
      <div className="lista-servicos">
        {servicos.map((servico) => (
          <label key={servico.id} className="servico" htmlFor={servico.id}>
            <input
              id={servico.id}
              type="checkbox"
              className="checkbox"
              checked={servicosSelecionados.includes(servico.id)}
              onChange={() => alternarServico(servico.id)}
            />
            {servico.rotulo}
          </label>
        ))}
      </div>

      <h3 className="secao-titulo">Disponibilidade</h3>
      <button
        type="button"
        className="campo-disponibilidade"
        aria-expanded={mostrarDisponibilidade}
        onClick={() => setMostrarDisponibilidade((v) => !v)}
      >
        <span>{disponibilidade || 'Selecione os dias e horários'}</span>
        <span aria-hidden="true" className="seta">
          {mostrarDisponibilidade ? '⌄' : '›'}
        </span>
      </button>

      {mostrarDisponibilidade && (
        <textarea
          className="campo-texto"
          rows={3}
          placeholder="Ex.: Seg a Sex, 8h às 18h"
          value={disponibilidade}
          onChange={(e) => setDisponibilidade(e.target.value)}
          aria-label="Dias e horários disponíveis"
        />
      )}

      <button className="btn-proximo" onClick={handleFinalizar}>
        Finalizar
      </button>
    </main>
  );
}

export default CuidadorProfissional;