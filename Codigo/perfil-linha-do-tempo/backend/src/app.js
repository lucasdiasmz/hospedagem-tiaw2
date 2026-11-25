import express from "express";
import mongoose from "mongoose";
import { exigirLogin } from "../../../auth/express.js";
import { repo } from "./services/acessoPerfil.js";
import idosoRoutes from "./routes/idosoRoutes.js";
import relatoRoutes from "./routes/relatoRoutes.js";
import { rotaNaoEncontrada, tratarErros } from "./middlewares/tratarErros.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "50kb" }));

app.get("/api/health", function (req, res) {
  let banco = "desconectado";
  if (mongoose.connection.readyState === 1) {
    banco = "conectado";
  }
  res.json({ status: "ok", banco: banco });
});

/* daqui para baixo, só com a sessão (cookie assinado; Codigo/auth) */
app.use("/api", exigirLogin(repo, "mensagem"));

app.use("/api/idosos", idosoRoutes);
app.use("/api/relatos", relatoRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

export default app;
