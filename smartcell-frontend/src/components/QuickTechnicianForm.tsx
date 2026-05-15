import { useState, type FormEvent } from 'react';
import { ModalScaffold } from './ModalScaffold';
import type { ApiTechnician } from '../types/deviceRepair';
import { createTechnician, collectApiErrorMessages } from '../api/techniciansService';

const SPECIALTIES = [
  'Reparación de celulares',
  'Reparación de laptops',
  'Reparación de tablets',
  'Reparación de computadoras',
  'Mantenimiento general',
  'Diagnóstico',
  'Otros',
] as const;

type FormState = {
  name: string;
  specialty: string;
  dni: string;
  phone: string;
};

type ValidationErrors = {
  name?: string;
  specialty?: string;
  dni?: string;
  phone?: string;
};

function emptyForm(): FormState {
  return {
    name: '',
    specialty: '',
    dni: '',
    phone: '',
  };
}

function validateName(value: string): string | undefined {
  if (!value.trim()) return 'El nombre es requerido';
  if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
  if (/\d/.test(value)) {
    return 'El nombre no puede contener números';
  }
  return undefined;
}

function validateSpecialty(value: string): string | undefined {
  if (!value.trim()) return 'La especialidad es requerida';
  if (value.trim().length < 2) return 'La especialidad debe tener al menos 2 caracteres';
  return undefined;
}

function validateDni(value: string): string | undefined {
  if (!value.trim()) return 'El DNI es requerido';
  if (value.trim().length < 8) {
    return 'El DNI debe tener al menos 8 caracteres';
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

type QuickTechnicianFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onTechnicianCreated: (technician: ApiTechnician) => void;
};

export function QuickTechnicianForm({
  isOpen,
  onClose,
  onTechnicianCreated,
}: QuickTechnicianFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      name: validateName(form.name),
      specialty: validateSpecialty(form.specialty),
      dni: validateDni(form.dni),
      phone: validatePhone(form.phone),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const technician = await createTechnician({
        name: form.name.trim(),
        specialty: form.specialty.trim(),
        dni: form.dni.trim(),
        phone: form.phone.trim() || undefined,
      });

      onTechnicianCreated(technician);
      setForm(emptyForm());
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating technician:', error);
      setSubmitError(collectApiErrorMessages(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setForm(emptyForm());
      setErrors({});
      setSubmitError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalScaffold onBackdropClick={handleClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-technician-form-title"
        className="h-auto w-full max-w-lg shrink-0 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/15"
      >
        <div className="mb-6">
          <h2 id="quick-technician-form-title" className="text-lg font-semibold text-slate-900">
            Crear nuevo técnico
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Nombre *
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={isSubmitting}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
              placeholder="Ej: Juan Pérez"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-slate-700">
              Especialidad *
            </label>
            <select
              id="specialty"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              disabled={isSubmitting}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
            >
              <option value="">Selecciona una especialidad</option>
              {SPECIALTIES.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            {errors.specialty && (
              <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>
            )}
          </div>

          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-slate-700">
              DNI *
            </label>
            <input
              id="dni"
              type="text"
              value={form.dni}
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
              disabled={isSubmitting}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
              placeholder="Ej: 70654321"
            />
            {errors.dni && (
              <p className="mt-1 text-sm text-red-600">{errors.dni}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={isSubmitting}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
              placeholder="Ej: +51 999 999 999"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creando...' : 'Crear técnico'}
            </button>
          </div>
        </form>
      </div>
    </ModalScaffold>
  );
}