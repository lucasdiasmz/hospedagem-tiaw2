import { useState } from 'react';
import { CATALOGOS, USUARIO } from '../data/db.js';
import { FREQUENCIAS, agoraIso, horariosPadrao, validar } from '../utils/medicamentos.js';
import { IconePilula } from './Icones.jsx';

const { formasMedicamento, viasMedicamento } = CATALOGOS;

const VAZIO = {
  nome: '',
  dosagem: '',
  forma: formasMedicamento[0],
  via: viasMedicamento[0],
  frequencia: 1,
  categoria: '',
  observacoes: '',
};

export default function FormMedicamento({ idoso, categorias, aoSalvar, nomeRef }) {
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

  async function enviar(e) {
    e.preventDefault();
    const encontrados = validar(med);
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;

    const salvou = await aoSalvar({
      idosoId: idoso.id,
      nome: med.nome.trim(),
      dosagem: med.dosagem.trim(),
      forma: med.forma,
      via: med.via,
      frequencia: med.frequencia,
      horarios: med.horarios.slice().sort(),
      categoria: med.categoria.trim(),
      observacoes: med.observacoes.trim(),
      ativo: true,
      cadastradoPor: USUARIO.id,
      criadoEm: agoraIso(),
    });
    if (salvou) setMed({ ...VAZIO, horarios: horariosPadrao(1) });
  }

  return (
    <form className="card form" onSubmit={enviar} noValidate>
      <h2>
        <span className="icone-tile" aria-hidden="true"><IconePilula /></span>
        <span>
          Novo medicamento
          <small className="para">Para {idoso.apelido}</small>
        </span>
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
          Categoria (opcional)
          <input
            type="text"
            list="categorias"
            value={med.categoria}
            onChange={(e) => alterar('categoria', e.target.value)}
            placeholder="Ex.: Pressão arterial"
            maxLength="40"
          />
          <datalist id="categorias">
            {categorias.map((c) => <option key={c} value={c} />)}
          </datalist>
        </label>
      </div>

      <div className="linha">
        <label className="campo">
          Forma
          <select value={med.forma} onChange={(e) => alterar('forma', e.target.value)}>
            {formasMedicamento.map((f) => <option key={f}>{f}</option>)}
          </select>
        </label>

        <label className="campo">
          Via de administração
          <select value={med.via} onChange={(e) => alterar('via', e.target.value)}>
            {viasMedicamento.map((v) => <option key={v}>{v}</option>)}
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
