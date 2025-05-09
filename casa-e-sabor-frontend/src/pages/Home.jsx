import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css"; // Arquivo de estilos

export default function Home() {
  return (
    <div className="home">
      {/* Navbar */}
      <Navbar />

      {/* Welcome Section */}
      <section className="welcome">
        <h2 className="welcome-text">Bem-Vindo</h2>
        <h1 className="main-title">Casa & Sabor</h1>
        <p className="subtitle">
          Subheading that sets up context, shares more info about the website,
          or generally gets people psyched to keep scrolling.
        </p>
        <button className="btn">Ver Cardápio</button>
      </section>

      {/* Info Section */}
      <section className="info">
        <div className="info-card">
          <img
            src={new URL("../assets/Bandeja.png", import.meta.url).href}
            alt="Sobre-nós"
            className="info-icon"
          />
          <h3 className="info-title">Sobre-nós</h3>
          <p className="info-description">
            Comida caseira feita com carinho, em um ambiente acolhedor.
          </p>
        </div>
        <div className="info-card">
          <img
            src={new URL("../assets/Cardapio.png", import.meta.url).href}
            alt="Cardápio"
            className="info-icon"
          />
          <h3 className="info-title">Cardápio</h3>
          <p className="info-description">
            Pratos variados, saborosos e preparados com ingredientes frescos.
          </p>
        </div>
        <div className="info-card">
          <img
            src={new URL("../assets/Avaliacao.png", import.meta.url).href}
            alt="Avaliações"
            className="info-icon"
          />
          <h3 className="info-title">Avaliações</h3>
          <p className="info-description">
            Veja o que nossos clientes dizem sobre a experiência no Casa &
            Sabor.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2 className="section-title">Sobre nós</h2>
        <p className="about-text">
          A Casa & Sabor nasceu da paixão por comida caseira feita com carinho.
          Nosso objetivo é oferecer pratos saborosos em um ambiente acolhedor,
          onde todos se sintam em casa.
        </p>
        <div className="image-container">
          <img
            src="/example-image.jpg"
            alt="Pratos da Casa & Sabor"
            className="about-image"
          />
        </div>
      </section>

      {/* Favorite Dishes */}
      <section id="favorite-dishes" className="favorite-dishes">
        <h2 className="menu-title">Cardápio</h2>
        <h2 className="favorite-dishes">Pratos Favoritos</h2>
        <div className="dishes-grid">
          <div className="dish-card">
            <img
              src={
                new URL("../assets/croissant-de-chocolate.jpg", import.meta.url)
                  .href
              }
              alt="Croissant de Chocolate"
              className="dish-image"
            />
            <h3 className="dish-name">Croissant de Chocolate</h3>
            <p className="dish-description">
              Massa leve e folhada recheada com delicioso chocolate meio amargo,
              assada até ficar douradinha. Uma explosão de sabor a cada mordida!
            </p>
          </div>
          <div className="dish-card">
            <img
              src={
                new URL("../assets/Macarrao Alfredo.webp", import.meta.url).href
              }
              alt="Macarrão ao Molho Alfredo"
              className="dish-image"
            />
            <h3 className="dish-name">Macarrão ao Molho Alfredo</h3>
            <p className="dish-description">
              Espaguete envolvido em um cremoso molho de queijo e creme de
              leite, finalizado com ervas frescas e toque de parmesão.
            </p>
          </div>
          <div className="dish-card">
            <img
              src={
                new URL(
                  "../assets/batatas rusticas com frango e bacon.jpg",
                  import.meta.url
                ).href
              }
              alt="Frango Grelhado com Batatas Rústicas"
              className="dish-image"
            />
            <h3 className="dish-name">Frango Grelhado com Batatas Rústicas</h3>
            <p className="dish-description">
              Filé de frango suculento, temperado com ervas da casa, servido com
              batatas douradas e crocantes por fora, macias por dentro.
            </p>
          </div>
        </div>
      </section>
      <section id="reviews" className="reviews">
        <h2 className="section-title">Avaliações</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <p className="review-text">
              "A melhor feijoada que já comi! Ambiente super acolhedor e
              atendimento excelente."
            </p>
            <h4 className="review-author">— Maria S.</h4>
          </div>
          <div className="review-card">
            <p className="review-text">
              "Os pratos são sempre frescos e muito saborosos. Recomendo
              demais!"
            </p>
            <h4 className="review-author">— João C.</h4>
          </div>
          <div className="review-card">
            <p className="review-text">
              "Experiência incrível! O croissant de chocolate é uma delícia!"
            </p>
            <h4 className="review-author">— Ana T.</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
