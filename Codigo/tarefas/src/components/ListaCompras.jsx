import { useState } from 'react';
import { dinheiro } from '../utils/tarefas.js';
import { IconeCarrinho } from './Icones.jsx';

/* junta os itens das compras ainda não concluídas */
export default function ListaCompras({ tarefas, aoComprar, secaoRef }) {
  const [marcados, setMarcados] = useState([]);

  const itens = [];
  tarefas
    .filter((t) => t.categoria === 'Compra' && t.status !== 'concluido')
    .forEach((t) => t.itensCompra.forEach((item, indice) => {
      itens.push({ ...item, chave: t.id + ':' + indice, tarefaId: t.id, indice });
    }));

  const total = itens.reduce((s, i) => s + i.preco, 0);
  const falta = itens.filter((i) => !i.comprado).reduce((s, i) => s + i.preco, 0);

  function alternar(chave) {
    setMarcados((m) => (m.includes(chave) ? m.filter((x) => x !== chave) : [...m, chave]));
  }

  async function comprar() {
    /* agrupa as posições marcadas por tarefa: { "trd-2": [0, 2] } */
    const porTarefa = {};
    itens
      .filter((i) => marcados.includes(i.chave))
      .forEach((i) => { porTarefa[i.tarefaId] = [...(porTarefa[i.tarefaId] || []), i.indice]; });
    const ok = await aoComprar(porTarefa);
    if (ok) setMarcados([]);
  }

  return (
    <section className="card compras" ref={secaoRef} aria-labelledby="compras-titulo">
      <h2 id="compras-titulo">
        <span className="icone-tile" aria-hidden="true"><IconeCarrinho /></span>
        Lista de compras do cuidado
      </h2>

      {itens.length === 0 ? (
        <p className="vazio">Nenhuma compra pendente. Crie uma tarefa da categoria Compra.</p>
      ) : (
        <>
          <ul className="itens-compra">
            {itens.map((i) => (
              <li key={i.chave} className={i.comprado ? 'comprado' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={i.comprado || marcados.includes(i.chave)}
                    disabled={i.comprado}
                    onChange={() => alternar(i.chave)}
                  />
                  <span className="item-nome">{i.nome}</span>
                  <span className="item-preco">{dinheiro(i.preco)}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="totais">
            <span>Falta comprar: <b>{dinheiro(falta)}</b></span>
            <span>Total: <b>{dinheiro(total)}</b></span>
          </div>
          <button type="button" className="btn btn-primario btn-largo" disabled={marcados.length === 0} onClick={comprar}>
            Marcar como comprado
          </button>
        </>
      )}
    </section>
  );
}
