import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import { urlApi } from './navegacao.js';
import { IconeCuidadores } from './components/Icones.jsx';

/* local: o Vite repassa /api para servidor.js; publicado: a API no Render (src/navegacao.js) */
const URL_API = urlApi('cuidadores') + '/api';

const abas = ['Sobre', 'Serviços e preços', 'Avaliações', 'Disponibilidade'];
const experiencias = {
    '0-1': 'Menos de 1 ano',
    '1-3': 'De 1 a 3 anos',
    '3-5': 'De 3 a 5 anos',
    '5-10': 'De 5 a 10 anos',
    '10+': 'Mais de 10 anos'
};
const servicos = {
    acompanhante: 'Acompanhante',
    companhia: 'Companhia',
    'tecnico-enfermagem': 'Técnico de enfermagem',
    outro: 'Outro'
};
const dias = {
    seg: 'Segunda-feira',
    ter: 'Terça-feira',
    qua: 'Quarta-feira',
    qui: 'Quinta-feira',
    sex: 'Sexta-feira',
    sab: 'Sábado',
    dom: 'Domingo'
};

function iniciais(nome) {
    return nome.trim().split(/\s+/).slice(0, 2).map(parte => parte[0]).join('');
}

function dinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function App() {
    const id = new URLSearchParams(window.location.search).get('id');
    const [perfil, setPerfil] = useState(null);
    const [lista, setLista] = useState([]);
    const [aba, setAba] = useState('Sobre');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [naoEncontrado, setNaoEncontrado] = useState(false);
    const [tentativa, setTentativa] = useState(0);
    const [fotoFalhou, setFotoFalhou] = useState(false);

    useEffect(() => {
        const controle = new AbortController();

        async function carregar() {
            setCarregando(true);
            setErro('');
            setNaoEncontrado(false);

            try {
                const endereco = URL_API + (id ? '/cuidadores/' + encodeURIComponent(id) : '/cuidadores');
                const resposta = await fetch(endereco, { signal: controle.signal });

                if (resposta.status === 404) {
                    setNaoEncontrado(true);
                    return;
                }

                if (!resposta.ok) {
                    throw new Error('Falha ao consultar perfil.');
                }

                const dados = await resposta.json();

                if (id) {
                    setPerfil(dados);
                } else {
                    setLista(dados);
                }
            } catch (falha) {
                if (falha.name !== 'AbortError') {
                    setErro('Não foi possível carregar os cuidadores. Confira a conexão e tente novamente.');
                }
            } finally {
                if (!controle.signal.aborted) {
                    setCarregando(false);
                }
            }
        }

        carregar();
        return () => controle.abort();
    }, [id, tentativa]);

    const avaliacoes = perfil?.avaliacoes || [];
    const media = avaliacoes.length > 0
        ? avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0) / avaliacoes.length
        : null;

    return (
        <div className="app">
            <Sidebar />

            <div className="coluna">
                <main className="conteudo">
                    <div className="saudacao">
                        <span className="saudacao-icone" aria-hidden="true"><IconeCuidadores /></span>
                        <div>
                            <h1>{id ? 'Perfil do cuidador' : 'Cuidadores'}</h1>
                            <p>{id
                                ? 'Conheça o profissional e as informações sobre seus cuidados.'
                                : 'Escolha um profissional para ver o perfil completo.'}</p>
                        </div>
                    </div>

                    {carregando && <p className="aviso" role="status">Carregando...</p>}

                    {!carregando && erro && (
                        <div className="aviso erro" role="alert">
                            <p>{erro}</p>
                            <button className="botao" onClick={() => setTentativa(valor => valor + 1)}>
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {!carregando && !erro && naoEncontrado && (
                        <div className="aviso" role="status">
                            <h2>Perfil não encontrado</h2>
                            <p>Este cuidador não está disponível. Volte e selecione outro profissional.</p>
                            <a className="botao" href="./perfil.html">Voltar aos cuidadores</a>
                        </div>
                    )}

                    {!carregando && !erro && !id && (
                        <section className="lista-cuidadores" aria-label="Escolher cuidador">
                            {lista.length === 0 && <p className="aviso">Nenhum cuidador cadastrado.</p>}
                            {lista.map(cuidador => (
                                <article className="cartao-cuidador" key={cuidador.id}>
                                    <span className="foto-lista" aria-hidden="true">{iniciais(cuidador.nome)}</span>
                                    <div>
                                        <h2>{cuidador.nome}</h2>
                                        <p>Perfil profissional</p>
                                    </div>
                                    <a className="botao" href={'./perfil.html?id=' + encodeURIComponent(cuidador.id)}>
                                        Ver perfil <span className="somente-leitor">de {cuidador.nome}</span>
                                    </a>
                                </article>
                            ))}
                        </section>
                    )}

                    {!carregando && !erro && !naoEncontrado && perfil && (
                        <article className="perfil">
                            <header className="resumo-perfil">
                                {perfil.foto && !fotoFalhou ? (
                                    <img className="foto-perfil" src={perfil.foto} alt={'Foto de ' + perfil.nome} onError={() => setFotoFalhou(true)} />
                                ) : (
                                    <span className="foto-perfil iniciais" role="img" aria-label={'Sem foto de ' + perfil.nome}>
                                        {iniciais(perfil.nome)}
                                    </span>
                                )}
                                <h2>{perfil.nome}</h2>
                                <p className="nota">
                                    {media !== null ? (
                                        <><span aria-hidden="true">★</span> {media.toFixed(1).replace('.', ',')} <span className="quantidade">({avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'})</span></>
                                    ) : 'Ainda sem avaliações'}
                                </p>
                                <p>{experiencias[perfil.experiencia]
                                    ? experiencias[perfil.experiencia] + ' de experiência em cuidados'
                                    : 'Experiência não informada'}</p>
                                <p className="localizacao">
                                    {[perfil.localizacao.bairro, perfil.localizacao.cidade].filter(Boolean).join(' · ') || 'Localização não informada'}
                                </p>
                            </header>

                            <nav className="abas-perfil" aria-label="Seções do perfil">
                                {abas.map(nome => (
                                    <button key={nome} className={aba === nome ? 'aba ativa' : 'aba'} aria-pressed={aba === nome} onClick={() => setAba(nome)}>
                                        {nome}
                                    </button>
                                ))}
                            </nav>

                            <section className="conteudo-perfil" aria-label={aba}>
                                {aba === 'Sobre' && (
                                    <>
                                        <h3>Sobre o profissional</h3>
                                        <p>{perfil.sobre || 'Apresentação não informada.'}</p>
                                        <h3>Qualificações</h3>
                                        {perfil.qualificacoes.length > 0 ? (
                                            <ul>{perfil.qualificacoes.map((item, indice) => <li key={indice}>{item}</li>)}</ul>
                                        ) : <p>Nenhuma qualificação informada.</p>}
                                        <h3>Referências profissionais</h3>
                                        {perfil.referencias.length > 0 ? (
                                            <ul className="referencias">
                                                {perfil.referencias.map((item, indice) => (
                                                    <li key={indice}><strong>{item.nome}</strong>{item.telefone && <span>{item.telefone}</span>}</li>
                                                ))}
                                            </ul>
                                        ) : <p>Nenhuma referência informada.</p>}
                                    </>
                                )}

                                {aba === 'Serviços e preços' && (
                                    <>
                                        <h3>Serviços oferecidos</h3>
                                        {perfil.servicos.length > 0 ? (
                                            <ul className="servicos">
                                                {perfil.servicos.map(servico => <li key={servico}>{servicos[servico] || servico}</li>)}
                                            </ul>
                                        ) : <p>Nenhum serviço informado.</p>}
                                        <div className="preco">
                                            <span>Valor por hora</span>
                                            <strong>{perfil.valorHora !== null ? dinheiro(perfil.valorHora) : 'Não informado'}</strong>
                                        </div>
                                    </>
                                )}

                                {aba === 'Avaliações' && (
                                    <>
                                        <h3>Avaliações dos atendimentos</h3>
                                        {avaliacoes.length === 0 && <p>Este cuidador ainda não recebeu avaliações.</p>}
                                        {avaliacoes.map(avaliacao => (
                                            <article className="avaliacao" key={avaliacao.id}>
                                                <div><strong>{avaliacao.autor}</strong><span className="nota" aria-label={avaliacao.nota + ' de 5 estrelas'}>★ {avaliacao.nota}/5</span></div>
                                                <p>{avaliacao.comentario || 'Avaliação sem comentário.'}</p>
                                                {avaliacao.data && <time dateTime={avaliacao.data}>{avaliacao.data.split('-').reverse().join('/')}</time>}
                                            </article>
                                        ))}
                                    </>
                                )}

                                {aba === 'Disponibilidade' && (
                                    <>
                                        <h3>Disponibilidade de atendimento</h3>
                                        <p>{perfil.disponibilidade.descricao || 'Disponibilidade não informada.'}</p>
                                        <ul className="dias">
                                            {perfil.disponibilidade.dias.map(dia => <li key={dia}>{dias[dia] || dia}</li>)}
                                        </ul>
                                        {perfil.disponibilidade.inicio && perfil.disponibilidade.fim && (
                                            <p className="horario">Das {perfil.disponibilidade.inicio} às {perfil.disponibilidade.fim}
                                                {perfil.disponibilidade.fim < perfil.disponibilidade.inicio && ' do dia seguinte'}
                                            </p>
                                        )}
                                    </>
                                )}
                            </section>

                            <footer className="rodape-perfil">
                                <a className="botao" href="./perfil.html">← Voltar aos cuidadores</a>
                            </footer>
                        </article>
                    )}
                </main>
            </div>
        </div>
    );
}
