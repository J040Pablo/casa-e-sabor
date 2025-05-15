const Pedido = require("../models/Pedido");

// Criar um novo pedido
exports.criarPedido = async (req, res) => {
  try {
    const { cliente, itens } = req.body;

    // Verifica se cliente e itens foram fornecidos corretamente
    if (!cliente || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        message: "Cliente e itens são obrigatórios.",
      });
    }

    // Calcula o total com base no preço e quantidade de cada item
    const total = itens.reduce((soma, item) => {
      if (
        typeof item.preco !== "number" ||
        typeof item.quantidade !== "number"
      ) {
        throw new Error(
          "Item inválido: cada item deve conter 'preco' e 'quantidade' numéricos."
        );
      }
      return soma + item.preco * item.quantidade;
    }, 0);

    // Cria o novo pedido
    const novoPedido = new Pedido({
      cliente,
      itens,
      total,
    });

    await novoPedido.save();

    res.status(201).json({
      message: "Pedido criado com sucesso.",
      pedido: novoPedido,
    });
  } catch (err) {
    console.error("Erro ao salvar pedido:", err); // Log no terminal
    res.status(400).json({
      message: "Erro ao salvar pedido.",
      error: err.message,
    });
  }
};

// Listar todos os pedidos
exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ dataCriacao: -1 });
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar pedidos.",
      error: error.message,
    });
  }
};
