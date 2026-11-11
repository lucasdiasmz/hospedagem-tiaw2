import { Router } from 'express';
import { agora } from '../servicos/tempo.js';
import {
  DIAS_SEMANA, ErroHttp, validarBooleano, validarCorpo, validarData, validarHora,
  validarLista, validarOpcao, validarTexto, validarTextoOpcional,
} from '../validacao.js';

/* regras de cada cadastro do idoso; recebem os catálogos para validar as opções */
const REGRAS = {
  medicamentos: (cat) => ({
    nome: { validar: (v) => validarTexto(v, 'Nome', 60) },
    dosagem: { validar: (v) => validarTexto(v, 'Dosagem', 30) },
    forma: { validar: (v) => validarOpcao(v, cat.formasMedicamento, 'Forma') },
    via: { validar: (v) => validarOpcao(v, cat.viasMedicamento, 'Via') },
    horarios: { validar: (v) => validarLista(v, 'Horários', (h) => validarHora(h)).sort() },
    categoria: { validar: (v) => validarTextoOpcional(v, 'Categoria', 40), padrao: '' },
    observacoes: { validar: (v) => validarTextoOpcional(v, 'Observações', 200), padrao: '' },
    ativo: { validar: (v) => validarBooleano(v, 'Ativo'), padrao: true },
  }),
  tarefas: () => ({
    horario: { validar: (v) => validarHora(v) },
    titulo: { validar: (v) => validarTexto(v, 'Título', 80) },
    diasSemana: { validar: (v) => validarLista(v, 'Dias da semana', (d) => validarOpcao(d, DIAS_SEMANA, 'Dia')) },
    ativo: { validar: (v) => validarBooleano(v, 'Ativo'), padrao: true },
  }),
  consultas: (cat) => ({
    data: { validar: validarData },
    horario: { validar: (v) => validarHora(v) },
    especialidade: { validar: (v) => validarTexto(v, 'Especialidade', 60) },
    profissional: { validar: (v) => validarTextoOpcional(v, 'Profissional', 60), padrao: '' },
    local: { validar: (v) => validarTextoOpcional(v, 'Local', 100), padrao: '' },
    status: { validar: (v) => validarOpcao(v, cat.statusConsulta, 'Status'), padrao: 'agendada' },
    acompanhanteId: { validar: (v) => (v == null ? null : validarTexto(v, 'Acompanhante', 40)), padrao: null },
    observacoes: { validar: (v) => validarTextoOpcional(v, 'Observações', 200), padrao: '' },
  }),
};

/* campos preenchidos pelo servidor na criação */
const EXTRAS = {
  medicamentos: (req, dados) => ({ frequencia: dados.horarios.length, cadastradoPor: req.usuario.id, criadoEm: agora() }),
  tarefas: () => ({}),
  consultas: () => ({}),
};

/* CRUD de /api/idosos/:idosoId/{medicamentos|tarefas|consultas}; o acesso ao idoso já foi checado */
export function rotasCadastros(repo, colecao) {
  const r = Router({ mergeParams: true });

  async function regras() {
    return REGRAS[colecao](await repo.buscarCatalogos());
  }

  async function doIdoso(req) {
    const doc = await repo.buscar(colecao, req.params.id);
    if (!doc || doc.idosoId !== req.idoso.id) throw new ErroHttp(404, 'Não encontrado');
    return doc;
  }

  r.get('/', async (req, res) => {
    res.json(await repo.listar(colecao, { idosoId: req.idoso.id }));
  });

  r.get('/:id', async (req, res) => {
    res.json(await doIdoso(req));
  });

  r.post('/', async (req, res) => {
    const dados = validarCorpo(req.body, await regras());
    const doc = await repo.inserir(colecao, { idosoId: req.idoso.id, ...dados, ...EXTRAS[colecao](req, dados) });
    res.status(201).json(doc);
  });

  r.patch('/:id', async (req, res) => {
    await doIdoso(req);
    const mudanca = validarCorpo(req.body, await regras(), true);
    if (mudanca.horarios) mudanca.frequencia = mudanca.horarios.length;
    res.json(await repo.atualizar(colecao, req.params.id, mudanca));
  });

  r.delete('/:id', async (req, res) => {
    await doIdoso(req);
    await repo.remover(colecao, req.params.id);
    res.status(204).end();
  });

  return r;
}
