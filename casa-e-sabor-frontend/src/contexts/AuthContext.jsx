// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { parseJwt } from "../utils/jwt";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const dados = parseJwt(token);
      if (dados) {
        setUsuario(dados); // exemplo: { nome, email, ... }
      }
    }
  }, []);

  const login = (token) => {
    const dados = parseJwt(token);
    if (dados) {
      setUsuario(dados);
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
