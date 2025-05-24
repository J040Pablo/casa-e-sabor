// components/Navbar.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PedidosModal from "./PedidosModal";
import "../styles/Navbar.css";
import defaultAvatar from "../assets/default-avatar.svg";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPedidosModal, setShowPedidosModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profileRef = useRef();

  const { usuario, login, logout } = useAuth();

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://casa-e-sabor.onrender.com";

  // Fecha menu de perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Efeito de scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Login / Cadastro
  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target;
    const nome = form.nome?.value;
    const email = form.email.value;
    const senha = form.senha.value;

    if (!isLogin && nome.trim().length < 2) {
      toast.warning("O nome deve conter no mínimo 2 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const route = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(`${API_URL}${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.mensagem || data.erro || "Erro na autenticação");
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        login(data.token);
        setShowAuthModal(false);
      } else {
        toast.success("Cadastro realizado com sucesso! Faça login.");
        setIsLogin(true);
        form.reset();
      }
    } catch {
      toast.error("Erro ao comunicar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate("/");
    toast.info("Você saiu da conta.");
  };

  // Navegação dinâmica baseada na página atual
  const renderNavLinks = () => {
    if (location.pathname === "/cardapio") {
      return (
        <>
          <a className="nav-item" href="#comidas">
            Comidas
          </a>
          <a className="nav-item" href="#bebidas">
            Bebidas
          </a>
          <a className="nav-item" href="#sobremesas">
            Sobremesas
          </a>
        </>
      );
    }

    return (
      <>
        <a className="nav-item" href="#about">
          Sobre Nós
        </a>
        <a className="nav-item" href="#favorite-dishes">
          Cardápio
        </a>
        <a className="nav-item" href="#reviews">
          Avaliações
        </a>
      </>
    );
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="logo" onClick={() => navigate("/")}>
            Casa
            <span className="br-small">
              <br />
            </span>
            &amp;
            <span className="br-small">
              <br />
            </span>
            Sabor
          </div>

          <div className="nav-links">
            {renderNavLinks()}
          </div>

          <div className="user-info" ref={profileRef}>
            {usuario ? (
              <button className="logged-in-payment-button" onClick={() => setShowProfileMenu((prev) => !prev)}>
                <img
                  src={usuario.profileImage || defaultAvatar}
                  alt="Avatar"
                  className="profile-avatar"
                />
                <span className="payment-text">Realizar Pagamento</span>
                {showProfileMenu && (
                  <ul className="profile-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                    <li onClick={() => setShowPedidosModal(true)}>Pedidos</li>
                    <li onClick={handleLogout}>Sair da conta</li>
                  </ul>
                )}
              </button>
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
        </div>
      </nav>

      {/* Modal de Pedidos */}
      <PedidosModal
        show={showPedidosModal}
        onClose={() => setShowPedidosModal(false)}
      />

      {/* Modal de Login/Cadastro */}
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
                  minLength={2}
                  required
                  disabled={isLoading}
                />
              )}
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                required 
                disabled={isLoading}
              />
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                required
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className={isLoading ? "loading" : ""}
                disabled={isLoading}
              >
                {isLoading 
                  ? (isLogin ? "Realizando login..." : "Cadastrando sua conta...") 
                  : (isLogin ? "Entrar" : "Cadastrar")}
              </button>
            </form>
            <p
              className="switch-mode"
              onClick={() => !isLoading && setIsLogin((prev) => !prev)}
              style={{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {isLogin
                ? "Não tem conta? Cadastre-se"
                : "Já tem conta? Faça login"}
            </p>
            <button
              className="close-btn"
              onClick={() => !isLoading && setShowAuthModal(false)}
              disabled={isLoading}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
