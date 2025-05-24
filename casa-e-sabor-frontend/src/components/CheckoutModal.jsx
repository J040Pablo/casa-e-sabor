import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faQrcode,
  faMoneyBill,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/CheckoutModal.css";

// Adicione o script do Mercado Pago
const script = document.createElement("script");
script.src = "https://sdk.mercadopago.com/js/v2";
script.async = true;
document.body.appendChild(script);

const API_URL = import.meta.env.VITE_API_URL;

const CheckoutModal = ({ show, onHide, pedidoId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);

  useEffect(() => {
    if (show && pedidoId) {
      checkAdBlocker();
      initializeMercadoPago();
    }
  }, [show, pedidoId]);

  const checkAdBlocker = () => {
    const testScript = document.createElement('script');
    testScript.src = 'https://static.hotjar.com/c/hotjar-585655.js';
    testScript.async = true;
    testScript.onerror = () => setAdBlockerDetected(true);
    document.body.appendChild(testScript);
  };

  const initializeMercadoPago = async () => {
    try {
      setLoading(true);
      setError(null);

      // Inicializa o Mercado Pago
      await initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);

      // Busca os dados do pagamento do backend
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await fetch(`${API_URL}/api/pedidos/${pedidoId}/pagar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao processar pagamento");
      }

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      if (!data.preferenceId) {
        throw new Error("ID de preferência não recebido");
      }

      setPreferenceId(data.preferenceId);
    } catch (err) {
      console.error("Erro ao inicializar pagamento:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAdBlockerWarning = () => (
    <Alert variant="warning" className="mb-3">
      <Alert.Heading>
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        Bloqueador de Anúncios Detectado
      </Alert.Heading>
      <p>
        Detectamos que você está usando um bloqueador de anúncios que pode interferir com o pagamento.
        Para garantir o funcionamento correto do Mercado Pago, por favor:
      </p>
      <ol>
        <li>Desative temporariamente o bloqueador de anúncios</li>
        <li>Permita cookies de terceiros</li>
        <li>Atualize a página</li>
      </ol>
      <p className="mb-0">
        Se o problema persistir, você pode tentar usar outro navegador ou o aplicativo do Mercado Pago.
      </p>
    </Alert>
  );

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Pagamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {adBlockerDetected && renderAdBlockerWarning()}

        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
            <p className="mt-2">Inicializando pagamento...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger">
            <Alert.Heading>Erro ao processar pagamento</Alert.Heading>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              Se você estiver usando um bloqueador de anúncios, por favor desative-o temporariamente para esta página.
            </p>
          </Alert>
        )}

        {!loading && !error && preferenceId && (
          <div>
            <p>Clique no botão abaixo para prosseguir com o pagamento:</p>
            <Wallet
              initialization={{ preferenceId }}
              customization={{ 
                theme: {
                  elementsColor: "#4CAF50",
                  headerColor: "#4CAF50"
                }
              }}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutModal; 