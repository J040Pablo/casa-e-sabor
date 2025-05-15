const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pedidosRoutes = require("./routes/pedidos");
const cors = require("cors");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas conectado!"))
  .catch((err) => console.error("Erro ao conectar:", err));

// Habilita CORS para todas as origens (mude "*" para o domínio do frontend para produção)
app.use(
  cors({
    origin: "https://casa-e-sabor.vercel.app", // ajuste para a URL real do seu frontend no Vercel
  })
);

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Rotas
app.use("/api/pedidos", pedidosRoutes);

// Porta para Render pegar dinamicamente, ou 5000 localmente
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
