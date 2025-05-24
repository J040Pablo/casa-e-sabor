import axios from 'axios';

// Define a URL base baseada no ambiente
const baseURL = window.location.hostname === "localhost"
  ? "http://localhost:5000/api"
  : "https://casa-e-sabor.onrender.com/api";

console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log da requisição
  console.log('Requisição:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });
  
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => {
    // Log da resposta
    console.log('Resposta:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Log detalhado do erro
    console.error('Erro na requisição:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.config?.headers
    });

    // Tratamento específico para erro PXB01
    if (error.response?.data?.error?.includes('PXB01')) {
      console.error('Erro PXB01 detectado:', {
        details: error.response.data,
        requestData: error.config?.data
      });
    }
    
    return Promise.reject(error);
  }
);

export default api; 