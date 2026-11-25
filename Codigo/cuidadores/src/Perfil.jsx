import { useEffect, useState } from 'react';
import Shell from '@ds/Shell.jsx';
import Dialogo from '@ds/Dialogo.jsx';
import Toast from '@ds/Toast.jsx';
import { Estado } from '@ds/Componentes.jsx';
import { IconeAgenda, IconeCheck, IconeEscudo, IconeEstrela, IconeFechar, IconeLocal, IconeRelogio, IconeTelefone, IconeVoltar } from '@ds/Icones.jsx';
import { avaliar, buscarPerfil, listarIdosos, solicitar } from './api.js';
import { DIAS, EXPERIENCIAS, SERVICOS, dinheiro, iniciais, nota } from './textos.js';

const SECOES = [
    { id: 'sobre', rotulo: 'Sobre' },
    { id: 'atendimento', rotulo: 'Atendimento' },
    { id: 'avaliacoes', rotulo: 'Avaliações' }
];

const ROTULOS_NOTA = ['', 'Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

function Estrelas({ valor }) {
    return (
        <span className="estrelas" aria-label={nota(valor) + ' de 5 estrelas'}>
            {[1, 2, 3, 4, 5].map(n => <IconeEstrela key={n} className={n <= Math.round(valor) ? '' : 'vazia'} />)}
        </span>
    );
}

function amanha() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('sv-SE');
}

/* Solicitar atendimento (RF004): cria uma solicitação pendente para o cuidador responder */
function FormSolicitar({ perfil, aoEnviar, aoFechar }) {
    const [idosos, setIdosos] = useState([]);
    const [pedido, setPedido] = useState({
        idosoId: '',
        servico: perfil.servicos[0] || 'acompanhante',
        data: amanha(),
        horaInicio: perfil.disponibilidade.inicio || '08:00',
        horaFim: perfil.disponibilidade.fim || '12:00',
        mensagem: ''
    });
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        listarIdosos().then(lista => {
            setIdosos(lista);
            setPedido(p => ({ ...p, idosoId: p.idosoId || lista[0]?.id || '' }));
        }).catch(() => setErro('Não foi possível carregar a lista de idosos.'));
    }, []);

    const mudar = campo => e => setPedido(p => ({ ...p, [campo]: e.target.value }));
    const diaDaSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][new Date(pedido.data + 'T12:00').getDay()];
    const foraDosDias = perfil.disponibilidade.dias.length > 0 && !perfil.disponibilidade.dias.includes(diaDaSemana);

    async function enviar(e) {
        e.preventDefault();
        setEnviando(true);
        setErro('');
        try {
            await aoEnviar({ ...pedido, cuidadorId: perfil.id });
        } catch (falha) {
            setErro(falha.message);
            setEnviando(false);
        }
    }

    return (
        <form onSubmit={enviar}>
            <label className="campo">
                Para quem é o atendimento?
                <select value={pedido.idosoId} onChange={mudar('idosoId')} required>
                    {idosos.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
                </select>
            </label>

            <fieldset className="campo campo-sem-borda">
                <legend>Serviço</legend>
                <div className="pilulas">
                    {perfil.servicos.map(s => (
                        <label key={s} className="pilula">
                            <input type="radio" name="servico" value={s} checked={pedido.servico === s} onChange={mudar('servico')} />
                            {SERVICOS[s] || s}
                        </label>
                    ))}
                </div>
            </fieldset>

            <label className="campo">
                Data
                <input type="date" min={new Date().toLocaleDateString('sv-SE')} value={pedido.data} onChange={mudar('data')} required />
                {foraDosDias && (
                    <small className="aviso-dia">{perfil.nome.split(' ')[0]} normalmente não atende às {DIAS[diaDaSemana].toLowerCase()}s. Você ainda pode pedir.</small>
                )}
            </label>

            <div className="campos-linha campos-hora">
                <label className="campo">
                    Das
                    <input type="time" value={pedido.horaInicio} onChange={mudar('horaInicio')} required />
                </label>
                <label className="campo">
                    Até
                    <input type="time" value={pedido.horaFim} onChange={mudar('horaFim')} required />
                </label>
            </div>

            <label className="campo">
                <span>Mensagem <small>(opcional)</small></span>
                <textarea rows="3" maxLength="500" value={pedido.mensagem} onChange={mudar('mensagem')}
                    placeholder="Conte o que precisa: rotina, mobilidade, cuidados especiais…" />
            </label>

            {erro && <p className="erro-form" role="alert">{erro}</p>}

            <div className="dialogo-botoes">
                <button type="button" className="btn" onClick={aoFechar}>Cancelar</button>
                <button type="submit" className="btn btn-primario" disabled={enviando || !pedido.idosoId}>
                    {enviando ? 'Enviando…' : 'Enviar solicitação'}
                </button>
            </div>
        </form>
    );
}

