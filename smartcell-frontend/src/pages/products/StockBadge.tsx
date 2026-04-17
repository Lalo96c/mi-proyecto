import { PRODUCT_STATUS, type ProductStatus } from '../../types/product';

const KNOWN: ProductStatus[] = [
  PRODUCT_STATUS.SIN_STOCK,
  PRODUCT_STATUS.STOCK_BAJO,
  PRODUCT_STATUS.CON_STOCK,
];

type StockBadgeProps = {
  cantidad: number;
  status?: ProductStatus;
};

export function StockBadge({ cantidad, status }: StockBadgeProps) {
  const effective: ProductStatus =
    status && KNOWN.includes(status)
      ? status
      : cantidad === 0
        ? PRODUCT_STATUS.SIN_STOCK
        : cantidad < 10
          ? PRODUCT_STATUS.STOCK_BAJO
          : PRODUCT_STATUS.CON_STOCK;

  if (effective === PRODUCT_STATUS.SIN_STOCK) {
    return (
      <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800 ring-1 ring-rose-200/60">
        Sin stock
      </span>
    );
  }
  if (effective === PRODUCT_STATUS.STOCK_BAJO) {
    return (
      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-200/60">
        Stock bajo
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200/60">
      Con stock
    </span>
  );
}
