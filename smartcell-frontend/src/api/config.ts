// Almacenar la configuración pública
let publicConfig: { public_url: string; api_url: string } | null = null;
let configPromise: Promise<any> | null = null;

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
  // Si ya hay una promesa en progreso, esperarla
  if (configPromise) {
    return configPromise;
  }

  configPromise = (async () => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/config`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.public_url) {
          publicConfig = {
            public_url: data.public_url,
            api_url: data.api_url || data.public_url + '/api',
          };
          console.log('✅ Public config loaded:', publicConfig);
          return publicConfig;
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch public config, using fallback:', error);
    }
    return null;
  })();

  return configPromise;
};

/**
 * Obtiene la URL pública del servidor (sincrónico - usa lo que está disponible)
 * Si no está disponible, fallback a window.location.hostname
 */
export const getPublicUrl = () => {
  if (publicConfig?.public_url) {
    return publicConfig.public_url;
  }
  // Fallback a la IP actual
  return getBackendUrl();
};

/**
 * Espera a que la configuración pública esté lista y luego retorna la URL
 */
export const getPublicUrlAsync = async (): Promise<string> => {
  await fetchPublicConfig();
  return getPublicUrl();
};

export const API_BASE_URL = getApiUrl();
export const BACKEND_URL = getBackendUrl();
