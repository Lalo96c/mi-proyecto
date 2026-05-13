// Almacenar la configuración pública
let publicConfig: { public_url: string; api_url: string } | null = null;
let configPromise: Promise<any> | null = null;

const isLocalhost = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1';
};

const getApiUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:8000/api`;
};

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:8000`;
};

/**
 * Obtiene la URL pública desde el servidor
 * Solo intenta fetchear si no estamos en localhost
 */
export const fetchPublicConfig = async () => {
  // Si ya hay una promesa en progreso, esperarla
  if (configPromise) {
    return configPromise;
  }

  configPromise = (async () => {
    // Si estamos en localhost, no intentar fetchear la config
    if (isLocalhost()) {
      console.log('💻 Running on localhost - using localhost:8000 directly');
      publicConfig = {
        public_url: 'http://localhost:8000',
        api_url: 'http://localhost:8000/api',
      };
      return publicConfig;
    }

    // Estamos en una IP, intentar fetchear la config del servidor
    try {
      const apiUrl = getApiUrl();
      const configUrl = `${apiUrl}/config`;
      
      console.log('📡 Fetching public config from:', configUrl);
      
      const response = await fetch(configUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Public config response:', data);
        
        if (data.success && data.public_url) {
          publicConfig = {
            public_url: data.public_url,
            api_url: data.api_url || data.public_url + '/api',
          };
          console.log('✅ Public config loaded:', publicConfig.public_url);
          return publicConfig;
        }
      } else {
        console.warn(`⚠️ Config endpoint returned ${response.status}:`, await response.text());
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch public config:', error);
    }
    
    // Fallback a la IP/hostname actual
    const fallbackUrl = getBackendUrl();
    console.log('⚠️ Using fallback URL:', fallbackUrl);
    publicConfig = {
      public_url: fallbackUrl,
      api_url: fallbackUrl + '/api',
    };
    return publicConfig;
  })();

  return configPromise;
};

/**
 * Obtiene la URL pública del servidor (sincrónico - usa lo que está disponible)
 */
export const getPublicUrl = () => {
  if (publicConfig?.public_url) {
    return publicConfig.public_url;
  }
  // Fallback a la IP/hostname actual
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
