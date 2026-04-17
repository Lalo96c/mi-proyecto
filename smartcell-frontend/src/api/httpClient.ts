import axios, { isAxiosError } from 'axios';
import { API_BASE_URL } from './config';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from './tokenStorage';

const AUTH_SKIP_REFRESH = ['/auth/login', '/auth/register'];

function shouldSkipRefresh(url: string | undefined): boolean {
  const path = url?.replace(API_BASE_URL, '') || '';
  return AUTH_SKIP_REFRESH.some((p) => path.includes(p));
}

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const NO_BEARER_PATHS = ['/auth/login', '/auth/register'];

function needsNoBearer(url: string | undefined): boolean {
  const path = url?.replace(API_BASE_URL, '') || url || '';
  return NO_BEARER_PATHS.some((p) => path.includes(p));
}

httpClient.interceptors.request.use((config) => {
  if (needsNoBearer(config.url)) {
    delete config.headers.Authorization;
    return config;
  }
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing = false;
let queue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(error: unknown, token: string | null = null): void {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  queue = [];
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const original = error.config;
    const status = error.response?.status;

    if (!original) {
      return Promise.reject(error);
    }

    if (status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (shouldSkipRefresh(original.url)) {
      return Promise.reject(error);
    }

    if (original.url?.includes('/auth/refresh')) {
      clearAccessToken();
      return Promise.reject(error);
    }

    if (refreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(original);
      });
    }

    const token = getAccessToken();
    if (!token) {
      return Promise.reject(error);
    }

    original._retry = true;
    refreshing = true;

    try {
      const { data } = await axios.post<{ access_token: string }>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAccessToken(data.access_token);
      flushQueue(null, data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return httpClient(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      clearAccessToken();
      return Promise.reject(refreshError);
    } finally {
      refreshing = false;
    }
  },
);
