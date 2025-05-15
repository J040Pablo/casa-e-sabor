const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const Pedido = require("../models/Pedido"); // <- IMPORTAÇÃO do modelo Pedido

// Rota para criar um pedido
router.post("/", async (req, res) => {
  try {
    const novoPedido = new Pedido(req.body);
    await novoPedido.save();
    res.status(201).json({ message: "Pedido criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    res.status(500).json({ message: "Erro ao salvar pedido." });
  }
});

// Rota para listar os pedidos
router.get("/", pedidosController.listarPedidos);

module.exports = router;
