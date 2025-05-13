// server.js ou app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/cafeteria", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

const Pedido = mongoose.model("Pedido", {
  itens: [{ nome: String, preco: Number }],
  total: Number,
  data: { type: Date, default: Date.now },
});

app.post("/api/pedidos", async (req, res) => {
  try {
    const { carrinho, total } = req.body;

    // Criar um novo pedido no banco de dados
    const novoPedido = new Pedido({
      itens: carrinho,
      total,
    });

    await novoPedido.save();
    res
      .status(201)
      .json({ message: "Pedido realizado com sucesso", pedido: novoPedido });
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar o pedido", error });
  }
});

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
