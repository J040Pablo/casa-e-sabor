const Pedido = require("../models/Pedido");

// Criar um novo pedido
exports.criarPedido = async (req, res) => {
  try {
    const { cliente, itens } = req.body;

    // Calcular total
    const total = itens.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
    );

    const novoPedido = new Pedido({
      cliente,
      itens,
      total,
    });

    await novoPedido.save();
    res.status(201).json(novoPedido);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Listar todos os pedidos
exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).json(pedidos);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
