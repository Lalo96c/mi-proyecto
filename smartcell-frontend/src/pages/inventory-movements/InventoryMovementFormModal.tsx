import { useState } from 'react';
import { ModalScaffold } from '../../components/ModalScaffold';
import type {
  ApiInventoryMovement,
  InventoryMovementPayload,
  InventoryMovementType,
  InventoryMovementReason,
} from '../../types/inventoryMovement';
import { ProductSearchSelect } from '../../components/ProductSearchSelect';

type FormData = {
  product_id: string;
  type: InventoryMovementType | '';
  quantity: string;
  reason: InventoryMovementReason | '';
};

function emptyFormData(): FormData {
  return {
    product_id: '',
    type: '',
    quantity: '',
    reason: '',
  };
}

function formDataFromMovement(m: ApiInventoryMovement): FormData {
  return {
    product_id: m.product_id.toString(),
    type: m.type,
    quantity: m.quantity.toString(),
    reason: m.reason,
  };
}

type InventoryMovementFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  movement: ApiInventoryMovement | null;
  onSubmit: (payload: InventoryMovementPayload) => void;
  submitting: boolean;
  apiErrors: string[];
};

type InventoryMovementFormModalBodyProps = Omit<InventoryMovementFormModalProps, 'open'>;

function InventoryMovementFormModalBody({
  onClose,
  mode,
  movement,
  onSubmit,
  submitting,
  apiErrors,
}: InventoryMovementFormModalBodyProps) {
  const [formData, setFormData] = useState<FormData>(() => {
    if (mode === 'edit' && movement) {
      return formDataFromMovement(movement);
    }
    return emptyFormData();
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: InventoryMovementPayload = {
      product_id: Number(formData.product_id),
      type: formData.type as InventoryMovementType,
      quantity: Number(formData.quantity),
      reason: formData.reason as InventoryMovementReason,
    };

    onSubmit(payload);
  }

  function updateField(field: keyof FormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const motivosEntrada = [
    { value: 'compra', label: 'Compra' },
    { value: 'stock_inicial', label: 'Stock inicial' },
    { value: 'ajuste_positivo', label: 'Ajuste (+)' },
  ];

  const motivosSalida = [
    { value: 'venta', label: 'Venta' },
    { value: 'uso_tecnico', label: 'Uso técnico' },
    { value: 'ajuste_negativo', label: 'Ajuste (-)' },
  ];
  const motivos =
    formData.type === 'entrada'
      ? motivosEntrada
      : formData.type === 'salida'
        ? motivosSalida
        : [];
  return (
    <ModalScaffold onBackdropClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-gray-900">
          {mode === 'create' ? 'Nuevo movimiento' : 'Editar movimiento'}
        </h2>

        {apiErrors.length > 0 ? (
          <ul className="mt-3 list-inside list-disc rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {apiErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

          {/* Producto */}
          <div>
            <ProductSearchSelect
              id="product_id"
              label="Producto"
              value={Number(formData.product_id) || null}

              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  product_id: e?.id.toString() ?? '',
                  reason: '', // 🔥 limpia motivo
                }))
              }
            />

          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3"
            >
              <option value="">Seleccionar tipo...</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => updateField('quantity', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3"
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Motivo
            </label>
            <select
              value={formData.reason}
              onChange={(e) => updateField('reason', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3"
            >
              {motivos.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {submitting ? 'Procesando...' : mode === 'create' ? 'Crear' : 'Actualizar'}
            </button>
          </div>

        </form>
      </div>
    </ModalScaffold>
  );
}

export function InventoryMovementFormModal({
  open,
  onClose,
  mode,
  movement,
  onSubmit,
  submitting,
  apiErrors,
}: InventoryMovementFormModalProps) {
  if (!open) return null;

  const instanceKey =
    mode === 'edit' && movement ? `edit-${movement.id}` : 'create';

  return (
    <InventoryMovementFormModalBody
      key={instanceKey}
      onClose={onClose}
      mode={mode}
      movement={movement}
      onSubmit={onSubmit}
      submitting={submitting}
      apiErrors={apiErrors}
    />
  );
}