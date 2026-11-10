import { Router } from "express";
import { marcarComoVisto, removerRelato } from "../controllers/relatoController.js";

const router = Router();

router.patch("/:id/visto", marcarComoVisto);
router.delete("/:id", removerRelato);

export default router;
