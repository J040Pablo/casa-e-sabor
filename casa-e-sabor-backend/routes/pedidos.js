const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const authenticateToken = require("../middleware/authenticateToken");

// Rota para criar um pedido (requer autenticação)
router.post("/", authenticateToken, pedidosController.criarPedido);

// Rota para listar os pedidos (agora protegida)
router.get("/", authenticateToken, pedidosController.listarPedidos);

// Rota para atualizar status do pedido
router.patch("/:pedidoId/status", authenticateToken, pedidosController.atualizarStatusPedido);

// Rota para criar pagamento com Mercado Pago
router.post("/:pedidoId/pagamento/mercado-pago", authenticateToken, pedidosController.criarPagamentoMercadoPago);

// Rota para criar pagamento PIX
router.post("/:pedidoId/pagamento/pix", authenticateToken, pedidosController.criarPagamentoPix);

// Webhook do Mercado Pago (não requer autenticação)
router.post("/webhook/mercado-pago", pedidosController.webhookMercadoPago);

module.exports = router;
