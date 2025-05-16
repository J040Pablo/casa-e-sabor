const Pedido = require("../models/Pedido");

exports.criarPedido = async (req, res) => {
  try {
    const { itens } = req.body;
    const user = req.user;

    // Validação básica
    if (!user || !user.nome || !user.email) {
      return res.status(400).json({
        message: "Usuário autenticado é obrigatório.",
      });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        message: "Itens válidos são obrigatórios.",
      });
    }

    // Validar cada item individualmente e converter para número se necessário
    const itensValidados = itens.map((item) => {
      if (!item.nome) {
        throw new Error("Item sem nome encontrado");
      }

      const preco =
        typeof item.preco === "string" ? Number(item.preco) : item.preco;
      const quantidade =
        typeof item.quantidade === "string"
          ? Number(item.quantidade)
          : item.quantidade;

      if (isNaN(preco) || isNaN(quantidade)) {
        throw new Error(`Item ${item.nome}: preço ou quantidade inválidos`);
      }

      return {
        ...item,
        preco,
        quantidade,
      };
    });

    // Calcula o total com os itens validados
    const total = itensValidados.reduce((soma, item) => {
      return soma + item.preco * item.quantidade;
    }, 0);

    // Cria o pedido usando dados do usuário autenticado
    const novoPedido = new Pedido({
      cliente: {
        nome: user.nome,
        email: user.email,
      },
      itens: itensValidados,
      total,
      status: "em andamento",
      dataCriacao: new Date(),
    });

    await novoPedido.save();

    return res.status(201).json({
      message: "Pedido criado com sucesso.",
      pedido: novoPedido,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Erro ao salvar pedido.",
      error: err.message,
    });
  }
};

exports.listarPedidos = async (req, res) => {
  try {
    // Buscar todos os pedidos no banco de dados
    // Ordenados do mais recente para o mais antigo
    const pedidos = await Pedido.find().sort({ dataCriacao: -1 });

    // Retornar os pedidos encontrados
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error(">> [listarPedidos] erro ao buscar pedidos:", error);

    // Retornar erro 500 em caso de falha
    return res.status(500).json({
      message: "Erro ao buscar pedidos.",
      error: error.message,
    });
  }
};
