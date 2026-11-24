import { createServer } from 'node:http';
import { readFile, rename, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { setServers } from 'node:dns';

/* API dos cuidadores (RF002, RF003, RF004 e RF005):
   GET  /api/cuidadores                     lista com resumo para busca e filtros
   GET  /api/cuidadores/:id                 perfil completo, com avaliações
   POST /api/cuidadores/:id/avaliacoes      { nota 1–5, comentario }
   GET  /api/idosos                         idosos que podem receber atendimento
   POST /api/solicitacoes                   { cuidadorId, idosoId, servico, data, horaInicio, horaFim, mensagem }
   Sem MONGODB_URI usa o db.json desta pasta (e grava nele). */

const arquivo = new URL('./db.json', import.meta.url);
const temporario = new URL('./db.json.tmp', import.meta.url);
/* enquanto não há login, quem avalia e solicita é o familiar responsável padrão */
const CLIENTE_PADRAO = process.env.CLIENTE_PADRAO || 'cli-1';
const SERVICOS = ['acompanhante', 'tecnico-enfermagem', 'companhia', 'outro'];
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATA = /^\d{4}-\d{2}-\d{2}$/;
/* registros de conselho profissional que aparecem nas qualificações */
const REGISTRO = /\b(COREN|CRM|CREFITO|CRF|CRESS|CRN)\b/i;

let cliente;
let banco;
let fila = Promise.resolve();

/* no MongoDB o id do db.json fica no _id (padrão do Codigo/inicio); devolve sempre com "id" */
function comId({ _id, ...resto }) {
    return { id: resto.id ?? _id, ...resto };
}

async function lerDados() {
    if (banco) {
        const [usuarios, cuidadores, avaliacoes, clientes, idosos] = await Promise.all([
            banco.collection('usuarios').find({}, { projection: { _id: 1, id: 1, nome: 1 } }).toArray(),
            banco.collection('cuidadores').find({}).toArray(),
            banco.collection('avaliacoes').find({}).toArray(),
            banco.collection('clientes').find({}, { projection: { _id: 1, id: 1, usuarioId: 1 } }).toArray(),
            banco.collection('idosos').find({}, { projection: { _id: 1, id: 1, nome: 1, apelido: 1, clienteId: 1 } }).toArray()
        ]);

        return {
            usuarios: usuarios.map(comId),
            cuidadores: cuidadores.map(comId),
            avaliacoes: avaliacoes.map(comId),
            clientes: clientes.map(comId),
            idosos: idosos.map(comId)
        };
    }

    return JSON.parse(await readFile(arquivo, 'utf8'));
}

function avaliacoesDe(cuidadorId, dados) {
    return (dados.avaliacoes || [])
        .filter(item => item.cuidadorId === cuidadorId && Number.isFinite(item.nota) && item.nota >= 1 && item.nota <= 5)
        .map(item => {
            const cliente = (dados.clientes || []).find(pessoa => pessoa.id === item.clienteId);
            const autor = dados.usuarios.find(pessoa => pessoa.id === cliente?.usuarioId);

            return {
                id: item.id,
                nota: item.nota,
                comentario: item.comentario || '',
                data: item.data,
                autor: autor?.nome?.trim().split(/\s+/)[0] || 'Cliente'
            };
        })
        .sort((a, b) => String(b.data).localeCompare(String(a.data)));
}

function media(avaliacoes) {
    if (!avaliacoes.length) return null;
    return Math.round((avaliacoes.reduce((total, a) => total + a.nota, 0) / avaliacoes.length) * 10) / 10;
}

/* resumo usado na lista com busca e filtros */
function montarResumo(cuidador, dados) {
    const usuario = dados.usuarios.find(item => item.id === cuidador.usuarioId);
    if (!usuario) return null;
    const avaliacoes = avaliacoesDe(cuidador.id, dados);

    return {
        id: cuidador.id,
        nome: usuario.nome,
        foto: cuidador.foto || '',
        experiencia: cuidador.experiencia || '',
        servicos: cuidador.servicos || [],
        bairro: cuidador.localizacao?.bairro || '',
        cidade: cuidador.localizacao?.cidade || '',
        dias: cuidador.disponibilidade?.dias || [],
        disponibilidade: cuidador.disponibilidade?.descricao || '',
        valorHora: Number.isFinite(cuidador.valorHora) ? cuidador.valorHora : null,
        /* primeira frase da apresentação, para o cartão da lista */
        resumo: (cuidador.sobre || '').split(/(?<=[.!?])\s/)[0],
        especialidades: cuidador.especialidades || [],
        media: media(avaliacoes),
        totalAvaliacoes: avaliacoes.length,
        registroProfissional: (cuidador.qualificacoes || []).some(q => REGISTRO.test(q))
    };
}

function montarPerfil(cuidador, dados) {
    const resumo = montarResumo(cuidador, dados);
    if (!resumo) return null;

    // Somente os campos apresentados na tela, sem dados de login.
    return {
        ...resumo,
        sobre: cuidador.sobre || '',
        qualificacoes: cuidador.qualificacoes || [],
        fazNoAtendimento: cuidador.fazNoAtendimento || [],
        naoFaz: cuidador.naoFaz || [],
        diferenciais: cuidador.diferenciais || [],
        referencias: (cuidador.referencias || []).map(item => ({
            nome: item.nome,
            telefone: item.telefone
        })),
        localizacao: {
            cidade: cuidador.localizacao?.cidade || '',
            bairro: cuidador.localizacao?.bairro || ''
        },
        disponibilidade: {
            descricao: cuidador.disponibilidade?.descricao || '',
            dias: cuidador.disponibilidade?.dias || [],
            inicio: cuidador.disponibilidade?.inicio || '',
            fim: cuidador.disponibilidade?.fim || ''
        },
        avaliacoes: avaliacoesDe(cuidador.id, dados)
    };
}

function hoje() {
    return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
}

function agora() {
    return new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T');
}

/* grava um documento novo na coleção (MongoDB ou db.json), uma gravação por vez */
function inserir(colecao, documento) {
    const tarefa = fila.then(async () => {
        if (banco) {
            const { id, ...resto } = documento;
            await banco.collection(colecao).insertOne({ _id: id, ...resto });
            return;
        }
        const dados = JSON.parse(await readFile(arquivo, 'utf8'));
        dados[colecao] = [...(dados[colecao] || []), documento];
        await writeFile(temporario, JSON.stringify(dados, null, 4) + '\n');
        await rename(temporario, arquivo);
    });
    fila = tarefa.catch(() => {});
    return tarefa;
}

function validarAvaliacao(corpo) {
    const nota = Number(corpo?.nota);
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) return 'Escolha de 1 a 5 estrelas.';
    if (corpo.comentario && String(corpo.comentario).length > 400) return 'O comentário pode ter até 400 caracteres.';
    return null;
}

