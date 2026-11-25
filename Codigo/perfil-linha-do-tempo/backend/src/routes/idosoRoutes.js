import { Router } from "express";
import { exigirPapel } from "../../../../auth/express.js";
import {
  listarIdosos,
  carregarIdoso,
  buscarIdoso,
  atualizarIdoso
} from "../controllers/idosoController.js";
import {
  listarRelatosDoIdoso,
  resumoDaSemana,
  criarRelato
} from "../controllers/relatoController.js";

const router = Router();

/* toda rota com :id passa por aqui: o perfil precisa ser de um idoso da pessoa (fica em req.idoso) */
router.param("id", carregarIdoso);

/* idosos são criados no cadastro (API do início) */
router.get("/", listarIdosos);
router.get("/:id", buscarIdoso);
router.put("/:id", exigirPapel(["cliente"], "mensagem"), atualizarIdoso);

router.get("/:id/relatos", listarRelatosDoIdoso);
router.get("/:id/relatos/resumo-semana", resumoDaSemana);
router.post("/:id/relatos", criarRelato);

export default router;
