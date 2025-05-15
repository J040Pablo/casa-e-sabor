import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CarrinhoModal from "../components/CarrinhoModal";
import "../styles/Cardapio.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import Prato1 from "../assets/prato1.webp";
import Prato2 from "../assets/prato2.webp";
import Prato3 from "../assets/prato3.webp";
import Prato4 from "../assets/prato4.webp";

import { toast } from "react-toastify";

export default function Cardapio() {
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoVisible, setCarrinhoVisible] = useState(false);

  // URL do backend via variável de ambiente

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
      cliente: "Nome do Cliente", // Ajuste conforme sua lógica
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

  const pratos = [
    {
      id: 1,
      nome: "Prato Especial 1",
      descricao: "Delicioso.",
      preco: 45.0,
      imagem: Prato1,
    },
    {
      id: 2,
      nome: "Prato Especial 2",
      descricao: "Sabor único.",
      preco: 38.0,
      imagem: Prato2,
    },
    {
      id: 3,
      nome: "Prato Especial 3",
      descricao: "Ingredientes incríveis.",
      preco: 50.0,
      imagem: Prato3,
    },
    {
      id: 4,
      nome: "Prato Especial 4",
      descricao: "Irresistível.",
      preco: 42.0,
      imagem: Prato4,
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

      <section className="cardapio-items">
        {pratos.map((prato) => (
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
