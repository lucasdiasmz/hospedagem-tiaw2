"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "./Icons";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import RecordModal from "./RecordModal";
import { initialData, STORAGE_KEY } from "../lib/mock-data";

const todayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function formatDate(value, long = false) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  return (long ? longDateFormatter : dateFormatter).format(date);
}

export default function AgendaClient() {
  const [data, setData] = useState(initialData);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState("medicamentos");
  const [activeNav, setActiveNav] = useState("agenda");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("todos");
  const [modal, setModal] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData({
          medicamentos: Array.isArray(parsed.medicamentos) ? parsed.medicamentos : initialData.medicamentos,
          consultas: Array.isArray(parsed.consultas) ? parsed.consultas : initialData.consultas,
        });
      }
    } catch {
      setToast({ kind: "warning", message: "Não foi possível carregar os dados salvos. A demonstração seguirá com dados iniciais." });
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      setToast({ kind: "warning", message: "O navegador não permitiu salvar as alterações localmente." });
    }
  }, [data, hydrated]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = useCallback((message, kind = "success") => setToast({ message, kind }), []);

  const activeRecords = activeTab === "medicamentos" ? data.medicamentos : data.consultas;
  const visibleRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
    return activeRecords.filter((record) => {
      const searchable = activeTab === "medicamentos"
        ? [record.nome, record.dose, record.frequencia, record.categoria, record.observacao, ...(record.horarios || [])]
        : [record.data, record.horario, record.especialidade, record.profissional, record.local];
      const matchesSearch = !normalizedSearch || searchable.some((value) => String(value || "").toLocaleLowerCase("pt-BR").includes(normalizedSearch));
      let matchesFilter = true;
      if (activeTab === "medicamentos") {
        if (filterValue === "ativos") matchesFilter = Boolean(record.ativo);
        if (filterValue === "inativos") matchesFilter = !record.ativo;
        if (filterValue === "manha") matchesFilter = (record.horarios || []).some((time) => Number(time.slice(0, 2)) < 12);
        if (filterValue === "tarde") matchesFilter = (record.horarios || []).some((time) => Number(time.slice(0, 2)) >= 12 && Number(time.slice(0, 2)) < 18);
        if (filterValue === "noite") matchesFilter = (record.horarios || []).some((time) => Number(time.slice(0, 2)) >= 18);
      } else {
        if (filterValue === "futuras") matchesFilter = record.data >= todayString();
        if (filterValue === "anteriores") matchesFilter = record.data < todayString();
      }
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      if (activeTab === "medicamentos") return a.nome.localeCompare(b.nome, "pt-BR");
      return `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`);
    });
  }, [activeRecords, activeTab, filterValue, search]);

  const activeMedicationCount = data.medicamentos.filter((item) => item.ativo).length;
  const upcomingAppointmentCount = data.consultas.filter((item) => item.data >= todayString()).length;

  function switchTab(tab) {
    setActiveTab(tab);
    setActiveNav(tab === "medicamentos" ? "medicamentos" : "agenda");
    setFilterValue("todos");
    setSearch("");
    setSelectedId(null);
    setFilterOpen(false);
  }

  function handleNavigate(item) {
    if (item === "agenda") {
      switchTab("consultas");
      setActiveNav("agenda");
      return;
    }
    if (item === "medicamentos") {
      switchTab("medicamentos");
      setActiveNav("medicamentos");
      return;
    }
    const sectionNames = { inicio: "Início", historico: "Histórico", perfis: "Perfis" };
    showToast(`A seção ${sectionNames[item]} não faz parte desta etapa do protótipo.`, "info");
  }

  function openCreate(type) {
    switchTab(type);
    setModal({ type, record: null });
  }

  function openEdit(record) {
    setModal({ type: activeTab, record });
  }

  function saveRecord(formValue) {
    const type = modal.type;
    const isEditing = Boolean(modal.record);
    const id = modal.record?.id || `${type === "medicamentos" ? "med" : "con"}-${Date.now()}`;
    setData((current) => {
      const records = current[type];
      const savedRecord = { ...formValue, id };
      return {
        ...current,
        [type]: isEditing
          ? records.map((record) => record.id === id ? savedRecord : record)
          : [...records, savedRecord],
      };
    });
    setSelectedId(id);
    setModal(null);
    showToast(isEditing ? "Registro atualizado com sucesso." : "Registro cadastrado com sucesso.");
  }

  function deleteRecord(record) {
    const label = activeTab === "medicamentos" ? record.nome : `${record.especialidade} — ${formatDate(record.data, true)}`;
    if (!window.confirm(`Deseja excluir o registro “${label}”? Esta ação não poderá ser desfeita.`)) return;
    setData((current) => ({
      ...current,
      [activeTab]: current[activeTab].filter((item) => item.id !== record.id),
    }));
    if (selectedId === record.id) setSelectedId(null);
    showToast("Registro excluído da agenda.");
  }

  function handleTopbarAction() {
    showToast("As notificações e configurações de perfil ainda não estão conectadas neste protótipo.", "info");
  }

  const hasActiveFilter = filterValue !== "todos";
  const filterOptions = activeTab === "medicamentos"
    ? [
        { value: "todos", label: "Todos os medicamentos" },
        { value: "ativos", label: "Somente ativos" },
        { value: "inativos", label: "Somente inativos" },
        { value: "manha", label: "Horário pela manhã" },
        { value: "tarde", label: "Horário à tarde" },
        { value: "noite", label: "Horário à noite" },
      ]
    : [
        { value: "todos", label: "Todas as consultas" },
        { value: "futuras", label: "Próximas consultas" },
        { value: "anteriores", label: "Consultas anteriores" },
      ];

  return (
    <div className="app-shell">
      <Sidebar activeItem={activeNav} onNavigate={handleNavigate} />
      <div className="app-main">
        <Topbar onNotify={handleTopbarAction} />
        <main className="main-content" id="conteudo-principal">
          <div className="content-wrap">
            <div className="breadcrumbs"><span>Início</span><Icon name="chevron" size={14} /><strong>Agenda de informações</strong></div>
            <section className="page-heading">
              <div>
                <div className="heading-kicker"><span className="kicker-line" /> ORGANIZAÇÃO DO CUIDADO</div>
                <h1>Agenda de Informações</h1>
                <p>Cuide de cada detalhe. Medicamentos e consultas organizados em um só lugar.</p>
              </div>
              <div className="heading-date-card">
                <div className="date-card-icon"><Icon name="calendar" size={22} /></div>
                <div><span>HOJE É</span><strong>{formatDate(todayString(), true)}</strong><small>Pequenos cuidados fazem a diferença.</small></div>
              </div>
            </section>

            <section className="summary-grid" aria-label="Resumo da agenda">
              <article className="summary-card">
                <div className="summary-icon icon-blue"><Icon name="pill" size={21} /></div>
                <div className="summary-text"><span>Medicamentos ativos</span><strong>{activeMedicationCount.toString().padStart(2, "0")}</strong><small>em acompanhamento</small></div>
                <span className="summary-accent accent-blue" />
              </article>
              <article className="summary-card">
                <div className="summary-icon icon-lilac"><Icon name="calendar" size={21} /></div>
                <div className="summary-text"><span>Próximas consultas</span><strong>{upcomingAppointmentCount.toString().padStart(2, "0")}</strong><small>agendadas na sua agenda</small></div>
                <span className="summary-accent accent-lilac" />
              </article>
              <article className="summary-card">
                <div className="summary-icon icon-green"><Icon name="check" size={21} /></div>
                <div className="summary-text"><span>Registros organizados</span><strong>{(data.medicamentos.length + data.consultas.length).toString().padStart(2, "0")}</strong><small>medicamentos e consultas</small></div>
                <span className="summary-accent accent-green" />
              </article>
            </section>

            <section className="workspace-card" aria-labelledby="records-heading">
              <div className="workspace-top">
                <div className="workspace-title">
                  <span className="eyebrow">SUA ROTINA, MAIS SIMPLES</span>
                  <h2 id="records-heading">Seus registros</h2>
                  <p>Consulte, atualize ou adicione informações importantes.</p>
                </div>
                <div className="top-actions">
                  <button type="button" className="button button-secondary new-appointment" onClick={() => openCreate("consultas")}><Icon name="plus" size={17} />Nova consulta</button>
                  <button type="button" className="button button-primary" onClick={() => openCreate("medicamentos")}><Icon name="plus" size={17} />Novo medicamento</button>
                </div>
              </div>

              <div className="records-toolbar">
                <div className="tabs" role="tablist" aria-label="Tipo de registro">
                  <button type="button" role="tab" aria-selected={activeTab === "medicamentos"} className={`tab-button ${activeTab === "medicamentos" ? "is-active" : ""}`} onClick={() => switchTab("medicamentos")}>
                    <Icon name="pill" size={17} /><span>Medicamentos</span><span className="tab-count">{data.medicamentos.length}</span>
                  </button>
                  <button type="button" role="tab" aria-selected={activeTab === "consultas"} className={`tab-button ${activeTab === "consultas" ? "is-active" : ""}`} onClick={() => switchTab("consultas")}>
                    <Icon name="calendar" size={17} /><span>Consultas</span><span className="tab-count">{data.consultas.length}</span>
                  </button>
                </div>
                <div className="search-controls">
                  <label className="search-field">
                    <Icon name="search" size={18} />
                    <input aria-label="Buscar registros" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={activeTab === "medicamentos" ? "Buscar medicamento, dose ou categoria..." : "Buscar profissional, local ou data..."} />
                    {search && <button type="button" className="search-clear" aria-label="Limpar busca" onClick={() => setSearch("")}><Icon name="close" size={15} /></button>}
                  </label>
                  <div className="filter-wrapper">
                    <button type="button" className={`filter-button ${hasActiveFilter ? "filter-active" : ""}`} aria-expanded={filterOpen} onClick={() => setFilterOpen((open) => !open)}>
                      <Icon name="filter" size={18} /><span>Filtros</span>{hasActiveFilter && <span className="filter-indicator" />}
                    </button>
                    {filterOpen && (
                      <div className="filter-menu">
                        <div className="filter-menu-head"><strong>Filtrar registros</strong><button type="button" className="plain-icon-button" onClick={() => setFilterOpen(false)} aria-label="Fechar filtros"><Icon name="close" size={16} /></button></div>
                        <label className="field filter-select"><span>{activeTab === "medicamentos" ? "Exibir" : "Período"}</span><select value={filterValue} onChange={(event) => setFilterValue(event.target.value)}>{filterOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
                        <div className="filter-menu-footer"><button type="button" className="text-button" onClick={() => setFilterValue("todos")}>Limpar filtros</button><button type="button" className="button button-primary button-small" onClick={() => setFilterOpen(false)}>Aplicar</button></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="table-meta">
                <div><span className="result-dot" /><span>{visibleRecords.length} {visibleRecords.length === 1 ? "registro encontrado" : "registros encontrados"}</span>{hasActiveFilter && <span className="active-filter-chip">{filterOptions.find((option) => option.value === filterValue)?.label}<button type="button" onClick={() => setFilterValue("todos")} aria-label="Remover filtro"><Icon name="close" size={12} /></button></span>}</div>
                <span className="meta-right">Atualizado localmente <Icon name="info" size={14} /></span>
              </div>

              {activeTab === "medicamentos" ? (
                <div className="table-scroll">
                  <table className="records-table medicine-table">
                    <thead><tr><th className="select-col"><span className="sr-only">Selecionar</span></th><th>Medicamento</th><th>Dose</th><th>Horários</th><th>Frequência</th><th>Status</th><th className="actions-col">Ações</th></tr></thead>
                    <tbody>
                      {visibleRecords.map((record) => <tr key={record.id} className={selectedId === record.id ? "selected-row" : ""}>
                        <td className="select-col"><input className="row-checkbox" type="checkbox" checked={selectedId === record.id} onChange={() => setSelectedId((current) => current === record.id ? null : record.id)} aria-label={`Selecionar ${record.nome}`} /></td>
                        <td><div className="record-name-cell"><span className="record-symbol medication-symbol"><Icon name="pill" size={17} /></span><div><strong>{record.nome}</strong><small>{record.categoria || record.observacao || "Sem orientação adicional"}</small></div></div></td>
                        <td><span className="dose-pill">{record.dose}</span></td>
                        <td><div className="time-list">{(record.horarios || []).map((time) => <span className="time-chip" key={time}><Icon name="clock" size={13} />{time}</span>)}</div></td>
                        <td><span className="frequency-text">{record.frequencia}</span></td>
                        <td><span className={`status-pill ${record.ativo ? "status-active" : "status-paused"}`}><span />{record.ativo ? "Ativo" : "Inativo"}</span></td>
                        <td className="actions-col"><div className="row-actions"><button type="button" className="action-icon edit-action" onClick={() => openEdit(record)} aria-label={`Editar ${record.nome}`} title="Editar registro"><Icon name="edit" size={16} /></button><button type="button" className="action-icon delete-action" onClick={() => deleteRecord(record)} aria-label={`Excluir ${record.nome}`} title="Excluir registro"><Icon name="trash" size={16} /></button></div></td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="table-scroll">
                  <table className="records-table appointment-table">
                    <thead><tr><th className="select-col"><span className="sr-only">Selecionar</span></th><th>Data e horário</th><th>Especialidade / profissional</th><th>Local</th><th>Status</th><th className="actions-col">Ações</th></tr></thead>
                    <tbody>
                      {visibleRecords.map((record) => <tr key={record.id} className={selectedId === record.id ? "selected-row" : ""}>
                        <td className="select-col"><input className="row-checkbox" type="checkbox" checked={selectedId === record.id} onChange={() => setSelectedId((current) => current === record.id ? null : record.id)} aria-label={`Selecionar consulta de ${record.especialidade}`} /></td>
                        <td><div className="appointment-date-cell"><span className="date-day-icon"><Icon name="calendar" size={17} /></span><div><strong>{formatDate(record.data)}</strong><small><Icon name="clock" size={12} />{record.horario}</small></div></div></td>
                        <td><div className="record-name-cell"><span className="record-symbol appointment-symbol"><Icon name="users" size={17} /></span><div><strong>{record.especialidade}</strong><small>{record.profissional}</small></div></div></td>
                        <td><span className="location-text"><Icon name="location" size={15} />{record.local}</span></td>
                        <td><span className={`status-pill ${record.data >= todayString() ? "status-active" : "status-past"}`}><span />{record.data >= todayString() ? "Agendada" : "Realizada"}</span></td>
                        <td className="actions-col"><div className="row-actions"><button type="button" className="action-icon edit-action" onClick={() => openEdit(record)} aria-label={`Editar consulta de ${record.especialidade}`} title="Editar registro"><Icon name="edit" size={16} /></button><button type="button" className="action-icon delete-action" onClick={() => deleteRecord(record)} aria-label={`Excluir consulta de ${record.especialidade}`} title="Excluir registro"><Icon name="trash" size={16} /></button></div></td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              )}

              {visibleRecords.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon"><Icon name={search || hasActiveFilter ? "search" : activeTab === "medicamentos" ? "pill" : "calendar"} size={27} /></div>
                  <h3>{search || hasActiveFilter ? "Nenhum registro encontrado" : "Sua agenda está pronta para começar"}</h3>
                  <p>{search || hasActiveFilter ? "Tente ajustar a busca ou remover os filtros aplicados." : "Adicione o primeiro registro para manter as informações organizadas."}</p>
                  {(search || hasActiveFilter) ? <button type="button" className="button button-secondary button-small" onClick={() => { setSearch(""); setFilterValue("todos"); }}>Limpar busca e filtros</button> : <button type="button" className="button button-primary button-small" onClick={() => openCreate(activeTab)}><Icon name="plus" size={16} />Adicionar registro</button>}
                </div>
              )}

              <div className="workspace-footer">
                <div className="footer-note"><span className="footer-note-icon"><Icon name="info" size={15} /></span><span>Protótipo demonstrativo: utilize as informações como exemplos, não como orientação médica.</span></div>
                <span className="local-save-status"><span className="save-dot" />{hydrated ? "Salvamento local ativo" : "Carregando seus dados..."}</span>
              </div>
            </section>
            <footer className="page-footer"><span>© 2026 AcessaMob</span><span>Mais cuidado, todos os dias.</span></footer>
          </div>
        </main>
      </div>

      {modal && <RecordModal key={`${modal.type}-${modal.record?.id || "new"}`} type={modal.type} record={modal.record} onClose={() => setModal(null)} onSave={saveRecord} />}
      {toast && <div className={`toast toast-${toast.kind || "success"}`} role="status"><span className="toast-icon"><Icon name={toast.kind === "warning" ? "info" : toast.kind === "info" ? "info" : "check"} size={17} /></span><span>{toast.message}</span><button type="button" onClick={() => setToast(null)} aria-label="Fechar aviso"><Icon name="close" size={15} /></button></div>}
    </div>
  );
}
