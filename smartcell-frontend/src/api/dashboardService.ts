import { httpClient } from './httpClient';

export interface DashboardStats {
  general: {
    total_products: number;
    total_clients: number;
    total_sales: number;
    current_month_sales: number;
    last_month_sales: number;
    sales_growth: number;
    total_purchases: number;
    current_month_purchases: number;
    last_month_purchases: number;
    purchases_growth: number;
  };
  inventory: {
    low_stock: number;
    out_of_stock: number;
    by_status: Record<string, number>;
  };
  charts: {
    sales_by_month: Array<{
      month: string;
      total: number;
      count: number;
    }>;
    purchases_by_month: Array<{
      month: string;
      total: number;
      count: number;
    }>;
    top_products: Array<{
      name: string;
      code: string;
      quantity: number;
      revenue: number;
    }>;
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await httpClient.get<DashboardStats>('/dashboard/stats');
  return data;
}