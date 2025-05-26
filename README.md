Casa & Sabor
📝 Descrição do Projeto
Casa & Sabor é uma aplicação web desenvolvida para um restaurante/lanchonete, que permite aos clientes visualizarem o cardápio, realizarem pedidos online e efetuarem pagamentos de forma rápida e segura. O sistema também conta com integração ao Mercado Pago, oferecendo suporte para pagamentos via cartão e PIX. O objetivo é proporcionar uma experiência prática tanto para os clientes quanto para os administradores do estabelecimento.

🚀 Funcionalidades
Autenticação de Usuário: Cadastro e login de clientes.

Cardápio Dinâmico: Visualização dos itens organizados por categorias (Comidas, Bebidas e Sobremesas).

Carrinho de Compras: Adição e remoção de itens, com cálculo automático do total.

Realização de Pedidos: Envio dos pedidos diretamente para o backend.

Pagamento Online: Checkout integrado com Mercado Pago.

Pagamento via PIX: Geração de QR Code e código Copia e Cola.

Histórico de Pedidos: Acompanhamento de pedidos realizados.

Cancelamento de Pedidos: Possibilidade de cancelar pedidos que ainda não foram processados.

Notificações: Feedback visual sobre ações e status dos pedidos (via Toast).

🛠️ Tecnologias Utilizadas
Frontend
React

React Router DOM

Axios

React Toastify

Font Awesome

Mercado Pago SDK (Checkout Pro)

Vite

Backend

Node.js

Express

MongoDB (Mongoose)

Mercado Pago SDK

JWT (Autenticação)

Bcrypt (Criptografia de senhas)

dotenv (Gerenciamento de variáveis de ambiente)

Cors

📋 Pré-requisitos
Antes de começar, você precisa ter instalado na sua máquina:

Node.js (versão LTS recomendada)

npm ou yarn

MongoDB (local ou MongoDB Atlas)

Conta de desenvolvedor no Mercado Pago

⚙️ Instalação
🔗 Clonar o Repositório
bash
Copiar código
git clone [URL_DO_SEU_REPOSITORIO]
cd casa-e-sabor
🚩 Configuração do Backend
bash
Copiar código
cd casa-e-sabor-backend
npm install
Crie um arquivo .env na raiz da pasta casa-e-sabor-backend com o seguinte conteúdo:

env
Copiar código
PORT=5000
MONGODB_URI=[SUA_STRING_DE_CONEXAO_MONGODB]
JWT_SECRET=[UMA_STRING_SECRETA_FORTE_PARA_JWT]
MERCADO_PAGO_ACCESS_TOKEN=[SEU_ACCESS_TOKEN_DO_MERCADO_PAGO]
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
Variável	Descrição
MONGODB_URI	String de conexão com seu banco MongoDB.
JWT_SECRET	Uma string segura para gerar tokens JWT.
MERCADO_PAGO_ACCESS_TOKEN	Token de acesso do Mercado Pago (encontrado no painel de desenvolvedor).
FRONTEND_URL / BACKEND_URL	URLs para configuração do Checkout e Webhooks.

🚩 Configuração do Frontend
bash
Copiar código
cd ../casa-e-sabor-frontend
npm install
Crie um arquivo .env na raiz da pasta casa-e-sabor-frontend:

env
Copiar código
VITE_MERCADO_PAGO_PUBLIC_KEY=[SUA_PUBLIC_KEY_DO_MERCADO_PAGO]
Variável	Descrição
VITE_MERCADO_PAGO_PUBLIC_KEY	Public Key do Mercado Pago (encontrada no painel do desenvolvedor).

▶️ Como Rodar o Projeto
🖥️ Rodar o Backend
bash
Copiar código
cd casa-e-sabor-backend
npm start
Servidor rodando em http://localhost:5000

🖥️ Rodar o Frontend
bash
Copiar código
cd casa-e-sabor-frontend
npm run dev
Frontend rodando em http://localhost:3000

📸 Screenshots (Opcional)

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Feito com ❤️, café e código limpo.

