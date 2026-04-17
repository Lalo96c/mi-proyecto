import { isAxiosError } from 'axios';
import type { ApiClient, ClientPayload } from '../types/client';
import { httpClient } from './httpClient';

export async function fetchClients(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}) {
  const { data } = await httpClient.get('/clients', { params });
  return data;
}

export async function fetchClient(id: number | string): Promise<ApiClient> {
  const { data } = await httpClient.get<{ data: ApiClient }>(`/clients/${id}`);
  return data.data;
}

export async function createClient(payload: ClientPayload) {
  const { data } = await httpClient.post('/clients', payload);
  return data;
}

export async function updateClient(id: number, payload: ClientPayload) {
  const { data } = await httpClient.put(`/clients/${id}`, payload);
  return data;
}

export async function deleteClient(id: number) {
  const { data } = await httpClient.delete(`/clients/${id}`);
  return data;
}

export function collectApiErrorMessages(error: unknown): string[] {
  if (isAxiosError(error)) {
    const res = error.response?.data as
      | { errors?: Record<string, string | string[]>; message?: string }
      | undefined;

    if (res?.errors) {
      return Object.entries(res.errors).flatMap(([field, messages]) => {
        const arr = Array.isArray(messages) ? messages : [messages];
        return arr.map((m) => `${field}: ${m}`);
      });
    }

    if (res?.message) return [res.message];
  }

  if (error instanceof Error) return [error.message];

  return ['Error al contactar con el servidor'];
}