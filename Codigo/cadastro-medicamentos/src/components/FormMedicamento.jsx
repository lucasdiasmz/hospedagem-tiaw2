import { useState } from 'react';
import { IconePilula } from './Icones.jsx';
import { FORMAS, FREQUENCIAS, horariosPadrao, validar } from '../utils/medicamentos.js';

const VAZIO = {
  nome: '',
  dosagem: '',
  forma: FORMAS[0],
  frequencia: 1,
  observacoes: '',
};

export default function FormMedicamento({ aoSalvar, nomeRef }) {
  const [med, setMed] = useState({ ...VAZIO, horarios: horariosPadrao(1) });
  const [erros, setErros] = useState({});

  function alterar(campo, valor) {
    setMed((m) => ({ ...m, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  }

  function alterarFrequencia(valor) {
    setMed((m) => ({ ...m, frequencia: valor, horarios: horariosPadrao(valor) }));
    setErros((e) => ({ ...e, horarios: undefined }));
  }

  function alterarHorario(indice, valor) {
    const horarios = med.horarios.slice();
    horarios[indice] = valor;
    alterar('horarios', horarios);
  }

  function enviar(e) {
    e.preventDefault();
    const encontrados = validar(med);
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;

    aoSalvar({
      id: Date.now(),
      nome: med.nome.trim(),
      dosagem: med.dosagem.trim(),
      forma: med.forma,
      horarios: med.horarios.slice().sort(),
      observacoes: med.observacoes.trim(),
    });
    setMed({ ...VAZIO, horarios: horariosPadrao(1) });
  }

  return (
    <form className="card form" onSubmit={enviar} noValidate>
      <h2>
        <span className="icone-tile" aria-hidden="true"><IconePilula /></span>
        Novo medicamento
      </h2>

      <label className="campo">
        Nome do medicamento
        <input
          ref={nomeRef}
          type="text"
          value={med.nome}
          onChange={(e) => alterar('nome', e.target.value)}
          placeholder="Ex.: Losartana"
          maxLength="60"
          aria-invalid={erros.nome ? 'true' : undefined}
        />
        {erros.nome && <span className="erro" role="alert">{erros.nome}</span>}
      </label>

      <div className="linha">
        <label className="campo">
          Dosagem
          <input
            type="text"
            value={med.dosagem}
            onChange={(e) => alterar('dosagem', e.target.value)}
            placeholder="Ex.: 50 mg"
            maxLength="30"
            aria-invalid={erros.dosagem ? 'true' : undefined}
          />
          {erros.dosagem && <span className="erro" role="alert">{erros.dosagem}</span>}
        </label>

        <label className="campo">
          Forma
          <select value={med.forma} onChange={(e) => alterar('forma', e.target.value)}>
            {FORMAS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </label>
      </div>

      <label className="campo">
        Frequência
        <select value={med.frequencia} onChange={(e) => alterarFrequencia(Number(e.target.value))}>
          {FREQUENCIAS.map((f) => <option key={f.valor} value={f.valor}>{f.rotulo}</option>)}
        </select>
      </label>

      <fieldset className="campo">
        <legend>Horários</legend>
        <div className="horarios">
          {med.horarios.map((h, i) => (
            <input
              key={i}
              type="time"
              value={h}
              onChange={(e) => alterarHorario(i, e.target.value)}
              aria-label={'Horário ' + (i + 1)}
            />
          ))}
        </div>
        {erros.horarios && <span className="erro" role="alert">{erros.horarios}</span>}
      </fieldset>

      <label className="campo">
        Observações (opcional)
        <textarea
          rows="3"
          maxLength="120"
          value={med.observacoes}
          onChange={(e) => alterar('observacoes', e.target.value)}
          placeholder="Ex.: Tomar após o café da manhã"
        ></textarea>
      </label>

      <button type="submit" className="btn btn-primario">Cadastrar medicamento</button>
    </form>
  );
}
