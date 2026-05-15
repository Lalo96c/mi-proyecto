import { ModalScaffold } from '../../components/ModalScaffold';
import { formatCurrency } from '../../utils/format';
import type { ApiSale } from '../../types/sale';
import { clientDisplayName } from '../../types/sale';
import { getPublicUrl } from '../../api/config';

type SaleDetailModalProps = {
  open: boolean;
  sale: ApiSale | null;
  onClose: () => void;
};

function parseNum(v: string | number): number {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isNaN(n) ? 0 : n;
}

export function SaleDetailModal({ open, sale, onClose }: SaleDetailModalProps) {
  if (!open || !sale) return null;

  const total = typeof sale.total_amount === 'string'
    ? parseFloat(sale.total_amount)
    : sale.total_amount;

  const lines = sale.detail ?? [];

  const handleOpenReceipt = () => {
    try {
      const publicUrl = getPublicUrl();
      const receiptUrl = `${publicUrl}/sale-receipt/${sale?.id}`;
      window.open(receiptUrl, '_blank');
    } catch (error) {
      console.error('Error al abrir boleta:', error);
      alert('Error: Configuración no disponible');
    }
  };

  return (
    <ModalScaffold onBackdropClick={onClose} zIndexClass="z-[60]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-detail-title"
        className="flex h-auto w-full max-w-2xl shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xl"
      >
        <div className="shrink-0 border-b border-slate-200 px-6 py-4">
          <h2 id="sale-detail-title" className="text-lg font-semibold text-slate-900">
            Venta {sale.sale_code}
          </h2>
          <div className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <span className="font-medium text-slate-700">Fecha: </span>
              {sale.sale_date}
            </p>
            <p>
              <span className="font-medium text-slate-700">Cliente: </span>
              {clientDisplayName(sale.client ?? undefined)}
            </p>
            <p className="sm:col-span-2">
              <span className="font-medium text-slate-700">Total: </span>
              <span className="tabular-nums text-slate-900">{formatCurrency(total)}</span>
            </p>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="mb-2 text-sm font-medium text-slate-800">Registros</p>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 font-semibold text-slate-700">Producto</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Cant.</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">P. unit.</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lines.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                      Sin registros
                    </td>
                  </tr>
                ) : (
                  lines.map((line) => (
                    <tr key={line.id}>
                      <td className="px-3 py-2 text-slate-800">
                        <span className="font-mono text-xs text-slate-500">
                          {line.product?.code ?? `#${line.product_id}`}
                        </span>{' '}
                        {line.product?.name ?? '—'}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-800">
                        {line.quantity}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-800">
                        {formatCurrency(parseNum(line.unit_price))}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium text-slate-900">
                        {formatCurrency(parseNum(line.line_total))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 px-6 py-3">
          <button
            type="button"
            onClick={handleOpenReceipt}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 mr-2"
          >
            Ver Boleta
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </ModalScaffold>
  );
}
