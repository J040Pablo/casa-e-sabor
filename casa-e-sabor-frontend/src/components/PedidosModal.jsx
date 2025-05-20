// components/PedidosModal.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/PedidosModal.css";

export default function PedidosModal({ show, onClose }) {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://casa-e-sabor.onrender.com";

  useEffect(() => {
    if (!show) return;
    if (!usuario?.email) {
      setError("Usuário não autenticado.");
      return;
    }

    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/pedidos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();

        // Filtra pedidos pelo e‑mail do cliente
        const meusPedidos = data.filter(
          (p) => p.cliente?.email === usuario.email
        );
        setPedidos(meusPedidos);
      } catch (err) {
        setError(err.message || "Erro ao carregar pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [show, usuario]);

  if (!show) return null;

  return (
    <div className="pedidos-overlay" onClick={onClose}>
      <div className="pedidos-modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>Seus Pedidos</h3>
          <button className="close" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="content">
          {loading && <p>Carregando pedidos...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && pedidos.length === 0 && (
            <p>Você ainda não tem pedidos.</p>
          )}
          <ul className="pedidos-list">
            {pedidos.map((pedido) => (
              <li key={pedido._id} className="pedido-item">
                <div className="pedido-header">
                  <strong>Pedido #{pedido._id}</strong>
                  <span className="status">{pedido.status}</span>
                </div>
                <p className="data">
                  {new Date(pedido.dataCriacao).toLocaleString()}
                </p>
                <ul className="itens-list">
                  {pedido.itens.map((item) => (
                    <li key={item._id} className="item">
                      {item.quantidade}× {item.nome} — R${" "}
                      {item.preco.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <div className="total">Total: R$ {pedido.total.toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
