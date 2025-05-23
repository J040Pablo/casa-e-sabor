const { MercadoPagoConfig, Preference } = require('mercadopago');

console.log(">> [mercadoPago] Iniciando configuração do Mercado Pago");

// Token de produção do Mercado Pago
const ACCESS_TOKEN = 'APP_USR-8399051268111330-052311-749ff2c1550b296fbb3fe81770f5fc4f-1920674109';

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