/* Avaliar o atendimento (RF005) */
function FormAvaliar({ aoEnviar, aoFechar }) {
    const [valor, setValor] = useState(0);
    const [comentario, setComentario] = useState('');
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function enviar(e) {
        e.preventDefault();
        if (!valor) {
            setErro('Escolha de 1 a 5 estrelas.');
            return;
        }
        setEnviando(true);
        try {
            await aoEnviar({ nota: valor, comentario });
        } catch (falha) {
            setErro(falha.message);
            setEnviando(false);
        }
    }

    return (
        <form onSubmit={enviar}>
            <fieldset className="campo campo-sem-borda">
                <legend>Sua nota</legend>
                <div className="escolher-estrelas" role="radiogroup" aria-label="Nota de 1 a 5 estrelas">
                    {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" role="radio" aria-checked={valor === n} aria-label={n + (n === 1 ? ' estrela' : ' estrelas') + ', ' + ROTULOS_NOTA[n]}
                            className={n <= valor ? 'cheia' : ''} onClick={() => { setValor(n); setErro(''); }}>
                            <IconeEstrela />
                        </button>
                    ))}
                </div>
                <small className="rotulo-nota" aria-live="polite">{ROTULOS_NOTA[valor] || 'Toque nas estrelas'}</small>
            </fieldset>

            <label className="campo">
                <span>Comentário <small>(opcional)</small></span>
                <textarea rows="4" maxLength="400" value={comentario} onChange={e => setComentario(e.target.value)}
                    placeholder="Como foi o atendimento? Isso ajuda outras famílias." />
            </label>

            {erro && <p className="erro-form" role="alert">{erro}</p>}

            <div className="dialogo-botoes">
                <button type="button" className="btn" onClick={aoFechar}>Cancelar</button>
                <button type="submit" className="btn btn-primario" disabled={enviando}>{enviando ? 'Enviando…' : 'Publicar avaliação'}</button>
            </div>
        </form>
    );
}

