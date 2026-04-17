export type ProductoMock = {
  id: string;
  sku: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  unidad: string;
  precio: number;
  costo: number;
};

export const MOCK_PRODUCTS: ProductoMock[] = [
  {
    id: '1',
    sku: 'PRD-1001',
    nombre: 'Notebook 15" 16GB',
    categoria: 'Electrónica',
    cantidad: 8,
    unidad: 'un',
    precio: 899.99,
    costo: 650.0,
  },
  {
    id: '2',
    sku: 'PRD-2044',
    nombre: 'Mouse inalámbrico',
    categoria: 'Periféricos',
    cantidad: 142,
    unidad: 'un',
    precio: 24.5,
    costo: 11.2,
  },
];
