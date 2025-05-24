require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Importa as rotas
const pedidosRoutes = require("./routes/pedidos");
const authRoutes = require("./routes/auth");

// Logs de ambiente
console.log("Ambiente:", process.env.NODE_ENV || "desenvolvimento");
console.log("JWT_SECRET carregado:", process.env.JWT_SECRET ? "Sim" : "Não");
console.log("MERCADO_PAGO_ACCESS_TOKEN carregado:", process.env.MERCADO_PAGO_ACCESS_TOKEN ? "Sim" : "Não");
console.log("Token MP prefixo:", process.env.MERCADO_PAGO_ACCESS_TOKEN?.substring(0, 8));

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
  "http://localhost:5000"
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
    credentials: true
  })
);

// Middleware para ler JSON
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/auth", authRoutes);

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro global:', err);
  res.status(500).json({
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
