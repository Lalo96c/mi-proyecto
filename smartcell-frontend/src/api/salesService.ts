import { isAxiosError } from 'axios';
import type { ApiSale, PaginatedSalesResponse, SalePayload } from '../types/sale';
import { httpClient } from './httpClient';

export async function fetchSales(params: {
  page?: number;
  per_page?: number;
} = {}): Promise<PaginatedSalesResponse> {
  const { data } = await httpClient.get<PaginatedSalesResponse>('/sales', {
    params: {
      page: params.page ?? 1,
      per_page: params.per_page ?? 15,
    },
  });
  return data;
}

export async function fetchSale(id: number | string): Promise<ApiSale> {
  const { data } = await httpClient.get<{ data: ApiSale }>(`/sales/${id}`);
  return data.data;
}

export async function createSale(payload: SalePayload): Promise<ApiSale> {
  const { data } = await httpClient.post<{ data: ApiSale }>('/sales', payload);
  return data.data;
}

export async function updateSale(
  id: number | string,
  payload: Partial<SalePayload>,
): Promise<ApiSale> {
  const { data } = await httpClient.put<{ data: ApiSale }>(`/sales/${id}`, payload);
  return data.data;
}

export async function deleteSale(id: number | string): Promise<void> {
  await httpClient.delete(`/sales/${id}`);
}

export function collectApiErrorMessages(error: unknown): string[] {
  if (isAxiosError(error)) {
    const res = error.response?.data as
      | { errors?: Record<string, string | string[]>; message?: string }
      | undefined;
    if (res?.errors && typeof res.errors === 'object') {
      return Object.entries(res.errors).flatMap(([field, messages]) => {
        const arr = Array.isArray(messages) ? messages : [messages];
        return arr.map((m) => `${field}: ${m}`);
      });
    }
    if (typeof res?.message === 'string') {
      return [res.message];
    }
  }
  if (error instanceof Error) {
    return [error.message];
  }
  return ['Error al contactar con el servidor'];
}
