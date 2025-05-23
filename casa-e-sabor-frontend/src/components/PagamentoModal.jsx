import React, { useState, useCallback } from 'react';
import '../styles/PagamentoModal.css';
import { toast } from 'react-toastify';
import api from '../services/api';
import MercadoPagoLogo from '../assets/mercado-pago-logo.png';

export default function PagamentoModal({ visible, pedido, onClose, onPedidoAtualizado }) {
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handlePagamentoDinheiro = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await api.patch(`/pedidos/${pedido._id}/status`, {
        status: "finalizado",
        metodoPagamento: "dinheiro"
      });

      if (response.status === 200) {
        toast.success("Pedido finalizado com sucesso!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onClose();
        if (typeof onPedidoAtualizado === 'function') {
          onPedidoAtualizado();
        }
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      toast.error(error.response?.data?.message || "Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [pedido._id, loading, onClose, onPedidoAtualizado]);

  const handlePagamentoMercadoPago = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await api.post(`/pedidos/${pedido._id}/pagamento/mercado-pago`);

      if (response.status === 200 && response.data.init_point) {
        window.location.href = response.data.init_point;
      } else {
        throw new Error('URL de pagamento não recebida');
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error(error.response?.data?.message || "Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [pedido._id, loading]);

  const handleClose = useCallback((e) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  }, [onClose]);

  return (
    <div className="pagamento-overlay" onClick={handleClose}>
      <div className="pagamento-modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>Escolha a forma de pagamento</h3>
          <button className="close" onClick={handleClose}>×</button>
        </header>
        <div className="content">
          <div className="total-info">
            <p>Total a pagar:</p>
            <strong>R$ {pedido.total.toFixed(2)}</strong>
          </div>
          <div className="opcoes-pagamento">
            <button 
              className="opcao-pagamento"
              onClick={handlePagamentoDinheiro}
              disabled={loading}
            >
              <i className="fas fa-money-bill-wave"></i>
              <span>Dinheiro</span>
              <small>Pagamento na entrega</small>
            </button>
            <button 
              className="opcao-pagamento"
              onClick={handlePagamentoMercadoPago}
              disabled={loading}
            >
              <img src={MercadoPagoLogo} alt="Mercado Pago" />
              <span>Mercado Pago</span>
              <small>Pagamento online</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 