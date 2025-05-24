const Pedido = require("../models/Pedido");
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Configurar o Mercado Pago
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
if (!accessToken) {
  console.error('ERRO: MERCADO_PAGO_ACCESS_TOKEN não está configurado nas variáveis de ambiente');
  throw new Error('Token de acesso do Mercado Pago não configurado');
}

const client = new MercadoPagoConfig({ 
  accessToken
});

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
      status: "aguardando pagamento",
      statusPagamento: "pendente",
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
    const user = req.user;

    if (!user || !user.email) {
      return res.status(401).json({
        message: "Usuário não autenticado.",
      });
    }

    // Buscar apenas os pedidos do usuário logado
    const pedidos = await Pedido.find({
      "cliente.email": user.email.toLowerCase()
    }).sort({ dataCriacao: -1 });

    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar pedidos.",
      error: error.message,
    });
  }
};

exports.atualizarStatusPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { status, metodoPagamento } = req.body;

    const pedido = await Pedido.findById(pedidoId);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    if (status) {
      pedido.status = status;
    }

    if (metodoPagamento) {
      pedido.metodoPagamento = metodoPagamento;
      if (metodoPagamento === "dinheiro") {
        pedido.statusPagamento = "pago";
        pedido.status = "finalizado";
      }
    }

    await pedido.save();
    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar pedido",
      error: error.message,
    });
  }
};

exports.criarPagamentoMercadoPago = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    
    if (!pedidoId) {
      return res.status(400).json({ 
        message: "ID do pedido é obrigatório" 
      });
    }

    const pedido = await Pedido.findById(pedidoId);
    
    if (!pedido) {
      return res.status(404).json({ 
        message: "Pedido não encontrado" 
      });
    }

    if (pedido.statusPagamento === "pago") {
      return res.status(400).json({ 
        message: "Este pedido já foi pago" 
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://casa-e-sabor.vercel.app';
    const backendUrl = process.env.BACKEND_URL || 'https://casa-e-sabor.onrender.com';

    const preference = new Preference(client);
    
    const preferenceData = {
      items: [
        {
          title: `Pedido #${pedido._id}`,
          description: `Pedido de ${pedido.cliente.nome}`,
          quantity: 1,
          unit_price: Number(pedido.total),
          currency_id: "BRL"
        }
      ],
      payer: {
        name: pedido.cliente.nome,
        email: pedido.cliente.email
      },
      payment_methods: {
        installments: 1,
        default_installments: 1,
        excluded_payment_methods: [],
        excluded_payment_types: [],
        default_payment_method_id: null,
        default_payment_type_id: null
      },
      back_urls: {
        success: `${frontendUrl}/pedidos/success`,
        failure: `${frontendUrl}/pedidos/failure`,
        pending: `${frontendUrl}/pedidos/pending`
      },
      external_reference: pedidoId.toString(),
      notification_url: `${backendUrl}/api/pedidos/webhook/mercado-pago`,
      statement_descriptor: "CASA E SABOR",
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    };

    try {
      const result = await preference.create({ body: preferenceData });
      
      if (!result || !result.init_point) {
        throw new Error('Falha ao criar preferência no Mercado Pago: init_point não encontrado');
      }

      pedido.metodoPagamento = "mercado_pago";
      pedido.preferenceId = result.id;
      await pedido.save();

      return res.status(200).json({
        init_point: result.init_point,
        preferenceId: result.id,
      });
    } catch (mpError) {
      console.error('Erro na integração com Mercado Pago:', mpError.message);
      return res.status(400).json({
        message: "Erro na integração com Mercado Pago",
        error: mpError.message
      });
    }
  } catch (error) {
    console.error('Erro ao criar pagamento:', error.message);
    return res.status(500).json({
      message: "Erro ao criar pagamento",
      error: error.message
    });
  }
};

exports.webhookMercadoPago = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({ 
        message: "Dados do webhook inválidos" 
      });
    }

    if (type === "payment") {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: data.id });
      
      if (!paymentData || !paymentData.external_reference) {
        throw new Error('Dados do pagamento inválidos');
      }

      const pedidoId = paymentData.external_reference;
      const pedido = await Pedido.findById(pedidoId);
      
      if (!pedido) {
        return res.status(404).json({ 
          message: "Pedido não encontrado" 
        });
      }

      if (paymentData.status === "approved") {
        pedido.statusPagamento = "pago";
        pedido.status = "finalizado";
        pedido.dataPagamento = new Date();
        await pedido.save();
      } else if (paymentData.status === "rejected") {
        pedido.statusPagamento = "falhou";
        await pedido.save();
      }
    }

    return res.status(200).json({ 
      message: "Webhook processado com sucesso" 
    });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return res.status(500).json({
      message: "Erro ao processar webhook",
      error: error.message
    });
  }
};
