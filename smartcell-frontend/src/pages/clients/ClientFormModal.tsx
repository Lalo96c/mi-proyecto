import { useState, type FormEvent } from 'react';
import { ModalScaffold } from '../../components/ModalScaffold';
import type { ApiClient, ClientPayload } from '../../types/client';

type FormState = {
  dni: string;
  first_name: string;
  last_name: string;
};

function emptyForm(): FormState {
  return {
    dni: '',
    first_name: '',
    last_name: '',
  };
}

function formStateFromClient(c: ApiClient): FormState {
  return {
    dni: String(c.dni ?? ''),
    first_name: String(c.first_name ?? ''),
    last_name: String(c.last_name ?? ''),
  };
}

type ClientFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  initialClient: ApiClient | null;
  onClose: () => void;
  onSubmit: (payload: ClientPayload) => Promise<void>;
  submitting: boolean;
  apiErrors: string[];
};

type ClientFormModalBodyProps = Omit<ClientFormModalProps, 'open'>;

function ClientFormModalBody({
  mode,
  initialClient,
  onClose,
  onSubmit,
  submitting,
  apiErrors,
}: ClientFormModalBodyProps) {
  const [form, setForm] = useState<FormState>(() => {
    if (mode === 'edit' && initialClient) {
      return formStateFromClient(initialClient);
    }
    return emptyForm();
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload: ClientPayload = {
      dni: form.dni.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
    };
    await onSubmit(payload);
  }

  return (
    <ModalScaffold onBackdropClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-form-title"
        className="h-auto w-full max-w-lg shrink-0 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/15"
      >
        <h2 id="client-form-title" className="text-lg font-semibold text-slate-900">
          {mode === 'create' ? 'Nuevo cliente' : 'Editar cliente'}
        </h2>

        {apiErrors.length > 0 ? (
          <ul className="mt-3 list-inside list-disc rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {apiErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* DNI */}
          <div>
            <label htmlFor="c-dni" className="block text-sm font-medium text-slate-700">
              DNI / Identificación
            </label>
            <input
              id="c-dni"
              required
              maxLength={20}
              value={form.dni}
              onChange={(e) => setForm((f) => ({ ...f, dni: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
              placeholder="Ej. 70654321"
            />
          </div>

          {/* NOMBRES */}
          <div>
            <label htmlFor="c-first-name" className="block text-sm font-medium text-slate-700">
              Nombres
            </label>
            <input
              id="c-first-name"
              required
              maxLength={100}
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
            />
          </div>

          {/* APELLIDOS */}
          <div>
            <label htmlFor="c-last-name" className="block text-sm font-medium text-slate-700">
              Apellidos
            </label>
            <input
              id="c-last-name"
              required
              maxLength={100}
              value={form.last_name}
              onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
            />
          </div>

          {/* BOTONES ACCIÓN */}
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

export function ClientFormModal({
  open,
  mode,
  initialClient,
  onClose,
  onSubmit,
  submitting,
  apiErrors,
}: ClientFormModalProps) {
  if (!open) return null;

  // Key única para resetear el estado interno del Body al cambiar de cliente
  const instanceKey =
    mode === 'edit' && initialClient ? `edit-${initialClient.id}` : 'create';

  return (
    <ClientFormModalBody
      key={instanceKey}
      mode={mode}
      initialClient={initialClient}
      onClose={onClose}
      onSubmit={onSubmit}
      submitting={submitting}
      apiErrors={apiErrors}
    />
  );
}