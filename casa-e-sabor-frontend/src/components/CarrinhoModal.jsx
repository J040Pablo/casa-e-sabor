import React from "react";
import "../styles/CarrinhoModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function CarrinhoModal({
  visible,
  carrinho = [],
  setCarrinho,
  onFechar,
  onFinalizar,
}) {
  if (!visible) return null;

  const removerItem = (index) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
  };

  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);

  return (
    <div className={`carrinho-modal ${visible ? "visible" : ""}`}>
      <div className="carrinho-conteudo">
        <h2>Seu Pedido</h2>
        <button className="fechar" onClick={onFechar}>
          Fechar
        </button>

        {carrinho.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <ul className="lista-carrinho">
            {carrinho.map((item, index) => (
              <li key={index} className="item-carrinho">
                <span>
                  {item.nome} - R$ {item.preco.toFixed(2)}
                </span>
                <button
                  className="remover-item"
                  onClick={() => removerItem(index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="total">
          <strong>Total: R$ {total.toFixed(2)}</strong>
        </div>

        {carrinho.length > 0 && (
          <button className="finalizar" onClick={onFinalizar}>
            Finalizar Pedido
          </button>
        )}
      </div>
    </div>
  );
}
