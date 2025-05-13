import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        {/* Logo redireciona para Home */}
        <div className="logo" onClick={() => navigate("/")}>
          Casa & Sabor
        </div>

        {/* Menu de navegação */}
        <div className="nav-links">
          <a className="nav-item" href="#about">
            Sobre Nós
          </a>
          <a className="nav-item" href="#favorite-dishes">
            Cardápio
          </a>
          <a className="nav-item" href="#reviews">
            Avaliações
          </a>
        </div>

        {/* Botão "Peça Aqui" redireciona para o Cardápio */}
        <button className="order-button" onClick={() => navigate("/cardapio")}>
          Peça Aqui
        </button>
      </div>
    </nav>
  );
}
