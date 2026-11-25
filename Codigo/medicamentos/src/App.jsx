import { useEffect, useState } from 'react';
import Shell from '@ds/Shell.jsx';
import Dialogo from '@ds/Dialogo.jsx';
import Toast from '@ds/Toast.jsx';
import { Estado, PaginaTopo, ReguaDoDia } from '@ds/Componentes.jsx';
import { IconeBusca, IconeCheck, IconeMais, IconeRelogio } from '@ds/Icones.jsx';
import { TELAS, urlApi } from '@ds/navegacao.js';
import { usePermissoes } from '@ds/permissoes.js';
import Detalhes from './Detalhes.jsx';

/* local: o Vite repassa /api para servidor.js; publicado: a API no Render */
const URL_API = urlApi('medicamentos') + '/api';

async function listarMedicamentos(idosoId, signal) {
    const resposta = await fetch(URL_API + '/medicamentos?idosoId=' + encodeURIComponent(idosoId), { signal });
    if (!resposta.ok) {
        throw new Error('Não foi possível carregar os medicamentos.');
    }
    return resposta.json();
}

async function salvarStatus(id, status, data) {
    const resposta = await fetch(URL_API + '/medicamentos/' + encodeURIComponent(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, data })
    });
    if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(erro.mensagem || 'Não foi possível salvar o registro.');
    }
    return resposta.json();
}

