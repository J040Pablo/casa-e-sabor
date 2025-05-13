// src/components/PedidoForm.js
import React, { useState } from "react";
import axios from "axios";

const PedidoForm = () => {
  const [cliente, setCliente] = useState("");
  const [itens, setItens] = useState([{ nome: "", preco: 0, quantidade: 1 }]);
  const [status, setStatus] = useState("");

  const handleChangeItem = (index, e) => {
    const newItens = [...itens];
    newItens[index][e.target.name] = e.target.value;
    setItens(newItens);
  };

  const handleAddItem = () => {
    setItens([...itens, { nome: "", preco: 0, quantidade: 1 }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/pedidos", { cliente, itens })
      .then((response) => {
        setStatus("Pedido criado com sucesso!");
      })
      .catch((error) => {
        setStatus("Erro ao criar pedido.");
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Criar Pedido</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cliente:</label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Itens:</label>
          {itens.map((item, index) => (
            <div key={index}>
              <input
                type="text"
                name="nome"
                value={item.nome}
                onChange={(e) => handleChangeItem(index, e)}
                placeholder="Nome do Item"
                required
              />
              <input
                type="number"
                name="preco"
                value={item.preco}
                onChange={(e) => handleChangeItem(index, e)}
                placeholder="Preço"
                required
              />
              <input
                type="number"
                name="quantidade"
                value={item.quantidade}
                onChange={(e) => handleChangeItem(index, e)}
                placeholder="Quantidade"
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>
            Adicionar Item
          </button>
        </div>
        <button type="submit">Criar Pedido</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default PedidoForm;
