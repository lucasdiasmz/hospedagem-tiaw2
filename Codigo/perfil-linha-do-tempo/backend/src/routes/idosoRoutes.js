import { Router } from "express";
import {
  listarIdosos,
  buscarIdoso,
  criarIdoso,
  atualizarIdoso,
  removerIdoso
} from "../controllers/idosoController.js";
import {
  listarRelatosDoIdoso,
  resumoDaSemana,
  criarRelato
} from "../controllers/relatoController.js";

const router = Router();

router.get("/", listarIdosos);
router.get("/:id", buscarIdoso);
router.post("/", criarIdoso);
router.put("/:id", atualizarIdoso);
router.delete("/:id", removerIdoso);

router.get("/:id/relatos", listarRelatosDoIdoso);
router.get("/:id/relatos/resumo-semana", resumoDaSemana);
router.post("/:id/relatos", criarRelato);

export default router;
