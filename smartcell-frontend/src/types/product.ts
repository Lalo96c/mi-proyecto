/** Respuesta del API (ProductResource) */
export type ApiProduct = {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  sale_price: string | number;
  status: ProductStatus;
  created_at?: string;
  updated_at?: string;
};

export const PRODUCT_STATUS = {
  CON_STOCK: 'CON_STOCK',
  SIN_STOCK: 'SIN_STOCK',
  STOCK_BAJO: 'STOCK_BAJO',
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  [PRODUCT_STATUS.CON_STOCK]: 'Con stock',
  [PRODUCT_STATUS.SIN_STOCK]: 'Sin stock',
  [PRODUCT_STATUS.STOCK_BAJO]: 'Stock bajo',
};

export function statusFromQuantity(quantity: number): ProductStatus {
  if (quantity <= 0) return PRODUCT_STATUS.SIN_STOCK;
  if (quantity < 10) return PRODUCT_STATUS.STOCK_BAJO;
  return PRODUCT_STATUS.CON_STOCK;
}

/** Fila normalizada para la tabla de productos */
export type ProductTableRow = {
  id: number;
  sku: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
  estado: ProductStatus;
  _raw: ApiProduct;
};

export type ProductPayload = {
  code: string;
  name: string;
  category: string;
  quantity: number;
  sale_price: number;
  status: ProductStatus;
};

export type LaravelPaginationMeta = {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
};

export type PaginatedProductsResponse = {
  data: ApiProduct[];
  meta: LaravelPaginationMeta;
  links: Record<string, unknown>;
};
