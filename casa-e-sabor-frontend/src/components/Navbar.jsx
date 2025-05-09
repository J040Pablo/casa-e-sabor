import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <h1 className="logo">Casa & Sabor</h1>
        <nav className="nav-links">
          <a href="#about" className="nav-item">
            Sobre-nós
          </a>
          <a href="#favorite-dishes" className="nav-item">
            Pratos Favoritos
          </a>
          <a href="#reviews" className="nav-item">
            Avaliações
          </a>
          <button className="order-button">Peça aqui</button>
        </nav>
      </div>
    </header>
  );
}
