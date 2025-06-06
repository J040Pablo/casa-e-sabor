import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
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
  const [documento, setDocumento] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('CPF');

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

      if (!response.data.init_point) {
        throw new Error("URL de pagamento não recebida");
      }

      // Abre o pagamento em uma nova guia
      window.open(response.data.init_point, '_blank');
      
      // Fecha o modal após abrir a nova guia
      onHide();
    } catch (err) {
      console.error("Erro ao inicializar pagamento:", err);
      setError(err.message);
      toast.error("Erro ao inicializar pagamento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePagamentoPix = async () => {
    if (!documento) {
      toast.error('Por favor, informe seu CPF ou CNPJ');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = tipoDocumento === 'CPF' 
        ? { cpf: documento }
        : { cnpj: documento };

      const response = await api.post(`/pedidos/${pedidoId}/pagamento/pix`, payload);
      setPixData({
        qrCode: response.data.qr_code,
        qrCodeBase64: response.data.qr_code_base64
      });
    } catch (err) {
      setError('Erro ao gerar pagamento PIX');
      toast.error(err.response?.data?.message || 'Erro ao gerar pagamento PIX');
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

        {loading && !pixData && (
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
          <div className="payment-options">
            <div className="mb-4">
              <h5>Escolha a forma de pagamento:</h5>
              <div className="d-flex gap-3">
                <Button 
                  variant="outline-success" 
                  onClick={() => setPixData({ showForm: true })}
                  className="payment-button"
                >
                  <FontAwesomeIcon icon={faQrcode} className="me-2" />
                  PIX
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={initializeMercadoPago}
                  className="payment-button"
                >
                  <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                  Cartão/Boleto
                </Button>
              </div>
            </div>

            {pixData?.showForm && (
              <div className="pix-form">
                <h5>Pagamento via PIX</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Documento</Form.Label>
                  <Form.Select 
                    value={tipoDocumento} 
                    onChange={(e) => setTipoDocumento(e.target.value)}
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{tipoDocumento}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Digite seu ${tipoDocumento}`}
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    maxLength={tipoDocumento === 'CPF' ? 11 : 14}
                  />
                </Form.Group>
                <Button 
                  variant="success" 
                  onClick={handlePagamentoPix} 
                  disabled={loading || !documento}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" /> Gerando PIX...
                    </>
                  ) : (
                    'Gerar PIX'
                  )}
                </Button>
              </div>
            )}

            {pixData?.qrCode && (
              <div className="mt-4">
                <div className="qr-code-container">
                  <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" />
                </div>
                <div className="pix-code">
                  <p>Código PIX:</p>
                  <div className="copy-container">
                    <code>{pixData.qrCode}</code>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(pixData.qrCode);
                        toast.success('Código PIX copiado!');
                      }}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>
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