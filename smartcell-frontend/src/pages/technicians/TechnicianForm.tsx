import { FormEvent, useState } from 'react';
import { ModalScaffold } from '../../components/ModalScaffold';
import type { TechnicianPayload } from '../../api/techniciansApi';

type FormState = {
  name: string;
  dni: string;
  specialty: string;
  phone: string;
  status: 'activo' | 'inactivo';
};

type ValidationErrors = {
  name?: string;
  dni?: string;
  specialty?: string;
  phone?: string;
};

function validateName(value: string): string | undefined {
  if (!value.trim()) return 'El nombre es requerido';
  if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
  if (/\d/.test(value)) return 'El nombre no puede contener números';
  return undefined;
}

function validateDni(value: string): string | undefined {
  if (!value.trim()) return 'El DNI es requerido';
  if (value.trim().length < 8) return 'El DNI debe tener al menos 8 caracteres';
  return undefined;
}

function validateSpecialty(value: string): string | undefined {
  if (!value.trim()) return 'La especialidad es requerida';
  return undefined;
}

function validatePhone(value: string): string | undefined {
  if (!value.trim()) return undefined;
  if (!/^[0-9\s\-\+\(\)]*$/.test(value)) {
    return 'El teléfono solo puede contener números, espacios, guiones, + o paréntesis';
  }
  return undefined;
}

type TechnicianFormProps = {
  title: string;
  initialValues: TechnicianPayload & { status?: 'activo' | 'inactivo' };
  onSubmit: (values: TechnicianPayload) => Promise<void>;
  onClose: () => void;
};

export default function TechnicianForm({
  title,
  initialValues,
  onSubmit,
  onClose,
}: TechnicianFormProps) {
  const [form, setForm] = useState<FormState>({
    name: initialValues.name || '',
    dni: initialValues.dni || '',
    specialty: initialValues.specialty || '',
    phone: initialValues.phone || '',
    status: initialValues.status || 'activo',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar
    const newErrors: ValidationErrors = {};
    const nameError = validateName(form.name);
    const dniError = validateDni(form.dni);
    const specialtyError = validateSpecialty(form.specialty);
    const phoneError = validatePhone(form.phone);

    if (nameError) newErrors.name = nameError;
    if (dniError) newErrors.dni = dniError;
    if (specialtyError) newErrors.specialty = specialtyError;
    if (phoneError) newErrors.phone = phoneError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      await onSubmit({
        name: form.name.trim(),
        dni: form.dni.trim(),
        specialty: form.specialty.trim(),
        phone: form.phone.trim() || undefined,
        status: form.status,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al guardar técnico';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalScaffold onBackdropClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="technician-form-title"
        className="h-auto w-full max-w-lg shrink-0 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/15"
      >
        <h2 id="technician-form-title" className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        {apiError && (
          <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* NOMBRE */}
          <div>
            <label htmlFor="t-name" className="block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              id="t-name"
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                const error = validateName(e.target.value);
                setErrors((prev) => {
                  const next = { ...prev };
                  if (error) {
                    next.name = error;
                  } else {
                    delete next.name;
                  }
                  return next;
                });
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 ${
                errors.name ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
              }`}
              placeholder="Ej. Juan Pérez"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          {/* DNI */}
          <div>
            <label htmlFor="t-dni" className="block text-sm font-medium text-slate-700">
              DNI
            </label>
            <input
              id="t-dni"
              required
              maxLength={20}
              value={form.dni}
              onChange={(e) => {
                setForm((f) => ({ ...f, dni: e.target.value }));
                const error = validateDni(e.target.value);
                setErrors((prev) => {
                  const next = { ...prev };
                  if (error) {
                    next.dni = error;
                  } else {
                    delete next.dni;
                  }
                  return next;
                });
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 ${
                errors.dni ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
              }`}
              placeholder="Ej. 70654321"
            />
            {errors.dni && <p className="mt-1 text-xs text-rose-600">{errors.dni}</p>}
          </div>

          {/* ESPECIALIDAD */}
          <div>
            <label htmlFor="t-specialty" className="block text-sm font-medium text-slate-700">
              Especialidad
            </label>
            <select
              id="t-specialty"
              required
              value={form.specialty}
              onChange={(e) => {
                setForm((f) => ({ ...f, specialty: e.target.value }));
                const error = validateSpecialty(e.target.value);
                setErrors((prev) => {
                  const next = { ...prev };
                  if (error) {
                    next.specialty = error;
                  } else {
                    delete next.specialty;
                  }
                  return next;
                });
              }}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 ${
                errors.specialty ? 'border-rose-300 bg-rose-50' : 'border-slate-200'
              }`}
            >
              <option value="">Selecciona una especialidad</option>
              <option value="Reparación de celulares">Reparación de celulares</option>
              <option value="Reparación de laptops">Reparación de laptops</option>
              <option value="Reparación de tablets">Reparación de tablets</option>
              <option value="Reparación de computadoras">Reparación de computadoras</option>
              <option value="Mantenimiento general">Mantenimiento general</option>
              <option value="Diagnóstico">Diagnóstico</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.specialty && (
              <p className="mt-1 text-xs text-rose-600">{errors.specialty}</p>
            )}
          </div>

          {/* TELÉFONO */}
          <div>
            <label htmlFor="t-phone" className="block text-sm font-medium text-slate-700">
              Teléfono (opcional)
            </label>
            <input
              id="t-phone"
              type="tel"
              maxLength={32}
              value={form.phone}
              onChange={(e) => {
                setForm((f) => ({ ...f, phone: e.target.value }));
                const error = validatePhone(e.target.value);
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
            {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
          </div>

          {/* ESTADO */}
          <div>
            <label htmlFor="t-status" className="block text-sm font-medium text-slate-700">
              Estado
            </label>
            <select
              id="t-status"
              value={form.status}
              onChange={(e) => {
                setForm((f) => ({ ...f, status: e.target.value as 'activo' | 'inactivo' }));
              }}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* BOTONES */}
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
              disabled={loading || Object.keys(errors).length > 0}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </ModalScaffold>
  );
}
