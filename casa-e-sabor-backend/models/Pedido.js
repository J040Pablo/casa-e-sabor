const mongoose = require("mongoose");

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

const PedidoSchema = new mongoose.Schema({
  cliente: {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
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
