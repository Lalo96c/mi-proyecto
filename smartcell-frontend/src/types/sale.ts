import type { LaravelPaginationMeta } from './product';

export type ApiClient = {
  id: number;
  dni: string;
  first_name: string;
  last_name: string;
};

export type ApiSaleDetail = {
  id: number;
  product_id: number;
  product?: {
    id: number;
    code: string;
    name: string;
  } | null;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
};

/** Respuesta SaleResource (detail = registros) */
export type ApiSale = {
  id: number;
  sale_code: string;
  sale_date: string;
  client_id: number;
  client?: ApiClient | null;
  total_amount: string | number;
  detail?: ApiSaleDetail[];
  created_at?: string;
  updated_at?: string;
};

export type SaleDetailPayload = {
  product_id: number;
  quantity: number;
  unit_price: number;
};

export type SalePayload = {
  sale_code: string;
  sale_date: string;
  client_id: number;
  details: SaleDetailPayload[];
};

export type SaleTableRow = {
  id: number;
  codigo: string;
  fecha: string;
  cliente: string;
  total: number;
  lineas: number;
  _raw: ApiSale;
};

export type PaginatedSalesResponse = {
  data: ApiSale[];
  meta: LaravelPaginationMeta;
  links: Record<string, unknown>;
};

export function clientDisplayName(c: ApiClient | null | undefined): string {
  if (!c) return '—';
  const name = `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim();
  return name || c.dni || `Cliente #${c.id}`;
}
