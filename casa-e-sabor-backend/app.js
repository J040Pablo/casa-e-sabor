const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pedidosRoutes = require("./routes/pedidos");
const authRoutes = require("./routes/auth"); // Importa as rotas de autenticação
const cors = require("cors");
require("dotenv").config();
console.log("JWT_SECRET carregado:", process.env.JWT_SECRET);

// Conexão com o MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas conectado!"))
  .catch((err) => console.error("Erro ao conectar:", err));

// Domínios permitidos para CORS
const allowedOrigins = [
  "https://casa-e-sabor.vercel.app",
  "http://localhost:5173",
  "https://seu-frontend-domain.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Middleware para ler JSON
app.use(bodyParser.json());

// Rotas
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/auth", authRoutes); // Agora corretamente antes do listen

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
