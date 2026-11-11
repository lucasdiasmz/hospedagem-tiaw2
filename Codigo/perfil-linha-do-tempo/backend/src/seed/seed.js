import "dotenv/config";
import { conectarBanco, desconectarBanco } from "../config/db.js";
import { popularBanco } from "./popular.js";

async function executar() {
  try {
    await conectarBanco();
    await popularBanco();
  } catch (erro) {
    console.error("Erro ao popular o banco:", erro.message);
    process.exitCode = 1;
  } finally {
    await desconectarBanco();
  }
}

executar();
