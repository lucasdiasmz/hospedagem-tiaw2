import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import idosoRoutes from "./routes/idosoRoutes.js";
import relatoRoutes from "./routes/relatoRoutes.js";
import { rotaNaoEncontrada, tratarErros } from "./middlewares/tratarErros.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5179" }));
app.use(express.json());

app.get("/api/health", function (req, res) {
  let banco = "desconectado";
  if (mongoose.connection.readyState === 1) {
    banco = "conectado";
  }
  res.json({ status: "ok", banco: banco });
});

app.use("/api/idosos", idosoRoutes);
app.use("/api/relatos", relatoRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

export default app;
