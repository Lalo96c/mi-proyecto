import { isAxiosError } from 'axios';
import type { ApiDeviceRepair, PaginatedDeviceRepairsResponse, DeviceRepairPayload } from '../types/deviceRepair';
import { httpClient } from './httpClient';

export async function fetchDeviceRepairs(params: {
  page?: number;
  per_page?: number;
  repair_code?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  client_id?: number | null;
  technician_id?: number | null;
} = {}): Promise<PaginatedDeviceRepairsResponse> {
  const { data } = await httpClient.get<PaginatedDeviceRepairsResponse>('/device-repairs', {
    params: {
      page: params.page ?? 1,
      per_page: params.per_page ?? 15,
      repair_code: params.repair_code || undefined,
      status: params.status || undefined,
      date_from: params.date_from || undefined,
      date_to: params.date_to || undefined,
      client_id: params.client_id || undefined,
      technician_id: params.technician_id || undefined,
    },
  });
  return data;
}

export async function fetchDeviceRepair(id: number | string): Promise<ApiDeviceRepair> {
  const { data } = await httpClient.get<{ data: ApiDeviceRepair }>(`/device-repairs/${id}`);
  return data.data;
}

export async function createDeviceRepair(payload: DeviceRepairPayload): Promise<ApiDeviceRepair> {
  const { data } = await httpClient.post<{ data: ApiDeviceRepair }>('/device-repairs', payload);
  return data.data;
}

export async function updateDeviceRepair(
  id: number | string,
  payload: Partial<DeviceRepairPayload>,
): Promise<ApiDeviceRepair> {
  const { data } = await httpClient.put<{ data: ApiDeviceRepair }>(`/device-repairs/${id}`, payload);
  return data.data;
}

export async function deleteDeviceRepair(id: number | string): Promise<void> {
  await httpClient.delete(`/device-repairs/${id}`);
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
