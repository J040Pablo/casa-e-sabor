import axios from 'axios';

// Define a URL base baseada no ambiente
const baseURL = window.location.hostname === "localhost"
  ? "http://localhost:5000/api"
  : "https://casa-e-sabor.onrender.com/api";

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
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
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

export default api; 