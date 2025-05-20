// components/Navbar.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PedidosModal from "./PedidosModal";
import "../styles/Navbar.css";
import defaultAvatar from "../assets/default-avatar.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPedidosModal, setShowPedidosModal] = useState(false);
  const profileRef = useRef();

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://casa-e-sabor.onrender.com";

  // Checa usuário no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

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
    const form = e.target;
    const nome = form.nome?.value;
    const email = form.email.value;
    const senha = form.senha.value;

    if (!isLogin && nome.trim().length < 2) {
      toast.warning("O nome deve conter no mínimo 2 caracteres.");
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
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.usuario));
        setUser(data.usuario);
        setShowAuthModal(false);
        toast.success(`Bem-vindo(a), ${data.usuario.nome}!`);
      } else {
        toast.success("Cadastro realizado com sucesso! Faça login.");
        setIsLogin(true);
        form.reset();
      }
    } catch {
      toast.error("Erro ao comunicar com o servidor.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowProfileMenu(false);
    navigate("/");
    toast.info("Você saiu da conta.");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
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

          <div className="user-info" ref={profileRef}>
            {user ? (
              <>
                <img
                  src={user.profileImage || defaultAvatar}
                  alt="Avatar"
                  className="profile-avatar"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                />

                {showProfileMenu && (
                  <ul className="profile-menu-dropdown">
                    <li onClick={() => setShowPedidosModal(true)}>Pedidos</li>
                    <li onClick={handleLogout}>Sair da conta</li>
                  </ul>
                )}
              </>
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
              className="switch-mode"
              onClick={() => setIsLogin((prev) => !prev)}
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
