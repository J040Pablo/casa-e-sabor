const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pedidosRoutes = require("./routes/pedidos"); // importa rotas
const cors = require("cors");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas conectado!"))
  .catch((err) => console.error("Erro ao conectar:", err));

// Habilita CORS antes de qualquer middleware ou rota
app.use(
  cors({
    origin: "http://localhost:5173", // endereço do frontend que fará as requisições
  })
);

// Para interpretar JSON
app.use(bodyParser.json());

// Usa as rotas de pedidos
app.use("/api/pedidos", pedidosRoutes);

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