function normalizar(texto) {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function horaAgora() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

/* manhã até 11:59, tarde até 17:59, noite depois */
const PERIODOS = [
    { id: 'manha', rotulo: 'Manhã', ate: '12:00' },
    { id: 'tarde', rotulo: 'Tarde', ate: '18:00' },
    { id: 'noite', rotulo: 'Noite', ate: '24:00' },
];

const TAG_STATUS = {
    Tomado: 'tag tag--verde',
    Recusado: 'tag tag--ambar',
    Atrasado: 'tag tag--vermelho',
    Pendente: 'tag',
};

/* o idoso escolhido fica guardado para a próxima visita */
const CHAVE_IDOSO = 'acessamob_idoso_medicamentos';

function minutosDoDia(hora) {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
}

export default function App() {
    const [medicamentos, setMedicamentos] = useState([]);
    const [idosos, setIdosos] = useState([]);
    const [idosoId, setIdosoId] = useState(() => localStorage.getItem(CHAVE_IDOSO) || '');
    const [busca, setBusca] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [aviso, setAviso] = useState(null);
    const [salvandoId, setSalvandoId] = useState(null);
    const [selecionado, setSelecionado] = useState(null);
    const [tentativa, setTentativa] = useState(0);
    const [adiantada, setAdiantada] = useState(null);
    const agora = horaAgora();
    /* só o familiar cadastra remédio novo; todos registram as doses */
    const { perfil, pode } = usePermissoes();
    /* o próprio idoso lê os botões em primeira pessoa */
    const rotuloTomou = perfil === 'idoso' ? 'Já tomei' : 'Tomou';
    const rotuloRecusou = perfil === 'idoso' ? 'Recusei' : 'Recusou';
    const podeCadastrar = pode('medicamentos.cadastrar');

    useEffect(() => {
        const controle = new AbortController();

        async function carregar() {
            setCarregando(true);
            setErro('');
            try {
                const resposta = await fetch(URL_API + '/idosos', { signal: controle.signal });
                if (!resposta.ok) throw new Error('Falha ao carregar idosos.');
                const lista = await resposta.json();
                setIdosos(lista);
                /* antes o id 'ido-1' ficava fixo no código; agora usa o primeiro da lista */
                const atual = lista.some((i) => i.id === idosoId) ? idosoId : lista[0]?.id;
                if (!atual) {
                    setMedicamentos([]);
                    return;
                }
                if (atual !== idosoId) setIdosoId(atual);
                setMedicamentos(await listarMedicamentos(atual, controle.signal));
            } catch (falha) {
                if (falha.name !== 'AbortError') {
                    setErro('Não foi possível carregar os medicamentos. Confira a conexão e tente de novo.');
                }
            } finally {
                if (!controle.signal.aborted) setCarregando(false);
            }
        }

        carregar();
        return () => controle.abort();
    }, [idosoId, tentativa]);

    function escolherIdoso(id) {
        localStorage.setItem(CHAVE_IDOSO, id);
        setIdosoId(id);
    }

    function avisar(msg, tipo) {
        setAviso({ msg, tipo, id: Date.now() });
    }

    /* dose de mais de 1 hora à frente pede confirmação: pode ser toque no remédio errado */
    function registrarTomado(medicamento) {
        if (minutosDoDia(medicamento.horario) - minutosDoDia(horaAgora()) > 60) setAdiantada(medicamento);
        else alterarStatus(medicamento, 'Tomado');
    }

    async function alterarStatus(medicamento, novoStatus) {
        setSalvandoId(medicamento.id);
        try {
            const atualizado = await salvarStatus(medicamento.id, novoStatus, medicamento.data);
            setMedicamentos((lista) => lista.map((item) => (item.id === atualizado.id ? atualizado : item)));
            const textos = {
                Tomado: medicamento.nome + ' registrado como tomado',
                Recusado: 'Recusa registrada: ' + medicamento.nome,
                Pendente: 'Registro de ' + medicamento.nome + ' desfeito',
            };
            avisar(textos[novoStatus]);
        } catch (falha) {
            avisar('Não foi possível salvar: ' + falha.message, 'erro');
        } finally {
            setSalvandoId(null);
        }
    }

    /* "Atrasado" é só visual: dose pendente cujo horário já passou */
    const comStatus = medicamentos.map((m) => ({
        ...m,
        statusTela: m.status === 'Pendente' && m.horario < agora ? 'Atrasado' : m.status,
    }));
    const termo = normalizar(busca.trim());
    const filtrados = comStatus.filter((m) => normalizar(m.nome).includes(termo));
    const proximo = comStatus.filter((m) => m.status === 'Pendente').sort((a, b) => a.horario.localeCompare(b.horario))[0];
    const tomados = medicamentos.filter((m) => m.status === 'Tomado').length;
    const nomeIdoso = idosos.find((i) => i.id === idosoId)?.nome;

    let subtitulo = 'Os remédios do dia, dose por dose.';
    if (!carregando && medicamentos.length > 0) {
        subtitulo = tomados + ' de ' + medicamentos.length + ' doses registradas hoje' + (nomeIdoso ? ' para ' + nomeIdoso.split(' ')[0] : '') + '.';
    }

    const regua = comStatus.map((m) => ({
        id: m.id,
        hora: m.horario,
        titulo: m.nome,
        tipo: 'med',
        status: { Tomado: 'feito', Recusado: 'recusou', Atrasado: 'atrasado' }[m.statusTela] || null,
    }));

    const atalhos = podeCadastrar ? [{ rotulo: 'Cadastrar medicamento', Icone: IconeMais, href: TELAS.cadastroMedicamentos }] : [];

    return (
        <Shell tela="medicamentos" atalhos={atalhos}>
            <PaginaTopo titulo="Medicamentos" subtitulo={subtitulo}>
                {podeCadastrar && (
                    <a className="btn btn-suave" href={TELAS.cadastroMedicamentos}>
                        <IconeMais />
                        Cadastrar medicamento
                    </a>
                )}
            </PaginaTopo>

            {idosos.length > 1 && (
                <div className="pilulas seletor-idoso" role="radiogroup" aria-label="Medicamentos de">
                    {idosos.map((idoso) => (
                        <button
                            key={idoso.id}
                            type="button"
                            role="radio"
                            className="pilula"
                            aria-checked={idoso.id === idosoId}
                            disabled={salvandoId !== null}
                            onClick={() => escolherIdoso(idoso.id)}
                        >
                            {idoso.nome}
                        </button>
                    ))}
                </div>
            )}

            {carregando && <Estado tipo="carregando" titulo="Carregando medicamentos…" />}

            {!carregando && erro && (
                <Estado tipo="erro" titulo="Algo deu errado" acao={
                    <button type="button" className="btn" onClick={() => setTentativa((t) => t + 1)}>Tentar de novo</button>
                }>
                    <p>{erro}</p>
                </Estado>
            )}

            {!carregando && !erro && medicamentos.length === 0 && (
                <Estado titulo="Nenhum medicamento ativo" acao={podeCadastrar && (
                    <a className="btn btn-primario" href={TELAS.cadastroMedicamentos}><IconeMais />Cadastrar o primeiro</a>
                )}>
                    <p>{podeCadastrar
                        ? 'Cadastre os remédios com dosagem e horários para acompanhar cada dose aqui.'
                        : 'Quando o familiar responsável cadastrar os remédios, as doses aparecem aqui.'}</p>
                </Estado>
            )}

            {!carregando && !erro && medicamentos.length > 0 && (
                <>
                    <section className="dose-destaque" aria-labelledby="titulo-proximo">
                        {proximo ? (
                            <>
                                <div className="dose-destaque-topo">
                                    <time className="dose-destaque-hora">{proximo.horario}</time>
                                    <div>
                                        <p id="titulo-proximo" className="dose-destaque-rotulo">
                                            {proximo.horario < agora ? 'Dose atrasada' : 'Próxima dose'}
                                        </p>
                                        <h2>{proximo.nome} <span>{proximo.dosagem}</span></h2>
                                        {proximo.observacoes && proximo.observacoes !== 'Sem observações.' && (
                                            <p className="dose-destaque-obs">{proximo.observacoes}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="dose-destaque-acoes">
                                    <button type="button" className="btn btn-claro" disabled={salvandoId !== null} onClick={() => registrarTomado(proximo)}>
                                        <IconeCheck />
                                        {rotuloTomou}
                                    </button>
                                    <button type="button" className="btn btn-contorno" disabled={salvandoId !== null} onClick={() => alterarStatus(proximo, 'Recusado')}>
                                        {rotuloRecusou}
                                    </button>
                                    <button type="button" className="btn btn-contorno" onClick={() => setSelecionado(proximo)}>
                                        Detalhes
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="dose-destaque-topo">
                                <span className="dose-destaque-ok"><IconeCheck /></span>
                                <div>
                                    <p id="titulo-proximo" className="dose-destaque-rotulo">Doses de hoje</p>
                                    <h2>Nenhuma dose pendente</h2>
                                </div>
                            </div>
                        )}
                        <ReguaDoDia itens={regua} agora={agora} />
                    </section>

                    <section className="doses" aria-labelledby="titulo-lista">
                        <div className="secao-cabeca">
                            <h2 id="titulo-lista">Doses de hoje</h2>
                        </div>

                        <div className="busca">
                            <IconeBusca />
                            <input
                                className="entrada"
                                type="search"
                                aria-label="Buscar medicamento pelo nome"
                                placeholder="Buscar pelo nome"
                                autoComplete="off"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                            />
                        </div>

                        {filtrados.length === 0 && (
                            <p className="doses-vazio">Nenhum medicamento com “{busca}”.</p>
                        )}

                        {PERIODOS.map((periodo, i) => {
                            const de = i === 0 ? '00:00' : PERIODOS[i - 1].ate;
                            const doPeriodo = filtrados.filter((m) => m.horario >= de && m.horario < periodo.ate);
                            if (!doPeriodo.length) return null;
                            return (
                                <div key={periodo.id} className="periodo">
                                    <h3>{periodo.rotulo}</h3>
                                    <ul className="dose-lista">
                                        {doPeriodo.map((m) => {
                                            const salvando = salvandoId === m.id;
                                            const registrado = m.status !== 'Pendente';
                                            return (
                                                <li key={m.id} className={'dose dose--' + m.statusTela.toLowerCase()}>
                                                    <time className="dose-hora">{m.horario}</time>
                                                    <button type="button" className="dose-info" onClick={() => setSelecionado(m)} aria-label={'Detalhes de ' + m.nome + ' ' + m.dosagem}>
                                                        <strong>{m.nome}</strong>
                                                        <span>{m.dosagem} · {m.frequencia}</span>
                                                        <span className={TAG_STATUS[m.statusTela]}>
                                                            {m.statusTela === 'Atrasado' && <IconeRelogio />}
                                                            {m.statusTela}
                                                        </span>
                                                    </button>
                                                    <div className="dose-acoes" aria-busy={salvando}>
                                                        {registrado ? (
                                                            <button type="button" className="btn btn-texto" disabled={salvandoId !== null} onClick={() => alterarStatus(m, 'Pendente')}>
                                                                {salvando ? 'Salvando…' : 'Desfazer'}
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button type="button" className="btn btn-primario" disabled={salvandoId !== null}
                                                                    aria-label={rotuloTomou + ' ' + m.nome} onClick={() => registrarTomado(m)}>
                                                                    <IconeCheck />
                                                                    <span>{salvando ? 'Salvando…' : rotuloTomou}</span>
                                                                </button>
                                                                <button type="button" className="btn" disabled={salvandoId !== null}
                                                                    aria-label={rotuloRecusou + ' ' + m.nome} onClick={() => alterarStatus(m, 'Recusado')}>
                                                                    {rotuloRecusou}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </section>
                </>
            )}

            <Toast aviso={aviso} />
            <Dialogo aberto={adiantada !== null} aoFechar={() => setAdiantada(null)} titulo="Registrar antes da hora?"
                descricao={adiantada ? adiantada.nome + ' ' + adiantada.dosagem + ' está marcado para as ' + adiantada.horario + '.' : ''}>
                <div className="dialogo-botoes">
                    <button type="button" className="btn" onClick={() => setAdiantada(null)}>Cancelar</button>
                    <button type="button" className="btn btn-primario" onClick={() => { setAdiantada(null); alterarStatus(adiantada, 'Tomado'); }}>
                        Sim, já foi tomado
                    </button>
                </div>
            </Dialogo>
            <Detalhes medicamento={selecionado} aoFechar={() => setSelecionado(null)} />
        </Shell>
    );
}
