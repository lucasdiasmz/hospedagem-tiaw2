import { useEffect, useState } from 'react';
import { CATALOGOS, USUARIO } from '../data/db.js';
import { FREQUENCIAS, agoraIso, horariosPadrao, validar } from '../utils/medicamentos.js';

const { formasMedicamento, viasMedicamento } = CATALOGOS;

const VAZIO = {
  nome: '',
  dosagem: '',
  forma: formasMedicamento[0],
  via: viasMedicamento[0],
  frequencia: 1,
  categoria: '',
  observacoes: '',
  horarios: horariosPadrao(1),
};

/* formulário de cadastro; com "editando" preenchido, vira o formulário de edição */
export default function FormMedicamento({ idoso, categorias, editando, aoSalvar, aoCancelar, formRef }) {
  const [med, setMed] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setErros({});
    setMed(editando ? { ...VAZIO, ...editando, horarios: editando.horarios.slice() } : { ...VAZIO, horarios: horariosPadrao(1) });
  }, [editando]);

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
    if (Object.keys(encontrados).length) {
      /* leva o foco ao primeiro campo com erro */
      e.currentTarget.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const dados = {
      nome: med.nome.trim(),
      dosagem: med.dosagem.trim(),
      forma: med.forma,
      via: med.via,
      frequencia: med.frequencia,
      horarios: med.horarios.slice().sort(),
      categoria: med.categoria.trim(),
      observacoes: med.observacoes.trim(),
    };

    setSalvando(true);
    const salvou = await aoSalvar(editando ? dados : {
      ...dados,
      idosoId: idoso.id,
      ativo: true,
      cadastradoPor: USUARIO.id,
      criadoEm: agoraIso(),
    });
    setSalvando(false);
    if (salvou && !editando) setMed({ ...VAZIO, horarios: horariosPadrao(1) });
  }

  return (
    <form className={'card form' + (editando ? ' form--editando' : '')} onSubmit={enviar} noValidate ref={formRef} aria-labelledby="form-titulo">
      <div className="form-topo">
        <h2 id="form-titulo">{editando ? 'Editar ' + editando.nome : 'Novo medicamento'}</h2>
        <p>Para {idoso.apelido || idoso.nome}</p>
      </div>

      <label className="campo">
        Nome do medicamento
        <input
          type="text"
          value={med.nome}
          onChange={(e) => alterar('nome', e.target.value)}
          placeholder="Ex.: Losartana"
          maxLength="60"
          autoComplete="off"
          aria-invalid={erros.nome ? 'true' : undefined}
          aria-describedby={erros.nome ? 'erro-nome' : undefined}
        />
        {erros.nome && <span className="campo-erro" id="erro-nome">{erros.nome}</span>}
      </label>

      <div className="campos-linha">
        <label className="campo">
          Dosagem
          <input
            type="text"
            value={med.dosagem}
            onChange={(e) => alterar('dosagem', e.target.value)}
            placeholder="Ex.: 50 mg"
            maxLength="30"
            aria-invalid={erros.dosagem ? 'true' : undefined}
            aria-describedby={erros.dosagem ? 'erro-dosagem' : undefined}
          />
          {erros.dosagem && <span className="campo-erro" id="erro-dosagem">{erros.dosagem}</span>}
        </label>

        <label className="campo">
          <span>Categoria <small>(opcional)</small></span>
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

      <div className="campos-linha">
        <label className="campo">
          Forma
          <select value={med.forma} onChange={(e) => alterar('forma', e.target.value)}>
            {formasMedicamento.map((f) => <option key={f}>{f}</option>)}
          </select>
        </label>

        <label className="campo">
          Via de uso
          <select value={med.via} onChange={(e) => alterar('via', e.target.value)}>
            {viasMedicamento.map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
      </div>

      <fieldset className="campo">
        <legend>Quantas vezes por dia?</legend>
        <div className="segmentado">
          {FREQUENCIAS.map((f) => (
            <button key={f.valor} type="button" aria-pressed={med.frequencia === f.valor} onClick={() => alterarFrequencia(f.valor)}>
              {f.valor}×
            </button>
          ))}
        </div>
      </fieldset>

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
              aria-invalid={erros.horarios ? 'true' : undefined}
            />
          ))}
        </div>
        {erros.horarios && <span className="campo-erro">{erros.horarios}</span>}
      </fieldset>

      <label className="campo">
        <span>Observações <small>(opcional)</small></span>
        <textarea
          rows="3"
          maxLength="120"
          value={med.observacoes}
          onChange={(e) => alterar('observacoes', e.target.value)}
          placeholder="Ex.: Tomar após o café da manhã"
        ></textarea>
      </label>

      <div className="form-botoes">
        {editando && <button type="button" className="btn" onClick={aoCancelar}>Cancelar edição</button>}
        <button type="submit" className="btn btn-primario" disabled={salvando}>
          {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Cadastrar medicamento'}
        </button>
      </div>
    </form>
  );
}
