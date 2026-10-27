import { useEffect, useState } from 'react';
import Estrutura from './Estrutura.jsx';
import Detalhes from './Detalhes.jsx';

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
    const [mensagem, setMensagem] = useState('');
    const [salvandoId, setSalvandoId] = useState(null);
    const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        const controle = new AbortController();

        async function carregar() {
            setCarregando(true);
            setMedicamentos([]);
            setErro('');
            setMensagem('');
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

    async function alterarStatus(medicamento) {
        const novoStatus = medicamento.status === 'Tomado' ? 'Pendente' : 'Tomado';

        setSalvandoId(medicamento.id);
        setErro('');
        setMensagem('');

        try {
            const atualizado = await salvarStatus(medicamento.id, novoStatus, medicamento.data);

            setMedicamentos(lista => {
                return lista.map(item => {
                    return item.id === atualizado.id ? atualizado : item;
                });
            });

            if (novoStatus === 'Tomado') {
                setMensagem(medicamento.nome + ' marcado como tomado.');
            } else {
                setMensagem('Registro de ' + medicamento.nome + ' desfeito.');
            }
        } catch (falha) {
            setErro(falha.message || 'Não foi possível salvar o registro. O status foi mantido.');
        } finally {
            setSalvandoId(null);
        }
    }

    const filtrados = buscarMedicamentos(medicamentos, busca);
    const proximo = encontrarProximo(medicamentos);

    return (
        <Estrutura>
            <main>
                <div className="titulo-pagina">
                    <span className="titulo-icone" aria-hidden="true">💊</span>
                    <div>
                        <h1>Medicamentos</h1>
                        <p className="introducao">
                            Visualize aqui os medicamentos cadastrados e acompanhe os horários de administração.
                        </p>
                    </div>
                </div>

                <div className="selecao-idoso">
                    <label htmlFor="idoso">Medicamentos de</label>
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
                </div>

                <form role="search" onSubmit={evento => evento.preventDefault()}>
                    <label className="somente-leitor" htmlFor="busca">
                        Buscar medicamento pelo nome
                    </label>
                    <div className="campo-busca">
                        <span aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            id="busca"
                            placeholder="Buscar medicamento"
                            autoComplete="off"
                            value={busca}
                            onChange={evento => setBusca(evento.target.value)}
                        />
                    </div>
                </form>

                {carregando && <p role="status">Carregando medicamentos...</p>}

                {erro && (
                    <div className="aviso-erro" role="alert">
                        <p>{erro}</p>
                        {medicamentos.length === 0 && !carregando && (
                            <button className="botao" onClick={() => setTentativa(tentativa + 1)}>
                                Tentar novamente
                            </button>
                        )}
                    </div>
                )}

                {!carregando && (!erro || medicamentos.length > 0) && (
                    <>
                        <section className="proximo" aria-labelledby="titulo-proximo">
                            <span className="icone-remedio" aria-hidden="true">💊</span>
                            <div>
                                <h2 id="titulo-proximo">Próximo medicamento</h2>
                                {proximo ? (
                                    <>
                                        <p className="nome-proximo">{proximo.nome}</p>
                                        <p>{proximo.horario} | {proximo.observacoes}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="nome-proximo">
                                            {medicamentos.length === 0
                                                ? 'Nenhum medicamento cadastrado'
                                                : medicamentos.some(item => item.status === 'Recusado')
                                                    ? 'Há doses recusadas'
                                                    : 'Todos os medicamentos foram tomados'}
                                        </p>
                                        <p>Nenhuma dose pendente na lista de hoje.</p>
                                    </>
                                )}
                            </div>
                        </section>

                        <div className="tabela-container" role="region" aria-label="Medicamentos cadastrados" tabIndex="0">
                            <table>
                                <caption className="somente-leitor">Lista de medicamentos cadastrados</caption>
                                <thead>
                                    <tr>
                                        <th scope="col">Nome do Medicamento</th>
                                        <th scope="col">Dosagem</th>
                                        <th scope="col">Horário</th>
                                        <th scope="col">Frequência</th>
                                        <th scope="col">Observações</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" colSpan="2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrados.map(medicamento => {
                                        const tomado = medicamento.status === 'Tomado';

                                        return (
                                            <tr key={medicamento.id}>
                                                <td>{medicamento.nome}</td>
                                                <td>{medicamento.dosagem}</td>
                                                <td>{medicamento.horario}</td>
                                                <td>{medicamento.frequencia}</td>
                                                <td>{medicamento.observacoes}</td>
                                                <td>
                                                    <span className={tomado ? 'status tomado' : medicamento.status === 'Recusado' ? 'status recusado' : 'status'}>
                                                        {medicamento.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="botao"
                                                        aria-label={'Ver detalhes de ' + medicamento.nome}
                                                        onClick={() => setMedicamentoSelecionado(medicamento)}
                                                    >
                                                        Ver detalhes
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className={tomado ? 'botao tomar desfazer' : 'botao tomar'}
                                                        aria-label={(tomado ? 'Desfazer registro de ' : 'Marcar como tomado: ') + medicamento.nome}
                                                        aria-busy={salvandoId === medicamento.id}
                                                        disabled={salvandoId !== null}
                                                        onClick={() => alterarStatus(medicamento)}
                                                    >
                                                        {salvandoId === medicamento.id
                                                            ? 'Salvando...'
                                                            : tomado ? 'Desfazer registro' : 'Marcar como tomado'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {filtrados.length === 0 && (
                                <p id="sem-resultados">
                                    {medicamentos.length === 0
                                        ? 'Nenhum medicamento cadastrado.'
                                        : 'Nenhum medicamento encontrado.'}
                                </p>
                            )}
                        </div>
                    </>
                )}

                <p id="mensagem" role="status" aria-live="polite">{mensagem}</p>
                <a className="botao voltar" href="../homepage/index.html">← Voltar</a>
            </main>

            {medicamentoSelecionado && (
                <Detalhes
                    medicamento={medicamentoSelecionado}
                    aoFechar={() => setMedicamentoSelecionado(null)}
                />
            )}
        </Estrutura>
    );
}