function validarSolicitacao(corpo, dados) {
    if (!corpo) return 'Requisição inválida.';
    if (!dados.cuidadores.some(c => c.id === corpo.cuidadorId)) return 'Cuidador não encontrado.';
    if (!(dados.idosos || []).some(i => i.id === corpo.idosoId)) return 'Escolha para quem é o atendimento.';
    if (!SERVICOS.includes(corpo.servico)) return 'Escolha o tipo de serviço.';
    if (!DATA.test(corpo.data || '') || corpo.data < hoje()) return 'Escolha uma data a partir de hoje.';
    if (!HORA.test(corpo.horaInicio || '') || !HORA.test(corpo.horaFim || '')) return 'Informe o horário de início e de fim.';
    if (corpo.mensagem && String(corpo.mensagem).length > 500) return 'A mensagem pode ter até 500 caracteres.';
    return null;
}

function cabecalhosCors() {
    return {
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
}

function responder(resposta, codigo, dados) {
    resposta.writeHead(codigo, {
        ...cabecalhosCors(),
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    resposta.end(JSON.stringify(dados));
}

async function lerCorpo(requisicao) {
    let corpo = '';
    for await (const parte of requisicao) {
        corpo += parte;
        if (Buffer.byteLength(corpo) > 8192) throw new Error('Corpo muito grande.');
    }
    return JSON.parse(corpo || '{}');
}

async function iniciar() {
    if (process.env.MONGODB_URI) {
        if (process.env.MONGODB_DNS) {
            setServers(process.env.MONGODB_DNS.split(',').map(endereco => endereco.trim()));
        }

        const { MongoClient } = await import('mongodb');
        cliente = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 7000 });
        await cliente.connect();
        banco = cliente.db(process.env.MONGODB_DB || 'acessamob');
    }

    await lerDados();

    const servidor = createServer(async (requisicao, resposta) => {
        try {
            const url = new URL(requisicao.url, 'http://localhost');
            const metodo = requisicao.method;

            /* pré-verificação do navegador quando o site está em outro endereço */
            if (metodo === 'OPTIONS') {
                resposta.writeHead(204, cabecalhosCors());
                resposta.end();
                return;
            }

            if (metodo === 'GET' && url.pathname === '/api/cuidadores') {
                const dados = await lerDados();
                responder(resposta, 200, dados.cuidadores.map(c => montarResumo(c, dados)).filter(Boolean));
                return;
            }

            if (metodo === 'GET' && url.pathname === '/api/idosos') {
                const dados = await lerDados();
                responder(resposta, 200, (dados.idosos || []).map(i => ({ id: i.id, nome: i.nome, apelido: i.apelido || '' })));
                return;
            }

            const rotaPerfil = url.pathname.match(/^\/api\/cuidadores\/([a-zA-Z0-9-]+)$/);
            if (metodo === 'GET' && rotaPerfil) {
                const dados = await lerDados();
                const cuidador = dados.cuidadores.find(item => item.id === rotaPerfil[1]);
                const perfil = cuidador ? montarPerfil(cuidador, dados) : null;

                if (!perfil) {
                    responder(resposta, 404, { mensagem: 'Perfil não encontrado.' });
                    return;
                }

                responder(resposta, 200, perfil);
                return;
            }

            const rotaAvaliar = url.pathname.match(/^\/api\/cuidadores\/([a-zA-Z0-9-]+)\/avaliacoes$/);
            if (metodo === 'POST' && rotaAvaliar) {
                const corpo = await lerCorpo(requisicao).catch(() => null);
                const dados = await lerDados();
                if (!dados.cuidadores.some(c => c.id === rotaAvaliar[1])) {
                    responder(resposta, 404, { mensagem: 'Perfil não encontrado.' });
                    return;
                }
                const problema = validarAvaliacao(corpo);
                if (problema) {
                    responder(resposta, 400, { mensagem: problema });
                    return;
                }
                const avaliacao = {
                    id: 'ava-' + randomUUID(),
                    agendamentoId: null,
                    clienteId: CLIENTE_PADRAO,
                    cuidadorId: rotaAvaliar[1],
                    nota: Number(corpo.nota),
                    comentario: String(corpo.comentario || '').trim(),
                    data: hoje()
                };
                await inserir('avaliacoes', avaliacao);
                const atualizados = await lerDados();
                responder(resposta, 201, montarPerfil(atualizados.cuidadores.find(c => c.id === rotaAvaliar[1]), atualizados));
                return;
            }

            if (metodo === 'POST' && url.pathname === '/api/solicitacoes') {
                const corpo = await lerCorpo(requisicao).catch(() => null);
                const dados = await lerDados();
                const problema = validarSolicitacao(corpo, dados);
                if (problema) {
                    responder(resposta, 400, { mensagem: problema });
                    return;
                }
                const solicitacao = {
                    id: 'sol-' + randomUUID(),
                    clienteId: CLIENTE_PADRAO,
                    cuidadorId: corpo.cuidadorId,
                    idosoId: corpo.idosoId,
                    servico: corpo.servico,
                    data: corpo.data,
                    horaInicio: corpo.horaInicio,
                    horaFim: corpo.horaFim,
                    recorrencia: [],
                    mensagem: String(corpo.mensagem || '').trim(),
                    status: 'pendente',
                    criadaEm: agora(),
                    respondidaEm: null
                };
                await inserir('solicitacoes', solicitacao);
                responder(resposta, 201, solicitacao);
                return;
            }

            responder(resposta, 404, { mensagem: 'Página não encontrada.' });
        } catch (erro) {
            console.error(erro);
            responder(resposta, 500, { mensagem: 'Não foi possível acessar os dados.' });
        }
    });

    servidor.on('error', async erro => {
        console.error('Não foi possível iniciar a API. Código:', erro.code);
        await cliente?.close();
        process.exit(1);
    });

    /* local: só este computador; na hospedagem (Render define RENDER) ou com HOST=0.0.0.0: todas as interfaces */
    const host = process.env.HOST || (process.env.RENDER ? '0.0.0.0' : '127.0.0.1');
    servidor.listen(Number(process.env.PORT || 3006), host, () => {
        console.log('API de cuidadores: http://' + host + ':' + (process.env.PORT || 3006));
        console.log('Banco:', banco ? 'MongoDB' : 'db.json');
    });

    function encerrar() {
        servidor.close(async () => {
            await fila;
            await cliente?.close();
            process.exit(0);
        });
    }

    process.on('SIGINT', encerrar);
    process.on('SIGTERM', encerrar);
}

iniciar().catch(async erro => {
    console.error('Não foi possível abrir o banco. Confira o db.json ou a conexão no .env.');
    console.error(erro.message);
    await cliente?.close();
    process.exit(1);
});
