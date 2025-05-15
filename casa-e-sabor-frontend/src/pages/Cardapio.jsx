import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CarrinhoModal from "../components/CarrinhoModal"; // Importando o CarrinhoModal

import "../styles/Cardapio.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import Prato1 from "../assets/prato1.webp";
import Prato2 from "../assets/prato2.webp";
import Prato3 from "../assets/prato3.webp";
import Prato4 from "../assets/prato4.webp";

import { toast } from "react-toastify";

export default function Cardapio() {
  const [carrinho, setCarrinho] = useState([]); // Estado para armazenar os pratos no carrinho
  const [carrinhoVisible, setCarrinhoVisible] = useState(false); // Estado para controlar a visibilidade do modal

  // Função para adicionar prato ao carrinho
  const adicionarAoCarrinho = (prato) => {
    setCarrinho((prevCarrinho) => {
      const novoCarrinho = [...prevCarrinho, prato];
      return novoCarrinho;
    });
    toast.success("Adicionado ao carrinho com sucesso!");
  };

  // Função para finalizar o pedido
  const finalizarPedido = async () => {
    if (!Array.isArray(carrinho) || carrinho.length === 0) {
      toast.error("Carrinho está vazio.");
      return;
    }

    console.log("Carrinho antes de calcular o total:", carrinho);

    const total = carrinho.reduce((soma, item) => {
      if (!item || !item.preco || isNaN(item.preco)) {
        toast.error("Erro no preço de um dos itens.");
        return soma;
      }
      return soma + parseFloat(item.preco);
    }, 0);

    const pedido = {
      cliente: "Nome do Cliente", // Substitua pelo nome do cliente
      status: "em andamento",
      itens: carrinho.map((item) => ({
        id: item.id,
        nome: item.nome,
        preco: item.preco,
        quantidade: 1, // Ou outra quantidade que você possa ter
      })),
      total: total,
    };

    console.log("Dados do pedido enviados:", pedido); // Verifique aqui

    try {
      const response = await fetch("http://localhost:5000/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      });

      if (response.ok) {
        toast.success("Pedido finalizado com sucesso!");
        setCarrinho([]);
        setCarrinhoVisible(false);
      } else {
        // Se o backend não retorna JSON válido, pode quebrar, então trate
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Erro ao ler resposta JSON:", jsonError);
          data = null;
        }
        console.error("Erro ao finalizar pedido:", data || response.statusText);
        toast.error(
          data?.message ||
            `Erro ao finalizar o pedido. Status: ${response.status}`
        );
      }
    } catch (error) {
      toast.error("Erro ao finalizar o pedido.");
      console.error("Erro de rede ou outro:", error);
    }
  };

  // Dados dos pratos
  const pratos = [
    {
      id: 1,
      nome: "Prato Especial 1",
      descricao: "Uma descrição deliciosa para deixar você com água na boca.",
      preco: 45.0,
      imagem: Prato1,
    },
    {
      id: 2,
      nome: "Prato Especial 2",
      descricao: "Experimente os sabores únicos deste prato especial.",
      preco: 38.0,
      imagem: Prato2,
    },
    {
      id: 3,
      nome: "Prato Especial 3",
      descricao:
        "Feito com os melhores ingredientes para uma experiência incrível.",
      preco: 50.0,
      imagem: Prato3,
    },
    {
      id: 4,
      nome: "Prato Especial 4",
      descricao: "Sabores irresistíveis que você vai adorar.",
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
                onClick={() => adicionarAoCarrinho(prato)} // Adiciona o prato ao carrinho
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </section>

      <div className="finalizar-pedido">
        <button
          className="finalizar-pedido-button"
          onClick={() => setCarrinhoVisible(true)} // Abre o modal quando clica em "Ver Carrinho"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
          Ver Carrinho ({carrinho.length})
        </button>
      </div>

      {/* Passando carrinhoVisible como "visible" para o CarrinhoModal */}
      <CarrinhoModal
        visible={carrinhoVisible}
        carrinho={carrinho}
        setCarrinho={setCarrinho}
        onFechar={() => setCarrinhoVisible(false)} // Fecha o modal
        onFinalizar={finalizarPedido} // Função de finalizar pedido
      />
    </div>
  );
}
