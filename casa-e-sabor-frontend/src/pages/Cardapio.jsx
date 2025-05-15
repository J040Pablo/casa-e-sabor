import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CarrinhoModal from "../components/CarrinhoModal";
import "../styles/Cardapio.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import Croissant from "../assets/croissant-de-chocolate.jpg";
import Macarrao from "../assets/Macarrao Alfredo.webp";
import Frango from "../assets/batatas rusticas com frango e bacon.jpg";
import Prato4 from "../assets/prato4.webp";

import Bebida1 from "../assets/agua.png"; // imagina que você tenha essas imagens
import Bebida2 from "../assets/agua.png";

import { toast } from "react-toastify";

export default function Cardapio() {
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoVisible, setCarrinhoVisible] = useState(false);

  const backendURL = "https://casa-e-sabor.onrender.com";

  const adicionarAoCarrinho = (prato) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, prato]);
    toast.success("Adicionado ao carrinho com sucesso!");
  };

  const finalizarPedido = async () => {
    if (!Array.isArray(carrinho) || carrinho.length === 0) {
      toast.error("Carrinho está vazio.");
      return;
    }

    const total = carrinho.reduce((soma, item) => {
      if (!item?.preco || isNaN(item.preco)) {
        toast.error("Erro no preço de um dos itens.");
        return soma;
      }
      return soma + parseFloat(item.preco);
    }, 0);

    const pedido = {
      cliente: "Nome do Cliente",
      status: "em andamento",
      itens: carrinho.map((item) => ({
        id: item.id,
        nome: item.nome,
        preco: item.preco,
        quantidade: 1,
      })),
      total,
    };

    try {
      const response = await fetch(`${backendURL}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (response.ok) {
        toast.success("Pedido finalizado com sucesso!");
        setCarrinho([]);
        setCarrinhoVisible(false);
      } else {
        const data = await response.json().catch(() => null);
        toast.error(data?.message || `Erro: ${response.status}`);
      }
    } catch (error) {
      toast.error("Erro ao finalizar o pedido.");
      console.error(error);
    }
  };

  // Lista de comidas
  const comidas = [
    {
      id: 1,
      nome: "Croissant de Chocolate",
      descricao:
        "Massa leve e folhada recheada com chocolate meio amargo, assada até dourar.",
      preco: 9.9,
      imagem: Croissant,
    },
    {
      id: 2,
      nome: "Macarrão ao Molho Alfredo",
      descricao:
        "Espaguete com molho cremoso de queijo, creme de leite e ervas frescas.",
      preco: 21.9,
      imagem: Macarrao,
    },
    {
      id: 3,
      nome: "Frango Grelhado com Batatas Rústicas",
      descricao:
        "Filé de frango com tempero da casa e batatas douradas e crocantes.",
      preco: 24.9,
      imagem: Frango,
    },
    {
      id: 4,
      nome: "Prato Especial 4",
      descricao: "Irresistível.",
      preco: 42.0,
      imagem: Prato4,
    },
  ];

  // Lista de bebidas
  const bebidas = [
    {
      id: 101,
      nome: "Suco Natural",
      descricao: "Refrescante e saudável.",
      preco: 12.0,
      imagem: Bebida1,
    },
    {
      id: 102,
      nome: "Refrigerante",
      descricao: "Geladinho e saboroso.",
      preco: 8.0,
      imagem: Bebida2,
    },
  ];

  return (
    <div className="cardapio">
      <Navbar />

      <header className="cardapio-header">
        <h1 className="cardapio-title">Nosso Cardápio</h1>
        <p className="cardapio-subtitle">
          Explore os sabores deliciosos que temos a oferecer.
        </p>
      </header>

      {/* Seção Comidas */}
      <section className="cardapio-section">
        <h2 className="section-title">Comidas</h2>
        <div className="cardapio-items">
          {comidas.map((prato) => (
            <div className="cardapio-item" key={prato.id}>
              <img
                src={prato.imagem}
                alt={prato.nome}
                className="cardapio-item-image"
              />
              <div className="cardapio-item-content">
                <h3 className="item-title">{prato.nome}</h3>
                <p className="item-description">{prato.descricao}</p>
                <p className="item-price">R$ {prato.preco.toFixed(2)}</p>
                <button
                  className="adicionar-carrinho-button"
                  onClick={() => adicionarAoCarrinho(prato)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Bebidas */}
      <section className="cardapio-section">
        <h2 className="section-title">Bebidas</h2>
        <div className="cardapio-items">
          {bebidas.map((bebida) => (
            <div className="cardapio-item" key={bebida.id}>
              <img
                src={bebida.imagem}
                alt={bebida.nome}
                className="cardapio-item-image"
              />
              <div className="cardapio-item-content">
                <h3 className="item-title">{bebida.nome}</h3>
                <p className="item-description">{bebida.descricao}</p>
                <p className="item-price">R$ {bebida.preco.toFixed(2)}</p>
                <button
                  className="adicionar-carrinho-button"
                  onClick={() => adicionarAoCarrinho(bebida)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="finalizar-pedido">
        <button
          className="finalizar-pedido-button"
          onClick={() => setCarrinhoVisible(true)}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" /> Ver
          Carrinho ({carrinho.length})
        </button>
      </div>

      <CarrinhoModal
        visible={carrinhoVisible}
        carrinho={carrinho}
        setCarrinho={setCarrinho}
        onFechar={() => setCarrinhoVisible(false)}
        onFinalizar={finalizarPedido}
      />
    </div>
  );
}
