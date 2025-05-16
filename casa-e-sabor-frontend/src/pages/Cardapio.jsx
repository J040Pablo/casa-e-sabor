import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CarrinhoModal from "../components/CarrinhoModal";
import "../styles/Cardapio.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../contexts/AuthContext";
import Croissant from "../assets/croissant-de-chocolate.jpg";
import Macarrao from "../assets/Macarrao Alfredo.webp";
import Frango from "../assets/batatas rusticas com frango e bacon.jpg";
import Prato4 from "../assets/prato4.webp";
import Bebida1 from "../assets/agua.png";
import Bebida2 from "../assets/agua.png";

import { toast } from "react-toastify";

export default function Cardapio() {
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoVisible, setCarrinhoVisible] = useState(false);
  const { usuario } = useAuth();

  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000" // CORRIGIDO: porta do backend
      : "https://casa-e-sabor.onrender.com";

  const adicionarAoCarrinho = (prato) => {
    setCarrinho((prev) => [...prev, prato]);
    toast.success("Adicionado ao carrinho com sucesso!");
  };

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

      <section className="cardapio-section">
        <h2 className="section-title">Comidas</h2>
        <div className="cardapio-items">
          {comidas.map((p) => (
            <div className="cardapio-item" key={p.id}>
              <img
                src={p.imagem}
                alt={p.nome}
                className="cardapio-item-image"
              />
              <div className="cardapio-item-content">
                <h3 className="item-title">{p.nome}</h3>
                <p className="item-description">{p.descricao}</p>{" "}
                {/* <-- Aqui */}
                <p className="item-price">R$ {p.preco.toFixed(2)}</p>
                <button
                  className="adicionar-carrinho-button"
                  onClick={() => adicionarAoCarrinho(p)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cardapio-section">
        <h2 className="section-title">Bebidas</h2>
        <div className="cardapio-items">
          {bebidas.map((b) => (
            <div className="cardapio-item" key={b.id}>
              <img
                src={b.imagem}
                alt={b.nome}
                className="cardapio-item-image"
              />
              <div className="cardapio-item-content">
                <h3 className="item-title">{b.nome}</h3>
                <p className="item-description">{b.descricao}</p>{" "}
                {/* <-- Aqui */}
                <p className="item-price">R$ {b.preco.toFixed(2)}</p>
                <button
                  className="adicionar-carrinho-button"
                  onClick={() => adicionarAoCarrinho(b)}
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
        usuario={usuario}
        backendURL={backendURL}
      />
    </div>
  );
}
