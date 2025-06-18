import axios from 'axios';

// Variable para almacenar el token en memoria
let authToken = null;  // ← Añadido esta línea

// Crear una instancia de axios con configuración común
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para añadir el token a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores comunes aquí (401, 403, etc.)
    if (error.response && error.response.status === 401) {
      console.error('Sesión expirada o no autorizada');
    }
    return Promise.reject(error);
  }
);

// Función para establecer el token desde fuera
const setAuthToken = (token) => {
  authToken = token;
};

export { apiClient, setAuthToken };
export default apiClient;