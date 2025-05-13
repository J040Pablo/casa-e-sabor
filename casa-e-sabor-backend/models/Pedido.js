const mongoose = require("mongoose");

const ItemPedidoSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  quantidade: { type: Number, default: 1 },
});

const PedidoSchema = new mongoose.Schema({
  cliente: String,
  status: { type: String, default: "em andamento" },
  itens: [ItemPedidoSchema],
  total: Number,
  dataCriacao: { type: Date, default: Date.now },
});

const Pedido = mongoose.model("Pedido", PedidoSchema);

module.exports = Pedido;
