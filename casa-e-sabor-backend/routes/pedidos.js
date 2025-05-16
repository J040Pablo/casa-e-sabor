const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const authenticateToken = require("../middleware/authenticateToken");

// Rota para criar um pedido (requer autenticação)
router.post("/", authenticateToken, pedidosController.criarPedido);

// Rota para listar os pedidos (pode ser pública ou protegida, como preferir)
router.get("/", pedidosController.listarPedidos);

module.exports = router;
