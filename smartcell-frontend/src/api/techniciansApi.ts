import { httpClient } from './httpClient';
import type { LaravelPaginationMeta } from '../types/product';

export type TechnicianPayload = {
  name: string;
  dni: string;
  specialty: string;
  phone?: string;
  status?: 'activo' | 'inactivo';
};

export type ApiTechnician = {
  id: number;
  name: string;
  dni: string;
  specialty: string;
  phone?: string;
  status: 'activo' | 'inactivo';
};

export type PaginatedTechniciansResponse = {
  data: ApiTechnician[];
  meta: LaravelPaginationMeta;
  links: Record<string, unknown>;
};

export async function fetchTechnicians(params: {
  page?: number;
  per_page?: number;
  search?: string;
  name?: string;
  dni?: string;
  specialty?: string;
  status?: 'activo' | 'inactivo';
} = {}): Promise<PaginatedTechniciansResponse> {
  const { data } = await httpClient.get<PaginatedTechniciansResponse>('/technicians', {
    params: {
      page: params.page ?? 1,
      per_page: params.per_page ?? 15,
      search: params.search || undefined,
      name: params.name || undefined,
      dni: params.dni || undefined,
      specialty: params.specialty || undefined,
      status: params.status || undefined,
    },
  });

  return data;
}

export async function createTechnician(payload: TechnicianPayload) {
  const { data } = await httpClient.post<ApiTechnician>('/technicians', payload);
  return data;
}

export async function updateTechnician(id: number, payload: TechnicianPayload) {
  const { data } = await httpClient.put<ApiTechnician>(`/technicians/${id}`, payload);
  return data;
}

export async function deleteTechnician(id: number) {
  await httpClient.delete(`/technicians/${id}`);
}
