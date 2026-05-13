import { useState, type FormEvent } from 'react';
import { ModalScaffold } from './ModalScaffold';
import type { ApiClient, ClientPayload } from '../types/client';
import { queryReniecByDni } from '../api/reniecService';
import { createClient, collectApiErrorMessages } from '../api/clientsService';

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

type QuickClientFormProps = {
  open: boolean;
  onClose: () => void;
  onClientCreated: (client: ApiClient) => void;
};

export function QuickClientForm({ open, onClose, onClientCreated }: QuickClientFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [searchingDni, setSearchingDni] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);

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

    setSubmitting(true);
    setApiErrors([]);

    try {
      const payload: ClientPayload = {
        dni: form.dni.trim(),
        first_name: form.first_name.trim(),
        phone: form.phone.trim(),
        last_name: form.last_name.trim(),
      };

      const response = await createClient(payload);
      
      // Callback con el cliente creado
      if (response.data) {
        onClientCreated(response.data);
      } else if (response.id) {
        onClientCreated(response as ApiClient);
      }

      // Limpiar y cerrar
      setForm(emptyForm());
      setErrors({});
      onClose();
    } catch (error) {
      setApiErrors(collectApiErrorMessages(error));
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <ModalScaffold onBackdropClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-client-form-title"
        className="h-auto w-full max-w-lg shrink-0 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/15"
      >
        <h2 id="quick-client-form-title" className="text-lg font-semibold text-slate-900">
          Crear nuevo cliente
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
            <label htmlFor="q-dni" className="block text-sm font-medium text-slate-700">
              DNI / Identificación
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="q-dni"
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
            <label htmlFor="q-first-name" className="block text-sm font-medium text-slate-700">
              Nombres *
            </label>
            <input
              id="q-first-name"
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
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 ${
                errors.first_name ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
              }`}
              placeholder="Ej. Juan"
            />
            {errors.first_name && (
              <p className="mt-1 text-xs text-rose-600">{errors.first_name}</p>
            )}
          </div>

          {/* APELLIDOS */}
          <div>
            <label htmlFor="q-last-name" className="block text-sm font-medium text-slate-700">
              Apellidos *
            </label>
            <input
              id="q-last-name"
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
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 ${
                errors.last_name ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
              }`}
              placeholder="Ej. Pérez García"
            />
            {errors.last_name && (
              <p className="mt-1 text-xs text-rose-600">{errors.last_name}</p>
            )}
          </div>

          {/* TELÉFONO */}
          <div>
            <label htmlFor="q-phone" className="block text-sm font-medium text-slate-700">
              Teléfono
            </label>
            <input
              id="q-phone"
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
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 ${
                errors.phone ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
              }`}
              placeholder="Ej. 987654321"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
            )}
          </div>

          {/* BOTONES ACCIÓN */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || Object.keys(errors).length > 0}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {submitting ? 'Creando…' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </ModalScaffold>
  );
}
