import { useEffect, useState, type FormEvent } from 'react';
import { ModalScaffold } from '../../components/ModalScaffold';
import { ProductSearchSelect } from '../../components/ProductSearchSelect';
import type { Purchase } from '../../api/purchasesService';

type PurchaseLineForm = {
  product_id: number;
  quantity: string;
  unit_price: string;
};

type PurchaseFormState = {
  purchase_code: string;
  purchase_date: string;
  supplier_name: string;
  lines: PurchaseLineForm[];
};

type Props = {
  mode: 'create' | 'edit';
  initialPurchase: Purchase | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
  apiErrors: string[];
};

function emptyLine(): PurchaseLineForm {
  return { product_id: 0, quantity: '1', unit_price: '' };
}

function emptyForm(): PurchaseFormState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    purchase_code: '',
    purchase_date: today,
    supplier_name: '',
    lines: [emptyLine()],
  };
}

function formFromPurchase(p: Purchase): PurchaseFormState {
  const lines = (p.detail && p.detail.length > 0)
    ? p.detail.map((d) => ({
      product_id: d.product_id,
      quantity: String(d.quantity),
      unit_price: String(d.unit_price),
    }))
    : [emptyLine()];
  return {
    purchase_code: p.purchase_code,
    purchase_date: p.purchase_date,
    supplier_name: p.supplier_name,
    lines,
  };
}

export function PurchaseFormModal({
  mode,
  initialPurchase,
  open,
  onClose,
  onSubmit,
  submitting,
  apiErrors,
}: Props) {
  const [form, setForm] = useState<PurchaseFormState>(emptyForm());

  // Actualizar formulario cuando cambien initialPurchase o el modo
  useEffect(() => {
    if (mode === 'edit' && initialPurchase) {
      setForm(formFromPurchase(initialPurchase));
    } else if (mode === 'create') {
      setForm(emptyForm());
    }
  }, [initialPurchase, mode]);

  function setLine(i: number, patch: Partial<PurchaseLineForm>) {
    setForm((f) => {
      const lines = f.lines.map((line, j) =>
        j === i ? { ...line, ...patch } : line
      );
      return { ...f, lines };
    });
  }

  function addLine() {
    setForm((f) => ({
      ...f,
      lines: [...f.lines, emptyLine()],
    }));
  }

  function removeLine(index: number) {
    setForm((f) => {
      if (f.lines.length <= 1) return f;
      return {
        ...f,
        lines: f.lines.filter((_, j) => j !== index),
      };
    });
  }

  // 🔥 Calcular total
  const total = form.lines.reduce((acc, l) => {
    const qty = parseInt(l.quantity) || 0;
    const price = parseFloat(l.unit_price) || 0;
    return acc + qty * price;
  }, 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.supplier_name.trim()) {
      alert('Ingresa proveedor');
      return;
    }

    try {
      const details = form.lines
        .filter((l) => l.product_id > 0)
        .map((l) => {
          const qty = Math.max(1, parseInt(l.quantity) || 1);
          const price = parseFloat(l.unit_price);

          if (!price || price <= 0) {
            throw new Error('Precio inválido');
          }

          return {
            product_id: l.product_id,
            quantity: qty,
            unit_price: price,
          };
        });

      if (details.length === 0) {
        alert('Añade al menos un producto');
        return;
      }

      await onSubmit({
        purchase_code: form.purchase_code,
        purchase_date: form.purchase_date,
        supplier_name: form.supplier_name,
        details,
      });

    } catch (err: any) {
      alert(err.message || 'Error en el formulario');
    }
  }

  if (!open) return null;

  return (
    <ModalScaffold onBackdropClick={onClose}>
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border p-6">

        {/* HEADER */}
        <h2 className="text-lg font-semibold mb-4">
          {mode === 'create' ? 'Nueva compra' : 'Editar compra'}
        </h2>

        {apiErrors.length > 0 && (
          <div className="mb-3 text-red-600 text-sm">
            {apiErrors.map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* CABECERA */}
          <div className="grid gap-4 sm:grid-cols-2">

            <input
              placeholder="Código"
              value={form.purchase_code}
              onChange={(e) =>
                setForm((f) => ({ ...f, purchase_code: e.target.value }))
              }
              className="input"
            />

            <input
              type="date"
              value={form.purchase_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, purchase_date: e.target.value }))
              }
              className="input"
            />

            <input
              placeholder="Proveedor"
              value={form.supplier_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, supplier_name: e.target.value }))
              }
              className="input sm:col-span-2"
            />
          </div>

          {/* ITEMS */}
          <div className="mt-6 space-y-3">

            <div className="flex justify-between">
              <p className="text-sm font-medium">Productos</p>
              <button
                type="button"
                onClick={addLine}
                className="text-sm text-indigo-600"
              >
                + Agregar
              </button>
            </div>

            {form.lines.map((line, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">

                <div className="col-span-5">
                  <ProductSearchSelect
                    id={`p-${i}`}
                    label="Producto"
                    value={line.product_id || null}
                    onChange={(product) => {
                      if (!product) return;

                      setLine(i, {
                        product_id: product.id,
                        unit_price: '',
                      });
                    }}
                  />
                </div>

                <input
                  className="col-span-2 input"
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) =>
                    setLine(i, { quantity: e.target.value })
                  }
                />

                <input
                  className="col-span-3 input"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Costo"
                  value={line.unit_price}
                  onChange={(e) =>
                    setLine(i, { unit_price: e.target.value })
                  }
                />

                <button
                  type="button"
                  onClick={() => removeLine(i)}
                  className="col-span-2 text-red-500 text-sm"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="font-medium">Total:</span>
            <span className="font-semibold">
              S/ {total.toFixed(2)}
            </span>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              {submitting ? 'Guardando...' : (mode === 'create' ? 'Crear compra' : 'Actualizar compra')}
            </button>
          </div>

        </form>
      </div>
    </ModalScaffold>
  );
}