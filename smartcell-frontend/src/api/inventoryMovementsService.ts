import { isAxiosError } from 'axios';
import type {
  ApiInventoryMovement,
  PaginatedInventoryMovementsResponse,
  InventoryMovementPayload,
} from '../types/inventoryMovement';
import { httpClient } from './httpClient';

export async function fetchInventoryMovements(params: {
  page?: number;
  per_page?: number;
  type?: string;
  reason?: string;
  product_id?: number;
  date_from?: string;
  date_to?: string;
} = {}): Promise<PaginatedInventoryMovementsResponse> {
  const { data } = await httpClient.get<PaginatedInventoryMovementsResponse>('/inventory-movements', {
    params: {
      page: params.page ?? 1,
      per_page: params.per_page ?? 15,
      type: params.type || undefined,
      reason: params.reason || undefined,
      product_id: params.product_id || undefined,
      date_from: params.date_from || undefined,
      date_to: params.date_to || undefined,
    },
  });
  return data;
}

export async function fetchInventoryMovement(id: number | string): Promise<ApiInventoryMovement> {
  const { data } = await httpClient.get<{ data: ApiInventoryMovement }>(`/inventory-movements/${id}`);
  return data.data;
}

export async function createInventoryMovement(
  payload: InventoryMovementPayload,
): Promise<ApiInventoryMovement> {
  const { data } = await httpClient.post<{ data: ApiInventoryMovement }>(
    '/inventory-movements',
    payload,
  );
  return data.data;
}

export async function updateInventoryMovement(
  id: number | string,
  payload: Partial<InventoryMovementPayload>,
): Promise<ApiInventoryMovement> {
  const { data } = await httpClient.put<{ data: ApiInventoryMovement }>(
    `/inventory-movements/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteInventoryMovement(id: number | string): Promise<void> {
  await httpClient.delete(`/inventory-movements/${id}`);
}

export function collectApiErrorMessages(error: unknown): string[] {
  if (!isAxiosError(error)) {
    return ['Error desconocido'];
  }

  const response = error.response;
  if (!response) {
    return [error.message];
  }

  const data = response.data;
  if (typeof data === 'string') {
    return [data];
  }

  if (data?.message) {
    return [data.message];
  }

  if (data?.errors && typeof data.errors === 'object') {
    const messages: string[] = [];
    Object.values(data.errors).forEach((fieldErrors) => {
      if (Array.isArray(fieldErrors)) {
        messages.push(...fieldErrors);
      } else if (typeof fieldErrors === 'string') {
        messages.push(fieldErrors);
      }
    });
    return messages;
  }

  return ['Error en la solicitud'];
}