import { ModalScaffold } from '../../components/ModalScaffold';
import { formatCurrency } from '../../utils/format';
import type { Purchase } from '../../api/purchasesService';

type PurchaseDetailModalProps = {
  open: boolean;
  purchase: Purchase | null;
  onClose: () => void;
};

function parseNum(v: string | number): number {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isNaN(n) ? 0 : n;
}

export function PurchaseDetailModal({ open, purchase, onClose }: PurchaseDetailModalProps) {
  if (!open || !purchase) return null;

  const total = parseNum(purchase.total_amount);
  const lines = purchase.detail ?? [];

  return (
    <ModalScaffold onBackdropClick={onClose} zIndexClass="z-[60]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-detail-title"
        className="flex h-auto w-full max-w-2xl shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xl"
      >
        <div className="shrink-0 border-b border-slate-200 px-6 py-4">
          <h2 id="purchase-detail-title" className="text-lg font-semibold text-slate-900">
            Compra {purchase.purchase_code}
          </h2>
          <div className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <span className="font-medium text-slate-700">Fecha: </span>
              {purchase.purchase_date}
            </p>
            <p>
              <span className="font-medium text-slate-700">Proveedor: </span>
              {purchase.supplier_name}
            </p>
            <p className="sm:col-span-2">
              <span className="font-medium text-slate-700">Total: </span>
              <span className="tabular-nums text-slate-900">{formatCurrency(total)}</span>
            </p>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="mb-2 text-sm font-medium text-slate-800">Productos</p>
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
