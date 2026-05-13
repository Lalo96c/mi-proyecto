import type { LaravelPaginationMeta } from './product';

export type ApiTechnician = {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone?: string;
  status: 'activo' | 'inactivo';
};

export type ApiClient = {
  id: number;
  dni: string;
  first_name: string;
  last_name: string;
};

/** Respuesta DeviceRepairResource */
export type ApiDeviceRepair = {
  id: number;
  repair_code: string;
  client_id: number;
  client?: ApiClient | null;
  technician_id?: number | null;
  technician?: ApiTechnician | null;
  device_description: string;
  fault_description: string;
  status: 'recibido' | 'en_reparacion' | 'reparado' | 'entregado';
  total_amount: string | number;
  receipt_number?: string | null;
  repair_notes?: string | null;
  images?: RepairImage[] | null;
  delivered_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type RepairImage = {
  name: string;
  path: string;
  url: string;
};

export type DeviceRepairPayload = {
  repair_code: string;
  client_id: number;
  technician_id?: number | null;
  device_description: string;
  fault_description: string;
  status: 'recibido' | 'en_reparacion' | 'reparado' | 'entregado';
  total_amount: number;
  receipt_number?: string | null;
  repair_notes?: string | null;
  delivered_at?: string | null;
  images?: RepairImage[];
};

export type DeviceRepairTableRow = {
  id: number;
  codigo: string;
  cliente: string;
  estado: string;
  tecnico: string;
  total: number;
  boleta: string;
  _raw: ApiDeviceRepair;
};

export type PaginatedDeviceRepairsResponse = {
  data: ApiDeviceRepair[];
  meta: LaravelPaginationMeta;
  links: Record<string, unknown>;
};

export function clientDisplayName(c: ApiClient | null | undefined): string {
  if (!c) return '—';
  const name = `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim();
  return name || c.dni || `Cliente #${c.id}`;
}

export function technicianDisplayName(t: ApiTechnician | null | undefined): string {
  if (!t) return '—';
  return t.name || `Técnico #${t.id}`;
}

export function statusLabel(status: ApiDeviceRepair['status']): string {
  const labels: Record<ApiDeviceRepair['status'], string> = {
    recibido: 'Recibido',
    en_reparacion: 'En Reparación',
    reparado: 'Reparado',
    entregado: 'Entregado',
  };
  return labels[status] || status;
}
