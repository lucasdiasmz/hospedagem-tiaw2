import mongoose from "mongoose";

export async function conectarBanco() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI não definida. Crie o arquivo .env a partir do .env.example");
  }

  await mongoose.connect(uri);
  console.log("MongoDB conectado em " + mongoose.connection.host + "/" + mongoose.connection.name);
}

export async function desconectarBanco() {
  await mongoose.disconnect();
}
