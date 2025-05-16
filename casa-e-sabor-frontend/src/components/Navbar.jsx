import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  // Define a URL do backend conforme ambiente (dev ou produção)
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://casa-e-sabor.onrender.com";

  useEffect(() => {
    // Tenta recuperar usuário salvo no localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    const form = e.target;
    const nome = form.nome?.value;
    const email = form.email.value;
    const senha = form.senha.value;

    try {
      if (isLogin) {
        // Login
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.mensagem || data.erro || "Erro no login");
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.usuario));
        setUser(data.usuario);
        setShowAuthModal(false);
      } else {
        // Registro
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.mensagem || data.erro || "Erro no cadastro");
          return;
        }
        alert("Cadastro realizado com sucesso! Faça login.");
        setIsLogin(true);
        form.reset();
      }
    } catch {
      alert("Erro ao comunicar com o servidor.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // redireciona para a home
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="logo" onClick={() => navigate("/")}>
            Casa & Sabor
          </div>
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

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontWeight: "bold" }}>Olá, {user.nome}</span>
              <button className="order-button" onClick={handleLogout}>
                Sair
              </button>
            </div>
          ) : (
            <button
              className="order-button"
              onClick={() => {
                setIsLogin(true);
                setShowAuthModal(true);
              }}
            >
              Entrar
            </button>
          )}
        </div>
      </nav>

      {showAuthModal && (
        <div className="auth-modal">
          <div className="auth-box">
            <h2>{isLogin ? "Login" : "Cadastrar"}</h2>
            <form onSubmit={handleAuth}>
              {!isLogin && (
                <input
                  type="text"
                  name="nome"
                  placeholder="Seu nome"
                  required
                />
              )}
              <input type="email" name="email" placeholder="Email" required />
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                required
              />
              <button type="submit">{isLogin ? "Entrar" : "Cadastrar"}</button>
            </form>

            <p
              onClick={() => setIsLogin((prev) => !prev)}
              className="switch-mode"
              style={{ cursor: "pointer" }}
            >
              {isLogin
                ? "Não tem conta? Cadastre-se"
                : "Já tem conta? Faça login"}
            </p>

            <button
              className="close-btn"
              onClick={() => setShowAuthModal(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
