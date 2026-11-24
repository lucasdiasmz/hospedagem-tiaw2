import { useEffect, useState } from 'react';
import Shell from '@ds/Shell.jsx';
import Dialogo from '@ds/Dialogo.jsx';
import { Estado, PaginaTopo } from '@ds/Componentes.jsx';
import { IconeBusca, IconeEscudo, IconeEstrela, IconeFiltro, IconeLocal, SetaDireita } from '@ds/Icones.jsx';
import { listarCuidadores } from './api.js';
import { DIAS, DIAS_CURTOS, EXPERIENCIAS, ORDEM_EXPERIENCIA, SERVICOS, dinheiro, iniciais, normalizar, nota } from './textos.js';

const ORDENS = [
    { id: 'avaliacao', rotulo: 'Melhor avaliados' },
    { id: 'preco', rotulo: 'Menor preço' },
    { id: 'experiencia', rotulo: 'Mais experiência' }
];

const FILTROS_VAZIOS = { servico: '', dia: '', precoMax: '', notaMin: 0, registro: false };

function ordenar(lista, ordem) {
    const copia = [...lista];
    if (ordem === 'preco') return copia.sort((a, b) => (a.valorHora ?? Infinity) - (b.valorHora ?? Infinity));
    if (ordem === 'experiencia') return copia.sort((a, b) => (ORDEM_EXPERIENCIA[b.experiencia] ?? -1) - (ORDEM_EXPERIENCIA[a.experiencia] ?? -1));
    return copia.sort((a, b) => (b.media ?? 0) - (a.media ?? 0) || b.totalAvaliacoes - a.totalAvaliacoes);
}

function CartaoCuidador({ c }) {
    return (
        <li>
            <a className="cuidador" href={'./perfil.html?id=' + encodeURIComponent(c.id)}>
                <span className="cuidador-foto" aria-hidden="true">{iniciais(c.nome)}</span>
                <span className="cuidador-corpo">
                    <span className="cuidador-nome">
                        <strong>{c.nome}</strong>
                        {c.registroProfissional && (
                            <span className="tag tag--verde" title="Informou registro em conselho profissional">
                                <IconeEscudo />Registro profissional
                            </span>
                        )}
                    </span>
                    <span className="cuidador-meta">
                        {c.media !== null ? (
                            <span className="cuidador-nota">
                                <IconeEstrela />
                                <strong>{nota(c.media)}</strong>
                                <span>({c.totalAvaliacoes})</span>
                            </span>
                        ) : (
                            <span className="cuidador-nota cuidador-nota--nova">Sem avaliações</span>
                        )}
                        {c.bairro && <span className="cuidador-local"><IconeLocal />{c.bairro}</span>}
                    </span>
                    {c.resumo && <span className="cuidador-resumo">{c.resumo}</span>}
                    <span className="cuidador-servicos">
                        {(c.especialidades.length ? c.especialidades : c.servicos.map(s => SERVICOS[s] || s)).slice(0, 3).map(e => (
                            <span key={e} className="tag">{e}</span>
                        ))}
                    </span>
                    <span className="cuidador-rodape">
                        <span>{EXPERIENCIAS[c.experiencia] || 'Experiência não informada'}</span>
                        <span className="cuidador-dias">{c.dias.map(d => DIAS_CURTOS[d]).join(' · ')}</span>
                    </span>
                </span>
                <span className="cuidador-preco">
                    {c.valorHora !== null ? <><strong>{dinheiro(c.valorHora)}</strong><small>por hora</small></> : <small>Preço a combinar</small>}
                    <SetaDireita />
                </span>
            </a>
        </li>
    );
}

