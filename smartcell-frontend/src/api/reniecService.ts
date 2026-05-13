import { httpClient } from './httpClient';

export interface ReniecResponse {
  first_name: string;
  first_last_name: string;
  second_last_name: string;
  full_name: string;
  document_number: string;
}

export async function queryReniecByDni(dni: string): Promise<ReniecResponse> {
  const response = await httpClient.get<ReniecResponse>(
    `/clients/query-by-dni?dni=${encodeURIComponent(dni)}`
  );
  return response.data;
}