export default function Perfil({ id }) {
    const [perfil, setPerfil] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [naoEncontrado, setNaoEncontrado] = useState(false);
    const [tentativa, setTentativa] = useState(0);
    const [secao, setSecao] = useState('sobre');
    const [dialogo, setDialogo] = useState(null);
    const [aviso, setAviso] = useState(null);

    useEffect(() => {
        const controle = new AbortController();
        setCarregando(true);
        setErro('');
        buscarPerfil(id, controle.signal)
            .then(dados => { setPerfil(dados); document.title = 'AcessaMob | ' + dados.nome; })
            .catch(falha => {
                if (falha.name === 'AbortError') return;
                if (falha.status === 404) setNaoEncontrado(true);
                else setErro('Não foi possível carregar o perfil. Confira a conexão e tente de novo.');
            })
            .finally(() => { if (!controle.signal.aborted) setCarregando(false); });
        return () => controle.abort();
    }, [id, tentativa]);

    async function enviarSolicitacao(pedido) {
        await solicitar(pedido);
        setDialogo(null);
        setAviso({ id: Date.now(), msg: 'Solicitação enviada. A resposta de ' + perfil.nome.split(' ')[0] + ' aparece no seu Início.' });
    }

    async function enviarAvaliacao(avaliacao) {
        const atualizado = await avaliar(perfil.id, avaliacao);
        setPerfil(atualizado);
        setDialogo(null);
        setSecao('avaliacoes');
        setAviso({ id: Date.now(), msg: 'Obrigado! Sua avaliação foi publicada.' });
    }

    const voltar = <a className="voltar" href="./"><IconeVoltar />Todos os cuidadores</a>;

    return (
        <Shell tela="cuidadores">
            {carregando && <>{voltar}<Estado tipo="carregando" titulo="Carregando perfil…" /></>}

            {!carregando && erro && (
                <>
                    {voltar}
                    <Estado tipo="erro" titulo="Algo deu errado" acao={
                        <button type="button" className="btn" onClick={() => setTentativa(t => t + 1)}>Tentar de novo</button>
                    }>
                        <p>{erro}</p>
                    </Estado>
                </>
            )}

            {!carregando && naoEncontrado && (
                <Estado titulo="Perfil não encontrado" acao={<a className="btn btn-primario" href="./">Ver todos os cuidadores</a>}>
                    <p>Este cuidador não está mais disponível.</p>
                </Estado>
            )}

            {!carregando && perfil && (
                <>
                    <header className="perfil-topo rolavel">
                        {voltar}
                        <div className="perfil-cartao sobre-escuro">
                            <span className="perfil-foto" aria-hidden="true">{iniciais(perfil.nome)}</span>
                            <div className="perfil-identidade">
                                <h1>{perfil.nome}</h1>
                                <p className="perfil-nota">
                                    {perfil.media !== null ? (
                                        <><IconeEstrela /><strong>{nota(perfil.media)}</strong>
                                            <span>{perfil.totalAvaliacoes === 1 ? '1 avaliação' : perfil.totalAvaliacoes + ' avaliações'}</span></>
                                    ) : <span>Ainda sem avaliações</span>}
                                </p>
                                <ul className="perfil-fatos">
                                    {(perfil.localizacao.bairro || perfil.localizacao.cidade) && (
                                        <li><IconeLocal />{[perfil.localizacao.bairro, perfil.localizacao.cidade].filter(Boolean).join(', ')}</li>
                                    )}
                                    <li><IconeRelogio />{EXPERIENCIAS[perfil.experiencia] ? EXPERIENCIAS[perfil.experiencia] + ' de experiência' : 'Experiência não informada'}</li>
                                    {perfil.registroProfissional && <li><IconeEscudo />Registro profissional informado</li>}
                                </ul>
                            </div>
                            <div className="perfil-preco">
                                {perfil.valorHora !== null
                                    ? <><strong>{dinheiro(perfil.valorHora)}</strong><span>por hora</span></>
                                    : <span>Preço a combinar</span>}
                            </div>
                            <div className="perfil-acoes">
                                <button type="button" className="btn btn-claro" onClick={() => setDialogo('solicitar')}>
                                    <IconeAgenda />Solicitar atendimento
                                </button>
                                <button type="button" className="btn btn-contorno" onClick={() => setDialogo('avaliar')}>
                                    <IconeEstrela />Avaliar
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="segmentado perfil-secoes" role="tablist" aria-label="Seções do perfil">
                        {SECOES.map(s => (
                            <button key={s.id} type="button" role="tab" id={'aba-' + s.id} aria-selected={secao === s.id}
                                aria-controls="painel-perfil" onClick={() => setSecao(s.id)}>
                                {s.rotulo}
                                {s.id === 'avaliacoes' && perfil.totalAvaliacoes > 0 && <span className="pilula-num">{perfil.totalAvaliacoes}</span>}
                            </button>
                        ))}
                    </div>

                    <section id="painel-perfil" key={secao} role="tabpanel" aria-labelledby={'aba-' + secao} className="perfil-painel rolavel">
                        {secao === 'sobre' && (
                            <>
                                <div className="bloco">
                                    <h2>Apresentação</h2>
                                    <p>{perfil.sobre || 'O profissional ainda não escreveu uma apresentação.'}</p>
                                </div>
                                {perfil.especialidades.length > 0 && (
                                    <div className="bloco">
                                        <h2>Especialidades</h2>
                                        <div className="pilulas">
                                            {perfil.especialidades.map(e => <span key={e} className="tag tag--destaque">{e}</span>)}
                                        </div>
                                    </div>
                                )}
                                {perfil.diferenciais.length > 0 && (
                                    <div className="bloco">
                                        <h2>Diferenciais</h2>
                                        <ul className="lista-simples">{perfil.diferenciais.map(d => <li key={d}>{d}</li>)}</ul>
                                    </div>
                                )}
                                <div className="bloco">
                                    <h2>Qualificações</h2>
                                    {perfil.qualificacoes.length ? (
                                        <ul className="lista-simples">{perfil.qualificacoes.map((q, i) => <li key={i}>{q}</li>)}</ul>
                                    ) : <p>Nenhuma qualificação informada.</p>}
                                </div>
                                <div className="bloco">
                                    <h2>Referências</h2>
                                    {perfil.referencias.length ? (
                                        <ul className="referencias">
                                            {perfil.referencias.map((r, i) => (
                                                <li key={i}>
                                                    <strong>{r.nome}</strong>
                                                    {r.telefone && <a href={'tel:' + r.telefone.replace(/\D/g, '')}><IconeTelefone />{r.telefone}</a>}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p>Nenhuma referência informada.</p>}
                                </div>
                            </>
                        )}

                        {secao === 'atendimento' && (
                            <>
                                <div className="bloco">
                                    <h2>Serviços oferecidos</h2>
                                    <div className="pilulas">
                                        {perfil.servicos.length ? perfil.servicos.map(s => <span key={s} className="tag tag--destaque">{SERVICOS[s] || s}</span>)
                                            : <p>Nenhum serviço informado.</p>}
                                    </div>
                                </div>
                                <div className="bloco">
                                    <h2>Dias de atendimento</h2>
                                    <ul className="dias-semana">
                                        {Object.entries(DIAS).map(([d, rotulo]) => {
                                            const atende = perfil.disponibilidade.dias.includes(d);
                                            return (
                                                <li key={d} className={atende ? 'atende' : ''}>
                                                    <abbr title={rotulo}>{rotulo.slice(0, 3)}</abbr>
                                                    <span className="somente-leitor">{atende ? 'atende' : 'não atende'}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    {perfil.disponibilidade.inicio && perfil.disponibilidade.fim && (
                                        <p className="horario">
                                            Das <strong>{perfil.disponibilidade.inicio}</strong> às <strong>{perfil.disponibilidade.fim}</strong>
                                            {perfil.disponibilidade.fim < perfil.disponibilidade.inicio && ' do dia seguinte'}
                                        </p>
                                    )}
                                    {perfil.disponibilidade.descricao && <p className="texto-suave">{perfil.disponibilidade.descricao}</p>}
                                </div>
                                {(perfil.fazNoAtendimento.length > 0 || perfil.naoFaz.length > 0) && (
                                    <div className="bloco">
                                        <h2>No atendimento</h2>
                                        <p className="texto-suave">Combinar isso antes evita desentendimento sobre o que é ou não função do cuidador.</p>
                                        <div className="atendimento">
                                            {perfil.fazNoAtendimento.length > 0 && (
                                                <div>
                                                    <h3>Faz</h3>
                                                    <ul className="lista-faz">
                                                        {perfil.fazNoAtendimento.map(item => <li key={item}><IconeCheck />{item}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                            {perfil.naoFaz.length > 0 && (
                                                <div>
                                                    <h3>Não faz</h3>
                                                    <ul className="lista-faz lista-nao-faz">
                                                        {perfil.naoFaz.map(item => <li key={item}><IconeFechar />{item}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {secao === 'avaliacoes' && (
                            <div className="bloco">
                                {perfil.media !== null && (
                                    <div className="resumo-notas">
                                        <strong>{nota(perfil.media)}</strong>
                                        <div>
                                            <Estrelas valor={perfil.media} />
                                            <p>{perfil.totalAvaliacoes === 1 ? '1 avaliação de família' : perfil.totalAvaliacoes + ' avaliações de famílias'}</p>
                                        </div>
                                    </div>
                                )}
                                {perfil.avaliacoes.length === 0 ? (
                                    <p>Este cuidador ainda não recebeu avaliações. Foi atendido por {perfil.nome.split(' ')[0]}? Conte como foi.</p>
                                ) : (
                                    <ul className="avaliacoes">
                                        {perfil.avaliacoes.map(a => (
                                            <li key={a.id}>
                                                <div className="avaliacao-topo">
                                                    <strong>{a.autor}</strong>
                                                    <Estrelas valor={a.nota} />
                                                </div>
                                                <p>{a.comentario || 'Avaliação sem comentário.'}</p>
                                                {a.data && <time dateTime={a.data}>{a.data.split('-').reverse().join('/')}</time>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button type="button" className="btn btn-suave" onClick={() => setDialogo('avaliar')}>
                                    <IconeEstrela />Escrever avaliação
                                </button>
                            </div>
                        )}
                    </section>

                    <Dialogo aberto={dialogo === 'solicitar'} aoFechar={() => setDialogo(null)} titulo="Solicitar atendimento"
                        descricao={'O pedido vai para ' + perfil.nome.split(' ')[0] + ', que pode aceitar ou recusar.'}>
                        <FormSolicitar perfil={perfil} aoEnviar={enviarSolicitacao} aoFechar={() => setDialogo(null)} />
                    </Dialogo>

                    <Dialogo aberto={dialogo === 'avaliar'} aoFechar={() => setDialogo(null)} titulo={'Avaliar ' + perfil.nome.split(' ')[0]}
                        descricao="Sua avaliação aparece no perfil para outras famílias.">
                        <FormAvaliar aoEnviar={enviarAvaliacao} aoFechar={() => setDialogo(null)} />
                    </Dialogo>
                </>
            )}

            <Toast aviso={aviso} />
        </Shell>
    );
}