/* Busca e filtragem de cuidadores (RF003) */
export default function Lista() {
    const [lista, setLista] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [tentativa, setTentativa] = useState(0);
    const [busca, setBusca] = useState('');
    const [ordem, setOrdem] = useState('avaliacao');
    const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);

    useEffect(() => {
        const controle = new AbortController();
        setCarregando(true);
        setErro('');
        listarCuidadores(controle.signal)
            .then(setLista)
            .catch(falha => {
                if (falha.name !== 'AbortError') setErro('Não foi possível carregar os cuidadores. Confira a conexão e tente de novo.');
            })
            .finally(() => { if (!controle.signal.aborted) setCarregando(false); });
        return () => controle.abort();
    }, [tentativa]);

    const termo = normalizar(busca.trim());
    const filtrados = ordenar(lista.filter(c => {
        if (termo && !normalizar([c.nome, c.bairro, c.cidade, ...c.especialidades].join(' ')).includes(termo)) return false;
        if (filtros.servico && !c.servicos.includes(filtros.servico)) return false;
        if (filtros.dia && !c.dias.includes(filtros.dia)) return false;
        if (filtros.precoMax && (c.valorHora === null || c.valorHora > Number(filtros.precoMax))) return false;
        if (filtros.notaMin && (c.media ?? 0) < filtros.notaMin) return false;
        if (filtros.registro && !c.registroProfissional) return false;
        return true;
    }), ordem);

    const ativos = Object.entries(filtros).filter(([chave, valor]) => valor && valor !== FILTROS_VAZIOS[chave]).length;

    function mudar(campo, valor) {
        setFiltros(atual => ({ ...atual, [campo]: valor }));
    }

    return (
        <Shell tela="cuidadores">
            <PaginaTopo titulo="Cuidadores" subtitulo="Encontre profissionais pela região, pelo serviço e pelos dias em que você precisa." />

            <div className="busca-linha">
                <div className="busca">
                    <IconeBusca />
                    <input
                        className="entrada"
                        type="search"
                        aria-label="Buscar por nome, bairro ou especialidade"
                        placeholder="Nome, bairro ou especialidade"
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-filtros" onClick={() => setFiltrosAbertos(true)} aria-haspopup="dialog">
                    <IconeFiltro />
                    Filtros{ativos > 0 && <span className="pilula-num">{ativos}</span>}
                </button>
            </div>

            <div className="pilulas servicos-rapidos" role="group" aria-label="Serviço">
                <button type="button" className="pilula" aria-pressed={!filtros.servico} onClick={() => mudar('servico', '')}>Todos</button>
                {Object.entries(SERVICOS).filter(([id]) => id !== 'outro').map(([id, rotulo]) => (
                    <button key={id} type="button" className="pilula" aria-pressed={filtros.servico === id} onClick={() => mudar('servico', filtros.servico === id ? '' : id)}>
                        {rotulo}
                    </button>
                ))}
            </div>

            {carregando && <Estado tipo="carregando" titulo="Buscando cuidadores…" />}

            {!carregando && erro && (
                <Estado tipo="erro" titulo="Algo deu errado" acao={
                    <button type="button" className="btn" onClick={() => setTentativa(t => t + 1)}>Tentar de novo</button>
                }>
                    <p>{erro}</p>
                </Estado>
            )}

            {!carregando && !erro && (
                <section aria-labelledby="resultado">
                    <div className="resultado-topo">
                        <h2 id="resultado" aria-live="polite">
                            {filtrados.length === 1 ? '1 cuidador' : filtrados.length + ' cuidadores'}
                        </h2>
                        <label className="ordenar">
                            <span>Ordenar</span>
                            <select className="entrada" value={ordem} onChange={e => setOrdem(e.target.value)}>
                                {ORDENS.map(o => <option key={o.id} value={o.id}>{o.rotulo}</option>)}
                            </select>
                        </label>
                    </div>

                    {filtrados.length === 0 ? (
                        <Estado titulo="Ninguém com esses filtros" acao={
                            <button type="button" className="btn" onClick={() => { setFiltros(FILTROS_VAZIOS); setBusca(''); }}>Limpar busca e filtros</button>
                        }>
                            <p>Tente outro dia da semana ou um valor por hora maior.</p>
                        </Estado>
                    ) : (
                        <ul className="cuidadores">
                            {filtrados.map(c => <CartaoCuidador key={c.id} c={c} />)}
                        </ul>
                    )}
                </section>
            )}

            <Dialogo aberto={filtrosAbertos} aoFechar={() => setFiltrosAbertos(false)} titulo="Filtros">
                <div className="formulario">
                    <label className="campo">
                        Disponível no dia
                        <select value={filtros.dia} onChange={e => mudar('dia', e.target.value)}>
                            <option value="">Qualquer dia</option>
                            {Object.entries(DIAS).map(([id, rotulo]) => <option key={id} value={id}>{rotulo}</option>)}
                        </select>
                    </label>

                    <label className="campo">
                        Valor máximo por hora
                        <select value={filtros.precoMax} onChange={e => mudar('precoMax', e.target.value)}>
                            <option value="">Qualquer valor</option>
                            {[30, 40, 50, 70].map(v => <option key={v} value={v}>Até {dinheiro(v)}</option>)}
                        </select>
                    </label>

                    <fieldset className="campo campo-sem-borda">
                        <legend>Avaliação mínima</legend>
                        <div className="segmentado">
                            {[0, 3, 4, 4.5].map(n => (
                                <button key={n} type="button" aria-pressed={filtros.notaMin === n} onClick={() => mudar('notaMin', n)}>
                                    {n ? nota(n) + '+' : 'Todas'}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <label className="interruptor">
                        <span className="interruptor-icone" aria-hidden="true"><IconeEscudo /></span>
                        <span className="interruptor-texto">
                            <strong>Só com registro profissional</strong>
                            <small>COREN, CREFITO e outros conselhos</small>
                        </span>
                        <input type="checkbox" role="switch" checked={filtros.registro} onChange={e => mudar('registro', e.target.checked)} />
                    </label>

                    <div className="dialogo-botoes">
                        <button type="button" className="btn" onClick={() => setFiltros(FILTROS_VAZIOS)}>Limpar</button>
                        <button type="button" className="btn btn-primario" onClick={() => setFiltrosAbertos(false)}>
                            Ver {filtrados.length === 1 ? '1 cuidador' : filtrados.length + ' cuidadores'}
                        </button>
                    </div>
                </div>
            </Dialogo>
        </Shell>
    );
}
