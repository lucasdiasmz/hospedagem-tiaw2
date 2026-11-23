import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { setServers } from 'node:dns';

let cliente;
let banco;

async function lerDados() {
    if (banco) {
        const [usuarios, cuidadores, avaliacoes, clientes] = await Promise.all([
            banco.collection('usuarios').find({}, { projection: { _id: 0, id: 1, nome: 1 } }).toArray(),
            banco.collection('cuidadores').find({}, { projection: { _id: 0 } }).toArray(),
            banco.collection('avaliacoes').find({}, { projection: { _id: 0 } }).toArray(),
            banco.collection('clientes').find({}, { projection: { _id: 0, id: 1, usuarioId: 1 } }).toArray()
        ]);

        return { usuarios, cuidadores, avaliacoes, clientes };
    }

    return JSON.parse(await readFile(new URL('./db.json', import.meta.url), 'utf8'));
}

function montarPerfil(cuidador, dados) {
    const usuario = dados.usuarios.find(item => item.id === cuidador.usuarioId);

    if (!usuario) {
        return null;
    }

    const avaliacoes = (dados.avaliacoes || [])
        .filter(item => item.cuidadorId === cuidador.id && Number.isFinite(item.nota) && item.nota >= 1 && item.nota <= 5)
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
        });

    // Somente os campos apresentados na tela, sem dados de login.
    return {
        id: cuidador.id,
        nome: usuario.nome,
        foto: cuidador.foto || '',
        sobre: cuidador.sobre || '',
        experiencia: cuidador.experiencia || '',
        servicos: cuidador.servicos || [],
        qualificacoes: cuidador.qualificacoes || [],
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
        valorHora: Number.isFinite(cuidador.valorHora) ? cuidador.valorHora : null,
        avaliacoes
    };
}

function cabecalhosCors() {
    return {
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

            /* pré-verificação do navegador quando o site está em outro endereço */
            if (requisicao.method === 'OPTIONS') {
                resposta.writeHead(204, cabecalhosCors());
                resposta.end();
                return;
            }

            if (requisicao.method !== 'GET') {
                responder(resposta, 405, { mensagem: 'Esta tela permite somente consultar os perfis.' });
                return;
            }

            if (url.pathname === '/api/cuidadores') {
                const dados = await lerDados();
                const lista = dados.cuidadores.map(cuidador => {
                    const usuario = dados.usuarios.find(item => item.id === cuidador.usuarioId);

                    return usuario ? { id: cuidador.id, nome: usuario.nome } : null;
                }).filter(Boolean);

                responder(resposta, 200, lista);
                return;
            }

            const rota = url.pathname.match(/^\/api\/cuidadores\/([a-zA-Z0-9-]+)$/);

            if (rota) {
                const dados = await lerDados();
                const cuidador = dados.cuidadores.find(item => item.id === rota[1]);
                const perfil = cuidador ? montarPerfil(cuidador, dados) : null;

                if (!perfil) {
                    responder(resposta, 404, { mensagem: 'Perfil não encontrado.' });
                    return;
                }

                responder(resposta, 200, perfil);
                return;
            }

            responder(resposta, 404, { mensagem: 'Página não encontrada.' });
        } catch {
            responder(resposta, 500, { mensagem: 'Não foi possível carregar os dados.' });
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
            await cliente?.close();
            process.exit(0);
        });
    }

    process.on('SIGINT', encerrar);
    process.on('SIGTERM', encerrar);
}

iniciar().catch(async () => {
    console.error('Não foi possível abrir o banco. Confira o db.json ou a conexão no .env.');
    await cliente?.close();
    process.exit(1);
});
