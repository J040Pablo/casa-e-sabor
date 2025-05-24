const { MercadoPagoConfig, Preference } = require('mercadopago');

console.log(">> [mercadoPago] Iniciando configuração do Mercado Pago");

// Token do Mercado Pago via variável de ambiente
const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error(">> [mercadoPago] ERRO: MERCADO_PAGO_ACCESS_TOKEN não está configurado nas variáveis de ambiente");
  throw new Error('Token de acesso do Mercado Pago não configurado');
}

// Configuração do cliente Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: ACCESS_TOKEN
});

console.log(">> [mercadoPago] Cliente configurado com token de produção");

// Configuração da preferência
const preference = new Preference(client);

console.log(">> [mercadoPago] Preferência configurada");

// Exporta as configurações
module.exports = { client, preference }; 