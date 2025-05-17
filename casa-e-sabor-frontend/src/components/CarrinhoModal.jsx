import React, { useState } from "react";
import "../styles/CarrinhoModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function CarrinhoModal({
  visible,
  carrinho = [],
  setCarrinho,
  onFechar,
  usuario,
  backendURL,
}) {
  const [loading, setLoading] = useState(false); // Estado para controlar loading

  if (!visible) return null;

  const removerItem = (index) => {
    setCarrinho((prev) => prev.filter((_, i) => i !== index));
  };

  const total = carrinho.reduce((sum, item) => sum + Number(item.preco), 0);

  const finalizarPedido = async () => {
    if (!usuario) {
      toast.error("Usuário não autenticado.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token de autenticação não encontrado.");
      return;
    }

    setLoading(true); // Inicia o loading
    const payload = {
      itens: carrinho.map((item) => ({
        nome: item.nome,
        preco: Number(item.preco),
        quantidade: 1,
      })),
    };

    try {
      const res = await fetch(`${backendURL}/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: "Erro ao processar resposta do servidor" };
      }

      if (res.ok) {
        toast.success("Pedido finalizado com sucesso!");
        setCarrinho([]);
        onFechar();
      } else {
        toast.error(data?.message || `Erro ${res.status}`);
      }
    } catch {
      toast.error("Erro ao finalizar o pedido.");
    } finally {
      setLoading(false); // Termina o loading
    }
  };

  return (
    <aside className={`carrinho-modal ${visible ? "visible" : ""}`}>
      <div
        className="carrinho-conteudo"
        role="dialog"
        aria-modal="true"
        aria-labelledby="carrinho-title"
      >
        <header className="carrinho-header">
          <h2 id="carrinho-title">Seu Pedido</h2>
          <button
            className="fechar"
            onClick={onFechar}
            aria-label="Fechar carrinho"
            disabled={loading} // Desabilita fechar enquanto carrega para evitar bugs
          >
            ×
          </button>
        </header>

        <section className="carrinho-body">
          {carrinho.length === 0 ? (
            <p className="carrinho-vazio">Seu carrinho está vazio.</p>
          ) : (
            <ul className="lista-carrinho">
              {carrinho.map((item, index) => (
                <li key={index} className="item-carrinho">
                  <div className="item-info">
                    <span className="item-nome">{item.nome}</span>
                    <span className="item-preco">
                      R$ {item.preco.toFixed(2)}
                    </span>
                  </div>
                  <button
                    className="remover-item"
                    onClick={() => removerItem(index)}
                    aria-label={`Remover ${item.nome}`}
                    disabled={loading} // Desabilita remoção enquanto carrega
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="carrinho-footer">
          <div className="total">
            <span>Total:</span> <strong>R$ {total.toFixed(2)}</strong>
          </div>
          {carrinho.length > 0 && (
            <button
              className="finalizar"
              onClick={finalizarPedido}
              disabled={loading} // Desabilita botão durante o pedido
              style={{
                backgroundColor: loading ? "#999" : "", // Cor cinza quando desabilitado
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Seu pedido está sendo realizado..."
                : "Finalizar Pedido"}
            </button>
          )}
        </footer>
      </div>
    </aside>
  );
}
