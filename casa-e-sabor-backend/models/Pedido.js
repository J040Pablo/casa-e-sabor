const mongoose = require("mongoose");

// Subdocumento para os itens do pedido
const ItemPedidoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  preco: {
    type: Number,
    required: true,
    min: 0,
  },
  quantidade: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
});

// Schema principal do pedido
const PedidoSchema = new mongoose.Schema({
  cliente: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["em andamento", "finalizado", "cancelado"],
    default: "em andamento",
  },
  itens: {
    type: [ItemPedidoSchema],
    required: true,
    validate: [
      (array) => array.length > 0,
      "O pedido deve conter pelo menos um item.",
    ],
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
});

const Pedido = mongoose.model("Pedido", PedidoSchema);

module.exports = Pedido;
