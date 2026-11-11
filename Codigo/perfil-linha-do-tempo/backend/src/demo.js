import "dotenv/config";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "./app.js";
import { conectarBanco, desconectarBanco } from "./config/db.js";
import { popularBanco } from "./seed/popular.js";

const PORT = process.env.PORT || 3007;

async function iniciarDemo() {
  let mongo = null;

  try {
    console.log("Iniciando o MongoDB de demonstração...");
    console.log("(na primeira vez ele baixa o MongoDB, pode levar 1 ou 2 minutos)");

    mongo = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongo.getUri("acessamob");

    await conectarBanco();
    await popularBanco();

    app.listen(PORT, function () {
      console.log("");
      console.log("API de demonstração rodando em http://localhost:" + PORT);
      console.log("Os dados são de exemplo e voltam ao normal toda vez que o comando é reiniciado.");
    });
  } catch (erro) {
    console.error("Não foi possível iniciar a demonstração:", erro.message);
    if (mongo) {
      await mongo.stop();
    }
    process.exit(1);
  }

  async function encerrar() {
    await desconectarBanco();
    if (mongo) {
      await mongo.stop();
    }
    process.exit(0);
  }

  process.on("SIGINT", encerrar);
  process.on("SIGTERM", encerrar);
}

iniciarDemo();
