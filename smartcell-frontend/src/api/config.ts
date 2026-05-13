const getApiUrl = () => {
  // Detecta automáticamente el hostname (IP o dominio) donde está accediendo
  const hostname = window.location.hostname;
  return `http://${hostname}:8000/api`;
};

const getBackendUrl = () => {
  // Detecta automáticamente el hostname (IP o dominio) donde está accediendo
  const hostname = window.location.hostname;
  return `http://${hostname}:8000`;
};

export const API_BASE_URL = getApiUrl();
export const BACKEND_URL = getBackendUrl();
