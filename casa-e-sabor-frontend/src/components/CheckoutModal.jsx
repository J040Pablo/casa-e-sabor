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
import api from '../services/api';

// Adicione o script do Mercado Pago
const script = document.createElement("script");
script.src = "https://sdk.mercadopago.com/js/v2";
script.async = true;
document.body.appendChild(script);

const CheckoutModal = ({ show, onHide, pedidoId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);
  const [pixData, setPixData] = useState(null);

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
      const response = await api.post(`/pedidos/${pedidoId}/pagamento/mercado-pago`);

      if (!response.data.preferenceId) {
        throw new Error("ID de preferência não recebido");
      }

      setPreferenceId(response.data.preferenceId);
      
      // Se houver dados do PIX, salva
      if (response.data.pix_qr_code) {
        setPixData({
          qrCode: response.data.pix_qr_code,
          qrCodeBase64: response.data.pix_qr_code_base64
        });
      }
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

  const renderPixPayment = () => (
    <div className="pix-payment">
      <h4>Pagamento via PIX</h4>
      <p>Escaneie o QR Code abaixo ou copie o código PIX:</p>
      {pixData?.qrCodeBase64 && (
        <div className="qr-code-container">
          <img 
            src={`data:image/png;base64,${pixData.qrCodeBase64}`} 
            alt="QR Code PIX" 
            className="qr-code"
          />
        </div>
      )}
      {pixData?.qrCode && (
        <div className="pix-code">
          <p>Código PIX:</p>
          <div className="copy-container">
            <code>{pixData.qrCode}</code>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(pixData.qrCode);
                toast.success("Código PIX copiado!");
              }}
            >
              Copiar
            </Button>
          </div>
        </div>
      )}
    </div>
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

        {!loading && !error && (
          <div>
            {pixData ? (
              renderPixPayment()
            ) : (
              <>
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
              </>
            )}
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