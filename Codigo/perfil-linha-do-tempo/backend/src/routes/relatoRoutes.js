import { Router } from "express";
import { exigirPapel } from "../../../../auth/express.js";
import { carregarRelato, marcarComoVisto, removerRelato } from "../controllers/relatoController.js";

const router = Router();

router.param("id", carregarRelato);

router.patch("/:id/visto", exigirPapel(["cliente", "cuidador"], "mensagem"), marcarComoVisto);
router.delete("/:id", exigirPapel(["cliente"], "mensagem"), removerRelato);

export default router;
