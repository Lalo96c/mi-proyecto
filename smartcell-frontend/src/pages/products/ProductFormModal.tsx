import { useState, type FormEvent } from 'react';
import { ModalScaffold } from '../../components/ModalScaffold';
import type { ApiProduct, ProductPayload, ProductStatus } from '../../types/product';
import {
  PRODUCT_STATUS,
  PRODUCT_STATUS_LABELS,
  statusFromQuantity,
} from '../../types/product';

type FormState = {
  code: string;
  name: string;
  category: string;
  quantity: number;
  sale_price: string;
  status: ProductStatus;
};

function emptyForm(): FormState {
  return {
    code: '',
    name: '',
    category: '',
    quantity: 0,
    sale_price: '',
    status: PRODUCT_STATUS.CON_STOCK,
  };
}

function formStateFromProduct(p: ApiProduct): FormState {
  const sp = p.sale_price;
  return {
    code: String(p.code ?? ''),
    name: String(p.name ?? ''),
    category: String(p.category ?? ''),
    quantity: Number(p.quantity ?? 0),
    sale_price: sp === '' || sp == null ? '' : String(sp),
    status: p.status ?? PRODUCT_STATUS.CON_STOCK,
  };
}

type ProductFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  initialProduct: ApiProduct | null;
  onClose: () => void;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  submitting: boolean;
  apiErrors: string[];
};

type ProductFormModalBodyProps = Omit<ProductFormModalProps, 'open'>;

function ProductFormModalBody({
  mode,
  initialProduct,
  onClose,
  onSubmit,
  submitting,
  apiErrors,
}: ProductFormModalBodyProps) {
  const [form, setForm] = useState<FormState>(() => {
    if (mode === 'edit' && initialProduct) {
      return formStateFromProduct(initialProduct);
    }
    return emptyForm();
  });

  function handleQuantityChange(value: string) {
    const q = Number.parseInt(value, 10);
    const quantity = Number.isNaN(q) ? 0 : Math.max(0, q);
    setForm((f) => ({
      ...f,
      quantity,
      status: statusFromQuantity(quantity),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const sale = Number.parseFloat(String(form.sale_price).replace(',', '.'));
    const payload: ProductPayload = {
      code: form.code.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      quantity: form.quantity,
      sale_price: Number.isNaN(sale) ? 0 : sale,
      status: form.status,
    };
    await onSubmit(payload);
  }

  return (
    <ModalScaffold onBackdropClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="h-auto w-full max-w-lg shrink-0 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/15"
      >
        <h2 id="product-form-title" className="text-lg font-semibold text-slate-900">
          {mode === 'create' ? 'Nuevo producto' : 'Editar producto'}
        </h2>

        {apiErrors.length > 0 ? (
          <ul className="mt-3 list-inside list-disc rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {apiErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="p-code" className="block text-sm font-medium text-slate-700">
              Código
            </label>
            <input
              id="p-code"
              required
              maxLength={100}
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
              disabled={mode === 'edit'}
              title={mode === 'edit' ? 'El código no se puede cambiar' : undefined}
            />
          </div>
          <div>
            <label htmlFor="p-name" className="block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              id="p-name"
              required
              maxLength={255}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="p-category" className="block text-sm font-medium text-slate-700">
              Categoría
            </label>
            <input
              id="p-category"
              required
              maxLength={255}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="p-qty" className="block text-sm font-medium text-slate-700">
                Cantidad
              </label>
              <input
                id="p-qty"
                type="number"
                min={0}
                required
                value={form.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
              />
            </div>
            <div>
              <label htmlFor="p-price" className="block text-sm font-medium text-slate-700">
                Precio venta
              </label>
              <input
                id="p-price"
                type="number"
                min={0}
                step="0.01"
                required
                value={form.sale_price}
                onChange={(e) => setForm((f) => ({ ...f, sale_price: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
              />
            </div>
          </div>
          <div>
            <label htmlFor="p-status" className="block text-sm font-medium text-slate-700">
              Estado
            </label>
            <select
              id="p-status"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as ProductStatus }))
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
            >
              {(Object.entries(PRODUCT_STATUS_LABELS) as [ProductStatus, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {submitting ? 'Guardando…' : mode === 'create' ? 'Crear' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </ModalScaffold>
  );
}

export function ProductFormModal({
  open,
  mode,
  initialProduct,
  onClose,
  onSubmit,
  submitting,
  apiErrors,
}: ProductFormModalProps) {
  if (!open) return null;

  const instanceKey =
    mode === 'edit' && initialProduct ? `edit-${initialProduct.id}` : 'create';

  return (
    <ProductFormModalBody
      key={instanceKey}
      mode={mode}
      initialProduct={initialProduct}
      onClose={onClose}
      onSubmit={onSubmit}
      submitting={submitting}
      apiErrors={apiErrors}
    />
  );
}
