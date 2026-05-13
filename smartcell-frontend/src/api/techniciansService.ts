import type { ApiTechnician } from '../types/deviceRepair';
import { httpClient } from './httpClient';

export type TechniciansResponse = {
  data: ApiTechnician[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: Record<string, unknown>;
};

export async function fetchTechnicians(params: {
  page?: number;
  per_page?: number;
  status?: string;
} = {}): Promise<TechniciansResponse> {
  const { data } = await httpClient.get<TechniciansResponse>('/technicians', {
    params: {
      page: params.page ?? 1,
      per_page: params.per_page ?? 100,
      status: params.status || undefined,
    },
  });
  return data;
}

export async function fetchAllActiveTechnicians(): Promise<ApiTechnician[]> {
  const response = await fetchTechnicians({ per_page: 100, status: 'activo' });
  return response.data;
}
