import { useEffect, useRef, useState } from 'react';
import { hojeIso, nomeCurto, sugerirResponsavel, validar } from '../utils/tarefas.js';
import Dialogo from '@ds/Dialogo.jsx';
import { IconeLixeira, IconeMais } from './Icones.jsx';

const categoriasTarefaRede = ['Consulta', 'Compra', 'Medicamento', 'Outro'];

function vazio(sugerido) {
  return {
    titulo: '',
    categoria: categoriasTarefaRede[0],
    responsavelId: sugerido.id,
    data: '',
    hora: '',
    observacoes: '',
    avisarResponsavel: true,
    avisarRedeSeAtrasar: false,
    itens: [{ nome: '', preco: '' }],
  };
}

/* janela (modal) de criação de tarefa */
export default function FormTarefa({ idoso, membros, tarefas, aoSalvar, aoFechar }) {
  const sugerido = sugerirResponsavel(membros, tarefas);
  const [t, setT] = useState(() => vazio(sugerido));
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const tituloRef = useRef(null);

  /* o <dialog> já fecha com Esc e prende o foco; só leva o foco ao título depois de abrir */
  useEffect(() => {
    requestAnimationFrame(() => tituloRef.current?.focus());
  }, []);

  function alterar(campo, valor) {
    setT((x) => ({ ...x, [campo]: valor }));
    const chave = campo === 'data' || campo === 'hora' ? 'prazo' : campo;
    setErros((e) => ({ ...e, [chave]: undefined }));
  }

  function alterarItem(indice, campo, valor) {
    const itens = t.itens.map((i, n) => (n === indice ? { ...i, [campo]: valor } : i));
    alterar('itens', itens);
  }

  function adicionarItem() {
    alterar('itens', [...t.itens, { nome: '', preco: '' }]);
  }

  function removerItem(indice) {
    alterar('itens', t.itens.filter((_, n) => n !== indice));
  }

  async function enviar(e) {
    e.preventDefault();
    const encontrados = validar(t);
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;

    setSalvando(true);
    const salvou = await aoSalvar({
      idosoId: idoso.id,
      titulo: t.titulo.trim(),
      categoria: t.categoria,
      responsavelId: t.responsavelId,
      responsavelSugerido: t.responsavelId === sugerido.id,
      prazo: t.data + 'T' + t.hora + ':00',
      observacoes: t.observacoes.trim(),
      lembretes: {
        avisarResponsavel: t.avisarResponsavel,
        antecedenciaMinutos: 60,
        avisarRedeSeAtrasar: t.avisarRedeSeAtrasar,
      },
      itensCompra: t.categoria === 'Compra'
        ? t.itens.map((i) => ({ nome: i.nome.trim(), preco: Number(i.preco), comprado: false }))
        : [],
    });
    setSalvando(false);
    if (salvou) aoFechar();
  }

  return (
    <Dialogo aberto aoFechar={aoFechar} titulo="Nova tarefa" descricao={'Distribua o cuidado de ' + idoso.apelido + ' entre a rede de apoio.'} largo>
      <form className="form-tarefa" onSubmit={enviar} noValidate>
        <label className="campo">
          Título da tarefa
          <input
            ref={tituloRef}
            type="text"
            value={t.titulo}
            onChange={(e) => alterar('titulo', e.target.value)}
            placeholder="Ex.: Comprar fraldas"
            maxLength="60"
            aria-invalid={erros.titulo ? 'true' : undefined}
          />
          {erros.titulo && <span className="campo-erro" role="alert">{erros.titulo}</span>}
        </label>

        <label className="campo">
          Observações (opcional)
          <textarea
            rows="1"
            maxLength="120"
            value={t.observacoes}
            onChange={(e) => alterar('observacoes', e.target.value)}
            placeholder="Ex.: Tamanho G"
          ></textarea>
        </label>

        <fieldset className="campo tudo">
          <legend>Categoria</legend>
          <div className="opcoes">
            {categoriasTarefaRede.map((c) => (
              <label key={c} className={'opcao' + (t.categoria === c ? ' marcada' : '')}>
                <input
                  type="radio"
                  name="categoria"
                  value={c}
                  checked={t.categoria === c}
                  onChange={() => alterar('categoria', c)}
                />
                {c}
              </label>
            ))}
          </div>
        </fieldset>

        {t.categoria === 'Compra' && (
          <fieldset className="campo tudo">
            <legend>Itens da compra</legend>
            <div className="itens-form">
              {t.itens.map((i, n) => (
                <div className="item-form" key={n}>
                  <input
                    type="text"
                    value={i.nome}
                    onChange={(e) => alterarItem(n, 'nome', e.target.value)}
                    placeholder="Ex.: Fralda geriátrica"
                    maxLength="40"
                    aria-label={'Nome do item ' + (n + 1)}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={i.preco}
                    onChange={(e) => alterarItem(n, 'preco', e.target.value)}
                    placeholder="R$"
                    aria-label={'Preço do item ' + (n + 1)}
                  />
                  <button
                    type="button"
                    className="remover"
                    onClick={() => removerItem(n)}
                    disabled={t.itens.length === 1}
                    aria-label={'Remover item ' + (n + 1)}
                  >
                    <IconeLixeira />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-texto adicionar" onClick={adicionarItem}>
              <IconeMais /> Adicionar item
            </button>
            {erros.itens && <span className="campo-erro" role="alert">{erros.itens}</span>}
          </fieldset>
        )}

        <label className="campo">
          Responsável
          <select
            value={t.responsavelId}
            onChange={(e) => alterar('responsavelId', e.target.value)}
            aria-invalid={erros.responsavelId ? 'true' : undefined}
          >
            {membros.map((m) => (
              <option key={m.id} value={m.id}>
                {nomeCurto(m)} ({m.papel}){m.id === sugerido.id ? ' · sugerido' : ''}
              </option>
            ))}
          </select>
          <span className="dica">Sugestão: {nomeCurto(sugerido)}, com menos tarefas abertas.</span>
          {erros.responsavelId && <span className="campo-erro" role="alert">{erros.responsavelId}</span>}
        </label>

        <fieldset className="campo">
          <legend>Prazo</legend>
          <div className="linha">
            <input
              type="date"
              min={hojeIso()}
              value={t.data}
              onChange={(e) => alterar('data', e.target.value)}
              aria-label="Data do prazo"
              aria-invalid={erros.prazo ? 'true' : undefined}
            />
            <input
              type="time"
              value={t.hora}
              onChange={(e) => alterar('hora', e.target.value)}
              aria-label="Hora do prazo"
              aria-invalid={erros.prazo ? 'true' : undefined}
            />
          </div>
          {erros.prazo && <span className="campo-erro" role="alert">{erros.prazo}</span>}
        </fieldset>

        <fieldset className="campo tudo lembretes">
          <legend>Lembrete</legend>
          <label className="interruptor">
            <span className="interruptor-texto">
              <strong>Avisar o responsável</strong>
              <small>1 hora antes do prazo</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={t.avisarResponsavel}
              onChange={(e) => alterar('avisarResponsavel', e.target.checked)}
            />
          </label>
          <label className="interruptor">
            <span className="interruptor-texto">
              <strong>Avisar a rede se atrasar</strong>
              <small>Envia aos demais membros</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={t.avisarRedeSeAtrasar}
              onChange={(e) => alterar('avisarRedeSeAtrasar', e.target.checked)}
            />
          </label>
        </fieldset>

        <div className="dialogo-botoes">
          <button type="button" className="btn" onClick={aoFechar}>Cancelar</button>
          <button type="submit" className="btn btn-primario" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar tarefa'}
          </button>
        </div>
      </form>
    </Dialogo>
  );
}
