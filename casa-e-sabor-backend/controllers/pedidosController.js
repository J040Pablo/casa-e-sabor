const Pedido = require("../models/Pedido");
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Configurar o Mercado Pago
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
if (!accessToken) {
  console.error('ERRO: MERCADO_PAGO_ACCESS_TOKEN não está configurado nas variáveis de ambiente');
  throw new Error('Token de acesso do Mercado Pago não configurado');
}

// Validação do token
if (!accessToken.startsWith('APP_USR-')) {
  console.error('ERRO: Token do Mercado Pago inválido. Deve começar com APP_USR-');
  throw new Error('Token de acesso do Mercado Pago inválido');
}

// Configuração do cliente Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken,
  options: {
    timeout: 5000, // timeout de 5 segundos
    idempotencyKey: true // garante que requisições duplicadas não sejam processadas
  }
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

      // Adiciona o parâmetro mode=web para forçar o modo web
      const initPoint = result.init_point + (result.init_point.includes('?') ? '&' : '?') + 'mode=web';

      // Atualiza o pedido com informações do pagamento
      pedido.metodoPagamento = "mercado_pago";
      pedido.preferenceId = result.id;
      await pedido.save();

      // Retorna a URL de pagamento
      return res.status(200).json({
        init_point: initPoint,
        preferenceId: result.id,
        sandbox_init_point: result.sandbox_init_point // Para testes
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

exports.criarPagamentoPix = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { cpf, cnpj } = req.body; // Recebe CPF ou CNPJ do frontend

    const pedido = await Pedido.findById(pedidoId);

    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    if (pedido.statusPagamento === "pago") {
      return res.status(400).json({ message: "Este pedido já foi pago" });
    }

    // Validação do valor
    if (!pedido.total || pedido.total <= 0) {
      return res.status(400).json({ message: "Valor do pedido inválido" });
    }

    // Validação dos dados do cliente
    if (!pedido.cliente || !pedido.cliente.email || !pedido.cliente.nome) {
      return res.status(400).json({ message: "Dados do cliente incompletos" });
    }

    // Validação do CPF/CNPJ
    if (!cpf && !cnpj) {
      return res.status(400).json({ 
        message: "CPF ou CNPJ é obrigatório para pagamento via PIX" 
      });
    }

    // Log para debug
    console.log('Iniciando pagamento PIX:', {
      pedidoId: pedido._id,
      valor: pedido.total,
      cliente: pedido.cliente.email,
      documento: cpf || cnpj
    });

    const payment = new Payment(client);

    // Formatação do nome do cliente
    const nomeCompleto = pedido.cliente.nome.trim();
    const primeiroNome = nomeCompleto.split(' ')[0];
    const sobrenome = nomeCompleto.split(' ').slice(1).join(' ') || 'Cliente';

    const paymentData = {
      transaction_amount: Number(pedido.total).toFixed(2),
      description: `Pedido #${pedido._id}`,
      payment_method_id: "pix",
      payer: {
        email: pedido.cliente.email.toLowerCase().trim(),
        first_name: primeiroNome,
        last_name: sobrenome,
        identification: {
          type: cpf ? "CPF" : "CNPJ",
          number: cpf || cnpj
        }
      },
      metadata: {
        pedido_id: pedido._id.toString(),
        order_id: pedido._id.toString()
      },
      additional_info: {
        items: pedido.itens.map(item => ({
          id: item._id?.toString() || 'item',
          title: item.nome,
          quantity: item.quantidade,
          unit_price: item.preco
        }))
      },
      notification_url: `${process.env.BACKEND_URL}/api/pedidos/webhook/mercado-pago`,
      external_reference: pedido._id.toString()
    };

    // Log do payload para debug
    console.log('Payload do pagamento:', JSON.stringify(paymentData, null, 2));

    try {
      const result = await payment.create({ body: paymentData });

      // Log da resposta para debug
      console.log('Resposta do Mercado Pago:', JSON.stringify(result, null, 2));

      if (!result || !result.point_of_interaction) {
        throw new Error('Resposta inválida do Mercado Pago');
      }

      if (result.status !== 'pending') {
        throw new Error('Não foi possível gerar o QR Code Pix');
      }

      // Atualiza o pedido com informações do pagamento
      pedido.metodoPagamento = "pix";
      pedido.paymentId = result.id;
      pedido.statusPagamento = "pendente";
      await pedido.save();

      return res.status(200).json({
        qr_code: result.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64,
        payment_id: result.id,
        status: result.status,
        expires_at: result.date_of_expiration
      });
    } catch (mpError) {
      console.error('Erro detalhado do Mercado Pago:', {
        message: mpError.message,
        status: mpError.status,
        response: mpError.response?.data
      });
      
      // Tratamento específico para erro PXB01
      if (mpError.message && mpError.message.includes('PXB01')) {
        return res.status(400).json({
          message: "Erro na geração do pagamento PIX",
          error: "Erro de autenticação ou formato inválido",
          details: mpError.message,
          debug_info: {
            token_prefix: accessToken.substring(0, 8),
            valor: paymentData.transaction_amount,
            email: paymentData.payer.email,
            documento: paymentData.payer.identification.number
          }
        });
      }

      return res.status(400).json({
        message: "Erro ao gerar pagamento PIX",
        error: mpError.message,
        details: mpError.response?.data
      });
    }
  } catch (error) {
    console.error("Erro ao criar pagamento PIX:", error);
    return res.status(500).json({
      message: "Erro ao processar pagamento PIX",
      error: error.message
    });
  }
};
