// Lo que viene del backend
export type ApiClient = {
  id: number;
  dni: string;
  first_name: string;
  last_name: string;
  created_at?: string;
  updated_at?: string;
};

// Para tabla
export type ClientTableRow = {
  id: number;
  dni: string;
  nombre: string;
  _raw: ApiClient;
};

// Para crear/editar
export type ClientPayload = {
  dni: string;
  first_name: string;
  last_name: string;
};

// Paginación estilo Laravel
export type LaravelPaginationMeta = {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
};

export type PaginatedClientsResponse = {
  data: ApiClient[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
};