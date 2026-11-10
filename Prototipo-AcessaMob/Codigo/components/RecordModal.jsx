"use client";

import { useEffect, useState } from "react";
import Icon from "./Icons";

const emptyMedication = {
  nome: "",
  dose: "",
  horarios: "08:00",
  frequencia: "1x ao dia",
  categoria: "",
  observacao: "",
  ativo: true,
};
const emptyAppointment = {
  data: "",
  horario: "09:00",
  especialidade: "",
  profissional: "",
  local: "",
};

export default function RecordModal({ type, record, onClose, onSave }) {
  const isMedication = type === "medicamentos";
  const [form, setForm] = useState(() => makeInitialForm(type, record));
  const [error, setError] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const requiredFields = isMedication
      ? [form.nome, form.dose, form.horarios, form.frequencia]
      : [form.data, form.horario, form.especialidade, form.profissional, form.local];
    if (requiredFields.some((value) => !String(value || "").trim())) {
      setError("Preencha todos os campos obrigatórios para continuar.");
      return;
    }

    const normalized = isMedication
      ? {
          ...form,
          horarios: String(form.horarios)
            .split(/[;,]/)
            .map((time) => time.trim())
            .filter(Boolean),
          ativo: Boolean(form.ativo),
        }
      : { ...form };

    onSave(normalized);
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="record-modal" role="dialog" aria-modal="true" aria-labelledby="record-modal-title">
        <div className="modal-header">
          <div className={`modal-icon ${isMedication ? "medication-icon" : "appointment-icon"}`}>
            <Icon name={isMedication ? "pill" : "calendar"} size={22} />
          </div>
          <div className="modal-title-copy">
            <span className="eyebrow">AGENDA DE INFORMAÇÕES</span>
            <h2 id="record-modal-title">
              {record ? "Editar registro" : "Novo registro"}
            </h2>
            <p>{isMedication ? "Mantenha as informações do medicamento atualizadas." : "Adicione os detalhes da próxima consulta."}</p>
          </div>
          <button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Fechar formulário">
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="record-form">
          {isMedication ? (
            <>
              <div className="field-grid">
                <label className="field field-full">
                  <span>Nome do medicamento <b>*</b></span>
                  <input autoFocus value={form.nome} onChange={(event) => update("nome", event.target.value)} placeholder="Ex.: Losartana Potássica" required />
                </label>
                <label className="field">
                  <span>Dose <b>*</b></span>
                  <input value={form.dose} onChange={(event) => update("dose", event.target.value)} placeholder="Ex.: 50 mg" required />
                </label>
                <label className="field">
                  <span>Frequência <b>*</b></span>
                  <select value={form.frequencia} onChange={(event) => update("frequencia", event.target.value)} required>
                    <option>1x ao dia</option>
                    <option>2x ao dia</option>
                    <option>3x ao dia</option>
                    <option>A cada 8 horas</option>
                    <option>Conforme prescrição</option>
                  </select>
                </label>
                <label className="field field-full">
                  <span>Horários <b>*</b></span>
                  <input value={form.horarios} onChange={(event) => update("horarios", event.target.value)} placeholder="Ex.: 08:00, 20:00" required />
                  <small>Para mais de um horário, separe os valores por vírgula.</small>
                </label>
                <label className="field field-full">
                  <span>Categoria</span>
                  <input value={form.categoria} onChange={(event) => update("categoria", event.target.value)} placeholder="Ex.: Pressão arterial" />
                </label>
                <label className="field field-full">
                  <span>Orientações adicionais</span>
                  <textarea rows={3} value={form.observacao} onChange={(event) => update("observacao", event.target.value)} placeholder="Ex.: tomar após o café da manhã" />
                </label>
                <label className="switch-field field-full">
                  <span className="switch-copy"><strong>Medicamento ativo</strong><small>Exibir este medicamento na lista de uso atual.</small></span>
                  <input type="checkbox" checked={Boolean(form.ativo)} onChange={(event) => update("ativo", event.target.checked)} />
                </label>
              </div>
            </>
          ) : (
            <div className="field-grid">
              <label className="field">
                <span>Data <b>*</b></span>
                <input autoFocus type="date" value={form.data} onChange={(event) => update("data", event.target.value)} required />
              </label>
              <label className="field">
                <span>Horário <b>*</b></span>
                <input type="time" value={form.horario} onChange={(event) => update("horario", event.target.value)} required />
              </label>
              <label className="field field-full">
                <span>Especialidade <b>*</b></span>
                <input value={form.especialidade} onChange={(event) => update("especialidade", event.target.value)} placeholder="Ex.: Cardiologia" required />
              </label>
              <label className="field field-full">
                <span>Profissional <b>*</b></span>
                <input value={form.profissional} onChange={(event) => update("profissional", event.target.value)} placeholder="Nome do profissional" required />
              </label>
              <label className="field field-full">
                <span>Local <b>*</b></span>
                <input value={form.local} onChange={(event) => update("local", event.target.value)} placeholder="Clínica, hospital ou endereço" required />
              </label>
            </div>
          )}

          {error && <p className="form-error" role="alert"><Icon name="info" size={16} />{error}</p>}
          <div className="modal-footer">
            <span className="required-note"><b>*</b> Campos obrigatórios</span>
            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="button button-primary"><Icon name="check" size={17} />{record ? "Salvar alterações" : "Salvar registro"}</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

function makeInitialForm(type, record) {
  if (type === "medicamentos") {
    return record
      ? { ...record, horarios: (record.horarios || []).join(", ") }
      : { ...emptyMedication };
  }
  return record ? { ...record } : { ...emptyAppointment };
}
