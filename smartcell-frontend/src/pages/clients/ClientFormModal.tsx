import { useState, type FormEvent } from 'react';
import { ModalScaffold } from '../../components/ModalScaffold';
import type { ApiClient, ClientPayload } from '../../types/client';
import { queryReniecByDni, type ReniecResponse } from '../../api/reniecService';

type FormState = {
  dni: string;
  first_name: string;
  last_name: string;
  phone: string;
};

type ValidationErrors = {
  first_name?: string;
  last_name?: string;
  phone?: string;
};

function emptyForm(): FormState {
  return {
    dni: '',
    first_name: '',
    last_name: '',
    phone: '',
  };
}

function formStateFromClient(c: ApiClient): FormState {
  return {
    dni: String(c.dni ?? ''),
    first_name: String(c.first_name ?? ''),
    phone: String(c.phone ?? ''),
    last_name: String(c.last_name ?? ''),
  };
}

// Validadores locales
function validateFirstName(value: string): string | undefined {
  if (!value.trim()) return undefined;
  if (/\d/.test(value)) {
    return 'El nombre no puede contener números';
  }
  return undefined;
}

function validateLastName(value: string): string | undefined {
  if (!value.trim()) return undefined;
  if (/\d/.test(value)) {
    return 'Los apellidos no pueden contener números';
  }
  return undefined;
}

function validatePhone(value: string): string | undefined {
  if (!value.trim()) return undefined;
  if (!/^[0-9\s\-\+\(\)]*$/.test(value)) {
    return 'El teléfono solo puede contener números, espacios, guiones, + o paréntesis';
  }
  return undefined;
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

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [searchingDni, setSearchingDni] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  async function handleSearchDni() {
    if (!form.dni.trim()) {
      setSearchError('Ingrese un DNI para buscar');
      return;
    }

    setSearchingDni(true);
    setSearchError(null);

    try {
      const result = await queryReniecByDni(form.dni.trim());

      setForm((f) => ({
        ...f,
        first_name: result.first_name || '',
        last_name: `${result.first_last_name || ''} ${result.second_last_name || ''}`.trim(),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al consultar DNI';
      setSearchError(message);
    } finally {
      setSearchingDni(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Validar antes de enviar
    const newErrors: ValidationErrors = {};
    const firstNameError = validateFirstName(form.first_name);
    const lastNameError = validateLastName(form.last_name);
    const phoneError = validatePhone(form.phone);

    if (firstNameError) newErrors.first_name = firstNameError;
    if (lastNameError) newErrors.last_name = lastNameError;
    if (phoneError) newErrors.phone = phoneError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: ClientPayload = {
      dni: form.dni.trim(),
      first_name: form.first_name.trim(),
      phone: form.phone.trim(),
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

        {searchError ? (
          <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {searchError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* DNI */}
          <div>
            <label htmlFor="c-dni" className="block text-sm font-medium text-slate-700">
              DNI / Identificación
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="c-dni"
                required
                maxLength={20}
                value={form.dni}
                onChange={(e) => setForm((f) => ({ ...f, dni: e.target.value }))}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
                placeholder="Ej. 70654321"
              />
              <button
                type="button"
                onClick={handleSearchDni}
                disabled={searchingDni || !form.dni.trim()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {searchingDni ? 'Buscando…' : 'Buscar'}
              </button>
            </div>
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
              onChange={(e) => {
                setForm((f) => ({ ...f, first_name: e.target.value }));
                const error = validateFirstName(e.target.value);
                setErrors((prev) => {
                  const next = { ...prev };
                  if (error) {
                    next.first_name = error;
                  } else {
                    delete next.first_name;
                  }
                  return next;
                });
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 ${errors.first_name ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
                }`}
            />
            {errors.first_name && (
              <p className="mt-1 text-xs text-rose-600">{errors.first_name}</p>
            )}
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
              onChange={(e) => {
                setForm((f) => ({ ...f, last_name: e.target.value }));
                const error = validateLastName(e.target.value);
                setErrors((prev) => {
                  const next = { ...prev };
                  if (error) {
                    next.last_name = error;
                  } else {
                    delete next.last_name;
                  }
                  return next;
                });
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 ${errors.last_name ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
                }`}
            />
            {errors.last_name && (
              <p className="mt-1 text-xs text-rose-600">{errors.last_name}</p>
            )}
          </div>

          {/* TELÉFONO */}
            <label htmlFor="c-phone" className="block text-sm font-medium text-slate-700">
              Teléfono
            </label>
            <input
              id="c-phone"
              type="tel"
              maxLength={32}
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value;

                setForm((f) => ({ ...f, phone: value }));

                const error = validatePhone(value);

                setErrors((prev) => {
                  const next = { ...prev };
                  if (error) {
                    next.phone = error;
                  } else {
                    delete next.phone;
                  }
                  return next;
                });
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 ${errors.phone ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
                }`}
              placeholder="Ej. 987654321"
            />

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
                disabled={submitting || Object.keys(errors).length > 0}
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