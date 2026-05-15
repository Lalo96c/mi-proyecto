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

export type TechnicianPayload = {
  name: string;
  dni: string;
  specialty: string;
  phone?: string;
};

export async function createTechnician(payload: TechnicianPayload): Promise<ApiTechnician> {
  const { data } = await httpClient.post<ApiTechnician>('/technicians', payload);
  return data;
}

export function collectApiErrorMessages(error: unknown): string {
  if (typeof error === 'string') return error;

  // Handle Laravel validation errors
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as any).response;
    if (response?.data?.errors) {
      const errors = response.data.errors;
      const messages: string[] = [];

      for (const field in errors) {
        if (Array.isArray(errors[field])) {
          messages.push(...errors[field]);
        }
      }

      return messages.join('. ');
    }

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return 'Ha ocurrido un error inesperado';
}
