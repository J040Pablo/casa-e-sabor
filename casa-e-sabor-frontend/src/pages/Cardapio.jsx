import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CarrinhoModal from "../components/CarrinhoModal";
import "../styles/Cardapio.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

// Importação das imagens
import prato1 from "../assets/prato1.webp";
import prato2 from "../assets/prato2.webp";
import prato3 from "../assets/prato3.webp";
import prato4 from "../assets/prato4.webp";
import prato5 from "../assets/prato5.webp";
import prato6 from "../assets/prato6.webp";
import sucoNatural from "../assets/Suco-Natural.png";
import refrigerante from "../assets/Refrigerante.png";
import agua from "../assets/agua.png";
import sobremesa1 from "../assets/sobremesa1.png";
import sobremesa2 from "../assets/sobremesa2.png";
import sobremesa3 from "../assets/sobremesa3.png";
import croissant from "../assets/croissant-de-chocolate.jpg";
import macarrao from "../assets/Macarrao-Alfredo.webp";
import frango from "../assets/batatas-rusticas-com-frango-e-bacon.jpg";

export default function Cardapio() {
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoVisible, setCarrinhoVisible] = useState(false);
  const { usuario } = useAuth();

  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://casa-e-sabor.onrender.com";

  const adicionarAoCarrinho = (item) => {
    setCarrinho((prev) => [...prev, item]);
    toast.success("Adicionado ao carrinho com sucesso!");
  };

  const comidas = [
    {
      id: 1,
      nome: "Croissant de Chocolate",
      descricao: "Massa leve e folhada recheada com delicioso chocolate meio amargo, assada até ficar douradinha. Uma explosão de sabor a cada mordida!",
      preco: 9.90,
      imagem: croissant,
    },
    {
      id: 2,
      nome: "Macarrão ao Molho Alfredo",
      descricao: "Espaguete envolvido em um cremoso molho de queijo e creme de leite, finalizado com ervas frescas e toque de parmesão.",
      preco: 21.90,
      imagem: macarrao,
    },
    {
      id: 3,
      nome: "Frango Grelhado com Batatas Rústicas",
      descricao: "Filé de frango suculento, temperado com ervas da casa, servido com batatas douradas e crocantes por fora, macias por dentro.",
      preco: 24.90,
      imagem: frango,
    },
    {
      id: 4,
      nome: "Feijoada Completa",
      descricao: "Feijoada tradicional com todos os acompanhamentos.",
      preco: 45.90,
      imagem: prato1,
    },
    {
      id: 5,
      nome: "Picanha Grelhada",
      descricao: "Picanha grelhada com arroz, feijão e farofa.",
      preco: 55.90,
      imagem: prato2,
    },
    {
      id: 6,
      nome: "Risoto de Cogumelos",
      descricao: "Risoto cremoso com cogumelos frescos.",
      preco: 42.90,
      imagem: prato6,
    },
  ];

  const bebidas = [
    {
      id: 7,
      nome: "Suco Natural",
      descricao: "Suco de laranja, limão ou maracujá",
      preco: 8.90,
      imagem: sucoNatural,
    },
    {
      id: 8,
      nome: "Refrigerante",
      descricao: "Coca-Cola, Guaraná, Sprite ou Fanta",
      preco: 6.90,
      imagem: refrigerante,
    },
    {
      id: 9,
      nome: "Água Mineral",
      descricao: "Água mineral com ou sem gás",
      preco: 4.90,
      imagem: agua,
    },
  ];

  const sobremesas = [
    {
      id: 10,
      nome: "Pudim de Leite",
      descricao: "Pudim de leite condensado com calda de caramelo",
      preco: 12.90,
      imagem: sobremesa1,
    },
    {
      id: 11,
      nome: "Mousse de Chocolate",
      descricao: "Mousse de chocolate com raspas de chocolate",
      preco: 14.90,
      imagem: sobremesa2,
    },
    {
      id: 12,
      nome: "Sorvete",
      descricao: "Sorvete de creme com calda de chocolate",
      preco: 10.90,
      imagem: sobremesa3,
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
          {comidas.map((item) => (
            <div className="cardapio-item" key={item.id}>
              <img
                src={item.imagem}
                alt={item.nome}
                className="cardapio-item-image"
              />
              <div className="cardapio-item-content">
                <h3 className="item-title">{item.nome}</h3>
                <p className="item-description">{item.descricao}</p>
                <p className="item-price">R$ {item.preco.toFixed(2)}</p>
                <button
                  className="adicionar-carrinho-button"
                  onClick={() => adicionarAoCarrinho(item)}
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
          {bebidas.map((item) => (
            <div className="cardapio-item" key={item.id}>
              <img
                src={item.imagem}
                alt={item.nome}
                className="cardapio-item-image"
              />
              <div className="cardapio-item-content">
                <h3 className="item-title">{item.nome}</h3>
                <p className="item-description">{item.descricao}</p>
                <p className="item-price">R$ {item.preco.toFixed(2)}</p>
                <button
                  className="adicionar-carrinho-button"
                  onClick={() => adicionarAoCarrinho(item)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cardapio-section">
        <h2 className="section-title">Sobremesas</h2>
        <div className="cardapio-items">
          {sobremesas.map((item) => (
            <div className="cardapio-item" key={item.id}>
              <img
                src={item.imagem}
                alt={item.nome}
                className="cardapio-item-image"
              />
              <div className="cardapio-item-content">
                <h3 className="item-title">{item.nome}</h3>
                <p className="item-description">{item.descricao}</p>
                <p className="item-price">R$ {item.preco.toFixed(2)}</p>
                <button
                  className="adicionar-carrinho-button"
                  onClick={() => adicionarAoCarrinho(item)}
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
