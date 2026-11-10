import { Router } from 'express';
import { exigirAcesso, idososDoUsuario } from '../servicos/acesso.js';
import { montarMes, proximos } from '../servicos/agenda.js';
import { agora } from '../servicos/tempo.js';
import { ErroHttp, validarData } from '../validacao.js';
import { rotasEventos } from './eventos.js';

const RE_MES = /^\d{4}-(0[1-9]|1[0-2])$/;

export function rotasIdosos(repo) {
  const r = Router();

  /* idosos que o usuário logado acompanha */
  r.get('/', async (req, res) => {
    res.json(await idososDoUsuario(repo, req.usuario));
  });

  /* todas as rotas com :idosoId exigem acesso ao idoso; ele fica em req.idoso */
  r.param('idosoId', async (req, res, next, idosoId) => {
    try {
      req.idoso = await exigirAcesso(repo, req.usuario, idosoId);
      next();
    } catch (e) {
      next(e);
    }
  });

  r.get('/:idosoId', (req, res) => {
    res.json(req.idoso);
  });

  /* próximos compromissos depois de ?de=AAAA-MM-DD (padrão: hoje); ?limite= (1 a 20, padrão 4) */
  r.get('/:idosoId/agenda/proximos', async (req, res) => {
    const de = req.query.de === undefined ? agora().slice(0, 10) : validarData(req.query.de);
    const limite = req.query.limite === undefined ? 4 : Number(req.query.limite);
    if (!Number.isInteger(limite) || limite < 1 || limite > 20) throw new ErroHttp(400, 'Limite deve ser de 1 a 20');
    res.json(await proximos(repo, req.idoso.id, de, limite));
  });

  /* agenda do mês: { idosoId, mes, eventos, resumo } */
  r.get('/:idosoId/agenda/:mes', async (req, res) => {
    if (!RE_MES.test(req.params.mes)) throw new ErroHttp(400, 'Mês inválido (use AAAA-MM)');
    res.json(await montarMes(repo, req.idoso.id, req.params.mes));
  });

  r.use('/:idosoId/eventos', rotasEventos(repo));

  return r;
}
