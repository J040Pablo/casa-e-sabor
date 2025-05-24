import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CarrinhoModal from "../components/CarrinhoModal";
import "../styles/Cardapio.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

// Importação das imagens
import croissant from "../assets/croissant-de-chocolate.jpg";
import macarrao from "../assets/Macarrao-Alfredo.webp";
import frango from "../assets/batatas-rusticas-com-frango-e-bacon.jpg";
import Feijoada from "../assets/Feijoada.jpeg";
import Picanha from "../assets/Picanha.jpeg";
import RisotoDeCogumelos from "../assets/RisotoDeCogumelos.jpeg";
import agua from "../assets/agua.png";
import PudimDeLeite from "../assets/PudimDeLeite.jpeg";
import MousseDeChocolate from "../assets/MousseDeChocolate.jpeg";
import Sorvete from "../assets/Sorvete.jpeg";

// Importação das novas imagens de bebidas
import SucoDeLaranja from "../assets/SucoDeLaranja.png";
import SucoDeLimao from "../assets/SucoDeLimao.png";
import SucoDeMaracuja from "../assets/SucoDeMaracuja.webp";
import CocaCola from "../assets/CocaCola.png";
import Guarana from "../assets/Guarana.png";
import Fanta from "../assets/Fanta.png";

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
      imagem: Feijoada,
    },
    {
      id: 5,
      nome: "Picanha Grelhada",
      descricao: "Picanha grelhada com arroz, feijão e farofa.",
      preco: 55.90,
      imagem: Picanha,
    },
    {
      id: 6,
      nome: "Risoto de Cogumelos",
      descricao: "Risoto cremoso com cogumelos frescos.",
      preco: 42.90,
      imagem: RisotoDeCogumelos,
    },
  ];

  const bebidas = [
    {
      id: 7,
      nome: "Suco de Laranja",
      descricao: "Suco natural e refrescante de laranja.",
      preco: 8.90,
      imagem: SucoDeLaranja,
    },
    {
      id: 8,
      nome: "Suco de Limão",
      descricao: "Suco natural e refrescante de limão.",
      preco: 8.90,
      imagem: SucoDeLimao,
    },
    {
      id: 9,
      nome: "Suco de Maracujá",
      descricao: "Suco natural e calmante de maracujá.",
      preco: 8.90,
      imagem: SucoDeMaracuja,
    },
    {
      id: 10,
      nome: "Coca-Cola",
      descricao: "Refrigerante sabor cola.",
      preco: 6.90,
      imagem: CocaCola,
    },
    {
      id: 11,
      nome: "Guaraná",
      descricao: "Refrigerante sabor guaraná.",
      preco: 6.90,
      imagem: Guarana,
    },
    {
      id: 12,
      nome: "Fanta",
      descricao: "Refrigerante sabor laranja.",
      preco: 6.90,
      imagem: Fanta,
    },
    {
      id: 13,
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
      imagem: PudimDeLeite,
    },
    {
      id: 11,
      nome: "Mousse de Chocolate",
      descricao: "Mousse de chocolate com raspas de chocolate",
      preco: 14.90,
      imagem: MousseDeChocolate,
    },
    {
      id: 12,
      nome: "Sorvete",
      descricao: "Sorvete de creme com calda de chocolate",
      preco: 10.90,
      imagem: Sorvete,
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

      <section id="comidas" className="cardapio-section">
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

      <section id="bebidas" className="cardapio-section">
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

      <section id="sobremesas" className="cardapio-section">
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
