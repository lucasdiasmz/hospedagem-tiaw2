import { createServer } from 'node:http';
import { readFile, writeFile, rename } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { setServers } from 'node:dns';

const arquivo = new URL('./db.json', import.meta.url);
const temporario = new URL('./db.json.tmp', import.meta.url);
const usaMongo = Boolean(process.env.MONGODB_URI);
let cliente;
let banco;
let fila = Promise.resolve();

function hoje() {
    return new Date().toLocaleDateString('sv-SE', {
        timeZone: 'America/Sao_Paulo'
    });
}

function horaAtual() {
    return new Date().toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/* no MongoDB o id do db.json fica no _id (padrão do Codigo/inicio); devolve sempre com "id" */
function comId({ _id, ...resto }) {
    return { id: resto.id ?? _id, ...resto };
}

async function lerDados() {
    if (usaMongo) {
        const [idosos, medicamentos, registros] = await Promise.all([
            banco.collection('idosos').find({}).toArray(),
            banco.collection('medicamentos').find({}).toArray(),
            banco.collection('registros').find({}).toArray()
        ]);

        return { idosos: idosos.map(comId), medicamentos: medicamentos.map(comId), registros: registros.map(comId) };
    }

    return JSON.parse(await readFile(arquivo, 'utf8'));
}

function montarDoses(dados, idosoId, data) {
    const doses = [];

    for (const medicamento of dados.medicamentos) {
        if (medicamento.idosoId !== idosoId || !medicamento.ativo) {
            continue;
        }

        for (const horario of medicamento.horarios) {
            const registros = dados.registros.filter(registro => {
                return registro.tipo === 'medicamento'
                    && registro.itemId === medicamento.id
                    && registro.idosoId === idosoId
                    && registro.data === data
                    && registro.horarioPrevisto === horario;
            });

            let status = 'Pendente';

            if (registros.some(registro => registro.status === 'feito')) {
                status = 'Tomado';
            } else if (registros.some(registro => registro.status === 'recusou')) {
                status = 'Recusado';
            }

            doses.push({
                id: medicamento.id + '@' + horario,
                medicamentoId: medicamento.id,
                idosoId,
                nome: medicamento.nome,
                dosagem: medicamento.dosagem,
                horario,
                frequencia: typeof medicamento.frequencia === 'number'
                    ? medicamento.frequencia + (medicamento.frequencia === 1 ? ' vez ao dia' : ' vezes ao dia')
                    : medicamento.frequencia,
                observacoes: medicamento.observacoes || 'Sem observações.',
                via: medicamento.via,
                forma: medicamento.forma,
                status,
                data
            });
        }
    }

    return doses.sort((primeiro, segundo) => primeiro.horario.localeCompare(segundo.horario));
}

async function alterarRegistro(idDose, status, dataTela) {
    const data = hoje();

    // Uma tela aberta ontem precisa ser recarregada antes de confirmar doses.
    if (dataTela !== data) {
        return { codigo: 409, mensagem: 'O dia mudou. Recarregue a tela antes de registrar.' };
    }

    const dados = await lerDados();
    const separador = idDose.lastIndexOf('@');
    const medicamentoId = idDose.slice(0, separador);
    const horario = idDose.slice(separador + 1);
    const medicamento = dados.medicamentos.find(item => item.id === medicamentoId && item.ativo);

    if (!medicamento || !medicamento.horarios.includes(horario)) {
        return { codigo: 404, mensagem: 'Dose não encontrada.' };
    }

    const filtro = {
        tipo: 'medicamento',
        itemId: medicamentoId,
        idosoId: medicamento.idosoId,
        data,
        horarioPrevisto: horario,
        status: 'feito'
    };

    const novoRegistro = {
        id: 'reg-' + randomUUID(),
        ...filtro,
        horarioRegistro: horaAtual(),
        registradoPor: 'usr-1'
    };

    function corresponde(registro) {
        return Object.entries(filtro).every(([campo, valor]) => registro[campo] === valor);
    }

    if (usaMongo) {
        if (status === 'Tomado') {
            await banco.collection('registros').updateOne(
                filtro,
                { $setOnInsert: novoRegistro },
                { upsert: true }
            );
        } else {
            await banco.collection('registros').deleteMany(filtro);
        }
    } else {
        if (status === 'Tomado') {
            if (!dados.registros.some(corresponde)) {
                dados.registros.push(novoRegistro);
            }
        } else {
            // Desfaz apenas a confirmação desta dose, preservando recusas e outras atividades.
            dados.registros = dados.registros.filter(registro => !corresponde(registro));
        }

        await writeFile(temporario, JSON.stringify(dados, null, 4) + '\n');
        await rename(temporario, arquivo);
    }

    const atualizados = await lerDados();
    const dose = montarDoses(atualizados, medicamento.idosoId, data).find(item => item.id === idDose);
    return { codigo: 200, dose };
}

function cabecalhosCors() {
    return {
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
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
        if (Buffer.byteLength(corpo) > 4096) {
            throw new Error('Corpo muito grande.');
        }
    }

    return JSON.parse(corpo);
}

async function importarMongo() {
    const dados = JSON.parse(await readFile(arquivo, 'utf8'));

    for (const [nome, conteudo] of Object.entries(dados)) {
        if (Array.isArray(conteudo)) {
            await banco.collection(nome).createIndex({ id: 1 }, { unique: true });

            for (const documento of conteudo) {
                await banco.collection(nome).updateOne(
                    { id: documento.id },
                    { $setOnInsert: documento },
                    { upsert: true }
                );
            }
        } else {
            await banco.collection(nome).updateOne(
                { _id: 'catalogo' },
                { $setOnInsert: conteudo },
                { upsert: true }
            );
        }
    }

    console.log('Dados importados. Documentos existentes não foram substituídos.');
}

async function iniciar() {
    if (usaMongo) {
        if (process.env.MONGODB_DNS) {
            setServers(process.env.MONGODB_DNS.split(',').map(endereco => endereco.trim()));
        }

        const { MongoClient } = await import('mongodb');
        cliente = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        await cliente.connect();
        banco = cliente.db(process.env.MONGODB_DB || 'acessamob');
    }

    if (process.argv.includes('--importar')) {
        if (!usaMongo) {
            throw new Error('Configure MONGODB_URI no .env antes de importar.');
        }
        await importarMongo();
        await cliente.close();
        return;
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

            if (requisicao.method === 'GET' && url.pathname === '/api/idosos') {
                await fila;
                const dados = await lerDados();
                responder(resposta, 200, dados.idosos.map(idoso => ({ id: idoso.id, nome: idoso.nome })));
                return;
            }

            if (requisicao.method === 'GET' && url.pathname === '/api/medicamentos') {
                await fila;
                const dados = await lerDados();
                const idosoId = url.searchParams.get('idosoId') || 'ido-1';
                responder(resposta, 200, montarDoses(dados, idosoId, hoje()));
                return;
            }

            if (requisicao.method === 'PATCH' && url.pathname.startsWith('/api/medicamentos/')) {
                let corpo;
                let id;

                try {
                    corpo = await lerCorpo(requisicao);
                    id = decodeURIComponent(url.pathname.slice('/api/medicamentos/'.length));
                } catch {
                    responder(resposta, 400, { mensagem: 'Requisição inválida.' });
                    return;
                }

                if (!corpo || !['Tomado', 'Pendente'].includes(corpo.status)) {
                    responder(resposta, 400, { mensagem: 'Status inválido.' });
                    return;
                }

                // Uma gravação por vez para não perder registros de outras doses.
                const tarefa = fila.then(() => alterarRegistro(id, corpo.status, corpo.data));
                fila = tarefa.catch(() => {});
                const resultado = await tarefa;
                responder(resposta, resultado.codigo, resultado.dose || { mensagem: resultado.mensagem });
                return;
            }

            responder(resposta, 404, { mensagem: 'Rota não encontrada.' });
        } catch {
            responder(resposta, 500, { mensagem: 'Não foi possível acessar os dados.' });
        }
    });

    servidor.on('error', async erro => {
        console.error('Falha ao iniciar API. Código:', erro.code);
        await cliente?.close();
        process.exit(1);
    });

    /* local: só este computador; na hospedagem (Render define RENDER) ou com HOST=0.0.0.0: todas as interfaces */
    const host = process.env.HOST || (process.env.RENDER ? '0.0.0.0' : '127.0.0.1');
    servidor.listen(Number(process.env.PORT || 3005), host, () => {
        console.log('API de medicamentos: http://' + host + ':' + (process.env.PORT || 3005));
        console.log('Banco:', usaMongo ? 'MongoDB' : 'db.json');
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

iniciar().catch(async () => {
    console.error('Falha ao abrir os dados. Confira db.json ou a conexão MongoDB no .env.');
    await cliente?.close();
    process.exit(1);
});
