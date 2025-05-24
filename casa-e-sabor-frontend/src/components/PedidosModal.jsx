// components/PedidosModal.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/PedidosModal.css";
import PagamentoModal from "./PagamentoModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function PedidosModal({ show, onClose }) {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [pagamentoModalVisible, setPagamentoModalVisible] = useState(false);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://casa-e-sabor.onrender.com";

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      console.log(">> [PedidosModal] Usuário atual:", usuario);
      console.log(">> [PedidosModal] Token:", token);

      const res = await fetch(`${API_URL}/api/pedidos`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erro ${res.status}`);
      }

      const data = await res.json();
      console.log(">> [PedidosModal] Pedidos recebidos:", data);
      setPedidos(data);
    } catch (err) {
      console.error(">> [PedidosModal] Erro:", err);
      setError(err.message || "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }, [API_URL, usuario]);

  useEffect(() => {
    if (!show) return;
    if (!usuario?.email) {
      setError("Usuário não autenticado.");
      return;
    }

    fetchPedidos();
  }, [show, usuario, fetchPedidos]);

  const handlePagamento = (pedido) => {
    setPedidoSelecionado(pedido);
    setPagamentoModalVisible(true);
  };

  const handleFecharPagamento = () => {
    setPagamentoModalVisible(false);
    setPedidoSelecionado(null);
  };

  const handlePedidoAtualizado = () => {
    // Recarrega os pedidos após o pagamento
    fetchPedidos();
  };

  const handleExcluirPedido = async (pedidoId) => {
    if (!window.confirm("Tem certeza que deseja excluir este pedido?")) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const res = await fetch(`${API_URL}/api/pedidos/${pedidoId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erro ${res.status}`);
      }

      toast.success("Pedido excluído com sucesso!");
      fetchPedidos(); // Recarrega a lista de pedidos
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
      toast.error(err.message || "Erro ao excluir pedido");
    } finally {
      setLoading(false);
    }
  };

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
                <div className="pedido-actions">
                  {pedido.status === "aguardando pagamento" && (
                    <button
                      className="pagar-button"
                      onClick={() => handlePagamento(pedido)}
                    >
                      Realizar Pagamento
                    </button>
                  )}
                  {pedido.status === "aguardando pagamento" && (
                    <button
                      className="excluir-button"
                      onClick={() => handleExcluirPedido(pedido._id)}
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Excluir
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {pedidoSelecionado && (
        <PagamentoModal
          visible={pagamentoModalVisible}
          pedido={pedidoSelecionado}
          onClose={handleFecharPagamento}
          onPedidoAtualizado={handlePedidoAtualizado}
          backendURL={API_URL}
        />
      )}
    </div>
  );
}
