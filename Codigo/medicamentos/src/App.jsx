import { useEffect, useState } from 'react';
import Detalhes from './Detalhes.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import { IconeCheck, IconePilula } from './components/Icones.jsx';

async function listarMedicamentos(idosoId, signal) {
    const resposta = await fetch('/api/medicamentos?idosoId=' + encodeURIComponent(idosoId), { signal });

    if (!resposta.ok) {
        throw new Error('Não foi possível carregar os medicamentos. Confira se a API está ligada.');
    }

    return resposta.json();
}

async function salvarStatus(id, status, data) {
    const resposta = await fetch('/api/medicamentos/' + encodeURIComponent(id), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, data })
    });

    if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.mensagem || 'Não foi possível salvar o registro.');
    }

    return resposta.json();
}

function normalizar(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function buscarMedicamentos(medicamentos, busca) {
    const nomeBuscado = normalizar(busca.trim());

    return medicamentos.filter(medicamento => {
        return normalizar(medicamento.nome).includes(nomeBuscado);
    });
}

function encontrarProximo(medicamentos) {
    const pendentes = medicamentos.filter(medicamento => {
        return medicamento.status === 'Pendente';
    });

    pendentes.sort((primeiro, segundo) => {
        return primeiro.horario.localeCompare(segundo.horario);
    });

    return pendentes[0];
}

export default function App() {
    const [medicamentos, setMedicamentos] = useState([]);
    const [idosos, setIdosos] = useState([]);
    const [idosoId, setIdosoId] = useState('ido-1');
    const [busca, setBusca] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [aviso, setAviso] = useState(null);
    const [salvandoId, setSalvandoId] = useState(null);
    const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        const controle = new AbortController();

        async function carregar() {
            setCarregando(true);
            setMedicamentos([]);
            setErro('');
            setMedicamentoSelecionado(null);

            try {
                const [dados, respostaIdosos] = await Promise.all([
                    listarMedicamentos(idosoId, controle.signal),
                    fetch('/api/idosos', { signal: controle.signal })
                ]);

                if (!respostaIdosos.ok) {
                    throw new Error('Falha ao carregar idosos.');
                }

                setIdosos(await respostaIdosos.json());
                setMedicamentos(dados);
            } catch (falha) {
                if (falha.name !== 'AbortError') {
                    setErro('Não foi possível carregar os medicamentos. Confira se a API está ligada.');
                }
            } finally {
                if (!controle.signal.aborted) {
                    setCarregando(false);
                }
            }
        }

        carregar();

        return () => controle.abort();
    }, [idosoId, tentativa]);

    function avisar(msg) {
        setAviso({ msg, id: Date.now() });
    }

    async function alterarStatus(medicamento) {
        const novoStatus = medicamento.status === 'Tomado' ? 'Pendente' : 'Tomado';

        setSalvandoId(medicamento.id);
        setErro('');

        try {
            const atualizado = await salvarStatus(medicamento.id, novoStatus, medicamento.data);

            setMedicamentos(lista => {
                return lista.map(item => {
                    return item.id === atualizado.id ? atualizado : item;
                });
            });

            if (novoStatus === 'Tomado') {
                avisar(medicamento.nome + ' marcado como tomado.');
            } else {
                avisar('Registro de ' + medicamento.nome + ' desfeito.');
            }
        } catch (falha) {
            setErro(falha.message || 'Não foi possível salvar o registro. O status foi mantido.');
        } finally {
            setSalvandoId(null);
        }
    }

    const filtrados = buscarMedicamentos(medicamentos, busca);
    const proximo = encontrarProximo(medicamentos);
    const tomados = medicamentos.filter(item => item.status === 'Tomado').length;

    let subtitulo = 'Acompanhe os remédios do dia e registre cada dose.';
    if (!carregando && medicamentos.length > 0) {
        subtitulo = tomados + ' de ' + medicamentos.length + ' doses registradas hoje.';
    }

    let semPendentes = 'Todos os medicamentos foram tomados';
    if (medicamentos.length === 0) {
        semPendentes = 'Nenhum medicamento cadastrado';
    } else if (medicamentos.some(item => item.status === 'Recusado')) {
        semPendentes = 'Há doses recusadas';
    }

    return (
        <>
            <div className="app">
                <Sidebar />

                <div className="coluna">
                    <main className="conteudo">
                        <div className="saudacao">
                            <span className="saudacao-icone" aria-hidden="true"><IconePilula /></span>
                            <div>
                                <h1>Medicamentos</h1>
                                <p>{subtitulo}</p>
                            </div>
                        </div>

                        <div className="filtros">
                            <label className="campo" htmlFor="idoso">
                                Medicamentos de
                                <select
                                    id="idoso"
                                    value={idosoId}
                                    disabled={carregando || salvandoId !== null}
                                    onChange={evento => setIdosoId(evento.target.value)}
                                >
                                    {idosos.map(idoso => (
                                        <option key={idoso.id} value={idoso.id}>{idoso.nome}</option>
                                    ))}
                                </select>
                            </label>

                            <form className="campo campo-busca" role="search" onSubmit={evento => evento.preventDefault()}>
                                <label htmlFor="busca">Buscar</label>
                                <input
                                    type="search"
                                    id="busca"
                                    placeholder="Nome do medicamento"
                                    autoComplete="off"
                                    value={busca}
                                    onChange={evento => setBusca(evento.target.value)}
                                />
                            </form>
                        </div>

                        {carregando && <p className="estado" role="status">Carregando medicamentos...</p>}

                        {erro && (
                            <div className="aviso-erro" role="alert">
                                <p>{erro}</p>
                                {medicamentos.length === 0 && !carregando && (
                                    <button type="button" className="btn btn-primario" onClick={() => setTentativa(tentativa + 1)}>
                                        Tentar novamente
                                    </button>
                                )}
                            </div>
                        )}

                        {!carregando && (!erro || medicamentos.length > 0) && (
                            <>
                                <section className="card-compromisso" aria-labelledby="titulo-proximo">
                                    <div className="contador">
                                        {proximo ? (
                                            <>
                                                <span className="contador-topo">Às</span>
                                                <span className="contador-valor">{proximo.horario}</span>
                                            </>
                                        ) : (
                                            <span className="contador-icone"><IconeCheck /></span>
                                        )}
                                    </div>

                                    <div className="compromisso-texto">
                                        <small id="titulo-proximo">
                                            Próximo medicamento{proximo && ' · ' + proximo.horario}
                                        </small>
                                        <strong>{proximo ? proximo.nome : semPendentes}</strong>
                                        <span className="compromisso-info">
                                            {proximo
                                                ? proximo.dosagem + (proximo.observacoes ? ' · ' + proximo.observacoes : '')
                                                : 'Nenhuma dose pendente na lista de hoje.'}
                                        </span>
                                    </div>

                                    {proximo && (
                                        <div className="compromisso-acoes">
                                            <button
                                                type="button"
                                                className="btn-claro"
                                                disabled={salvandoId !== null}
                                                onClick={() => alterarStatus(proximo)}
                                            >
                                                <IconeCheck />
                                                Marcar como tomado
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-contorno"
                                                onClick={() => setMedicamentoSelecionado(proximo)}
                                            >
                                                Ver detalhes
                                            </button>
                                        </div>
                                    )}
                                </section>

                                <section className="card lista" aria-labelledby="titulo-lista">
                                    <h2 id="titulo-lista">Medicamentos de hoje</h2>

                                    <div className="tabela-container" role="region" aria-labelledby="titulo-lista" tabIndex="0">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th scope="col">Horário</th>
                                                    <th scope="col">Medicamento</th>
                                                    <th scope="col">Frequência</th>
                                                    <th scope="col">Observações</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col"><span className="somente-leitor">Ações</span></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtrados.map(medicamento => {
                                                    const tomado = medicamento.status === 'Tomado';
                                                    let classeStatus = 'status';
                                                    if (tomado) classeStatus += ' tomado';
                                                    if (medicamento.status === 'Recusado') classeStatus += ' recusado';

                                                    return (
                                                        <tr key={medicamento.id}>
                                                            <td className="col-hora">{medicamento.horario}</td>
                                                            <td>
                                                                <strong className="med-nome">{medicamento.nome}</strong>
                                                                <span className="med-dose">{medicamento.dosagem}</span>
                                                            </td>
                                                            <td>{medicamento.frequencia}</td>
                                                            <td className="col-obs">{medicamento.observacoes}</td>
                                                            <td><span className={classeStatus}>{medicamento.status}</span></td>
                                                            <td>
                                                                <div className="acoes-linha">
                                                                    <button
                                                                        type="button"
                                                                        className="btn-linha"
                                                                        aria-label={'Ver detalhes de ' + medicamento.nome}
                                                                        onClick={() => setMedicamentoSelecionado(medicamento)}
                                                                    >
                                                                        Detalhes
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className={tomado ? 'btn-linha' : 'btn-linha btn-linha-primario'}
                                                                        aria-label={(tomado ? 'Desfazer registro de ' : 'Marcar como tomado: ') + medicamento.nome}
                                                                        aria-busy={salvandoId === medicamento.id}
                                                                        disabled={salvandoId !== null}
                                                                        onClick={() => alterarStatus(medicamento)}
                                                                    >
                                                                        {salvandoId === medicamento.id
                                                                            ? 'Salvando...'
                                                                            : tomado ? 'Desfazer' : 'Marcar como tomado'}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        {filtrados.length === 0 && (
                                            <p className="estado">
                                                {medicamentos.length === 0
                                                    ? 'Nenhum medicamento cadastrado.'
                                                    : 'Nenhum medicamento encontrado.'}
                                            </p>
                                        )}
                                    </div>
                                </section>
                            </>
                        )}
                    </main>
                </div>
            </div>

            <Toast aviso={aviso} />

            {medicamentoSelecionado && (
                <Detalhes
                    medicamento={medicamentoSelecionado}
                    aoFechar={() => setMedicamentoSelecionado(null)}
                />
            )}
        </>
    );
}

