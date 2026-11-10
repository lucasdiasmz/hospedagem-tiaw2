import { Router } from 'express';
import {
  DIAS_SEMANA, ErroHttp, validarBooleano, validarCorpo, validarData, validarHora,
  validarLista, validarOpcao, validarTexto, validarTextoOpcional,
} from '../validacao.js';

const FREQUENCIAS = ['diaria', 'semanal'];

/* null (não repete) ou { frequencia: 'diaria' | 'semanal', diasSemana: [...] } */
function validarRecorrencia(valor) {
  if (valor === null) return null;
  if (typeof valor !== 'object' || Array.isArray(valor)) throw new ErroHttp(400, 'Recorrência inválida');
  const frequencia = validarOpcao(valor.frequencia, FREQUENCIAS, 'Frequência');
  if (frequencia === 'diaria') return { frequencia, diasSemana: [...DIAS_SEMANA] };
  const dias = validarLista(valor.diasSemana, 'Dias da semana', (d) => validarOpcao(d, DIAS_SEMANA, 'Dia'));
  return { frequencia, diasSemana: DIAS_SEMANA.filter((d) => dias.includes(d)) };
}

/* { ativo: boolean, minutosAntes: 0 a 10080 (uma semana) } */
function validarLembrete(valor) {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) throw new ErroHttp(400, 'Lembrete inválido');
  const ativo = validarBooleano(valor.ativo, 'Lembrete ativo');
  const minutos = valor.minutosAntes ?? 0;
  if (!Number.isInteger(minutos) || minutos < 0 || minutos > 10080) {
    throw new ErroHttp(400, 'Minutos do lembrete devem ser de 0 a 10080');
  }
  return { ativo, minutosAntes: ativo ? minutos : 0 };
}

/* regras de um evento da agenda; tipos e status vêm dos catálogos */
function regras(cat) {
  return {
    tipo: { validar: (v) => validarOpcao(v, cat.tiposEvento.map((t) => t.id), 'Tipo') },
    data: { validar: validarData },
    horario: { validar: (v) => validarHora(v) },
    titulo: { validar: (v) => validarTexto(v, 'Título', 80) },
    subtitulo: { validar: (v) => validarTextoOpcional(v, 'Detalhe', 80), padrao: '' },
    status: { validar: (v) => validarOpcao(v, cat.statusEvento.map((s) => s.id), 'Status'), padrao: 'confirmado' },
    recorrencia: { validar: validarRecorrencia, padrao: null },
    lembrete: { validar: validarLembrete, padrao: { ativo: false, minutosAntes: 0 } },
  };
}

/* CRUD de /api/idosos/:idosoId/eventos (coleção eventosAgenda); o acesso ao idoso já foi checado */
export function rotasEventos(repo) {
  const r = Router({ mergeParams: true });

  async function doIdoso(req) {
    const evento = await repo.buscar('eventosAgenda', req.params.id);
    if (!evento || evento.idosoId !== req.idoso.id) throw new ErroHttp(404, 'Compromisso não encontrado');
    return evento;
  }

  r.get('/', async (req, res) => {
    const eventos = await repo.listar('eventosAgenda', { idosoId: req.idoso.id });
    res.json(eventos.sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario)));
  });

  r.get('/:id', async (req, res) => {
    res.json(await doIdoso(req));
  });

  /* compromisso criado pela agenda não tem cadastro de origem (origem: null) */
  r.post('/', async (req, res) => {
    const dados = validarCorpo(req.body || {}, regras(await repo.buscarCatalogos()));
    const evento = await repo.inserir('eventosAgenda', { idosoId: req.idoso.id, ...dados, origem: null });
    res.status(201).json(evento);
  });

  r.patch('/:id', async (req, res) => {
    await doIdoso(req);
    const mudanca = validarCorpo(req.body || {}, regras(await repo.buscarCatalogos()), true);
    res.json(await repo.atualizar('eventosAgenda', req.params.id, mudanca));
  });

  r.delete('/:id', async (req, res) => {
    await doIdoso(req);
    await repo.remover('eventosAgenda', req.params.id);
    res.status(204).end();
  });

  return r;
}
