// Almacenar la configuración pública
let publicConfig: { public_url: string; api_url: string } | null = null;

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

/**
 * Obtiene la URL pública desde el servidor
 * Esto asegura que los QR siempre usen la IP correcta, no localhost
 */
export const fetchPublicConfig = async () => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/config`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.public_url) {
        publicConfig = {
          public_url: data.public_url,
          api_url: data.api_url || data.public_url + '/api',
        };
        return publicConfig;
      }
    }
  } catch (error) {
    console.debug('Error fetching public config:', error);
  }
  return null;
};

/**
 * Obtiene la URL pública del servidor
 * Si no está disponible, fallback a window.location.hostname
 */
export const getPublicUrl = () => {
  if (publicConfig?.public_url) {
    return publicConfig.public_url;
  }
  return getBackendUrl();
};

export const API_BASE_URL = getApiUrl();
export const BACKEND_URL = getBackendUrl();
