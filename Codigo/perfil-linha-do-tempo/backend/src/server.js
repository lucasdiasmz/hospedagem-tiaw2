import "dotenv/config";
import { carregarSegredo } from "../../../auth/sessao.js";
import app from "./app.js";
import { conectarBanco } from "./config/db.js";

const PORT = process.env.PORT || 3007;

async function iniciar() {
  try {
    carregarSegredo();
    await conectarBanco();
    app.listen(PORT, function () {
      console.log("API rodando em http://localhost:" + PORT);
    });
  } catch (erro) {
    console.error("Não foi possível iniciar o servidor:", erro.message);
    process.exit(1);
  }
}

iniciar();
