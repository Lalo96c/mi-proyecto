import { useState, type FormEvent, useEffect, useRef } from 'react';
import { ClientSearchSelect } from '../../components/ClientSearchSelect';
import { QuickClientForm } from '../../components/QuickClientForm';
import { ModalScaffold } from '../../components/ModalScaffold';
import type { ApiDeviceRepair, DeviceRepairPayload, ApiTechnician, RepairImage } from '../../types/deviceRepair';
import type { ApiClient } from '../../types/client';
import { techniciansService, imageRepairService } from '../../api';
import { getPublicUrlAsync } from '../../api/config';
import { v4 as uuidv4 } from 'uuid';
import QRCodeStyling from 'qr-code-styling';

const FAULT_OPTIONS = [
  'Cambio de pantalla',
  'Zócalo de carga',
  'Parlante',
  'Audio',
  'Micrófono',
  'Glass',
  'Batería',
  'Tapa',
  'Base de carga',
  'Cámara',
  'Huella',
  'Mica de cámara',
  'Pulsadores encendido o volumen',
  'Conector de audífono',
  'Otros',
] as const;

type FormState = {
  repair_code: string;
  client_id: number;
  technician_id: number | null;
  device_description: string;
  fault_option: string;
  fault_description: string;
  status: 'recibido' | 'en_reparacion' | 'reparado' | 'entregado';
  total_amount: string;
  receipt_number: string;
  repair_notes: string;
};

function emptyForm(): FormState {
  return {
    repair_code: '',
    client_id: 0,
    technician_id: null,
    device_description: '',
    fault_option: '',
    fault_description: '',
    status: 'recibido',
    total_amount: '',
    receipt_number: '',
    repair_notes: '',
  };
}

function formFromRepair(r: ApiDeviceRepair): FormState {
  // Detect if the stored fault_description matches a preset option
  const matchedOption = FAULT_OPTIONS.find(
    (opt) => opt !== 'Otros' && r.fault_description.startsWith(opt)
  );
  const faultOption = matchedOption ?? (r.fault_description ? 'Otros' : '');
  const faultDescription = matchedOption ? '' : r.fault_description;

  return {
    repair_code: r.repair_code,
    client_id: r.client_id,
    technician_id: r.technician_id ?? null,
    device_description: r.device_description,
    fault_option: faultOption,
    fault_description: faultDescription,
    status: r.status,
    total_amount: String(r.total_amount),
    receipt_number: r.receipt_number ?? '',
    repair_notes: r.repair_notes ?? '',
  };
}

type DeviceRepairFormModalProps = {
  mode: 'create' | 'edit';
  initialRepair: ApiDeviceRepair | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: DeviceRepairPayload) => Promise<void>;
  submitting: boolean;
  apiErrors: string[];
};

export function DeviceRepairFormModal({
  mode,
  initialRepair,
  open,
  onClose,
  onSubmit,
  submitting,
  apiErrors,
}: DeviceRepairFormModalProps) {
  const [form, setForm] = useState<FormState>(() => {
    if (mode === 'edit' && initialRepair) {
      return formFromRepair(initialRepair);
    }
    return emptyForm();
  });

  const [technicians, setTechnicians] = useState<ApiTechnician[]>([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  
  // Mostrar/ocultar formulario rápido de cliente
  const [showQuickClientForm, setShowQuickClientForm] = useState(false);
  
  // UUID para el repair_id en modo create
  const [repairUUID, setRepairUUID] = useState<string>('');
  
  // Imágenes obtenidas de la API
  const [images, setImages] = useState<RepairImage[]>([]);
  
  // Estados para editar imágenes
  const [editImages, setEditImages] = useState<RepairImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Polling interval
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref para el QR
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Actualizar formulario cuando cambien initialRepair o el modo
  useEffect(() => {
    if (mode === 'edit' && initialRepair) {
      setForm(formFromRepair(initialRepair));
      
      // Cargar imágenes de la reparación
      if (initialRepair.images && initialRepair.images.length > 0) {
        setEditImages(initialRepair.images);
      } else {
        setEditImages([]);
      }
    } else if (mode === 'create') {
      setForm(emptyForm());
      setEditImages([]);
    }
  }, [initialRepair, mode]);

  useEffect(() => {
    if (open && mode === 'edit') {
      setLoadingTechnicians(true);
      techniciansService
        .fetchAllActiveTechnicians()
        .then(setTechnicians)
        .finally(() => setLoadingTechnicians(false));
    }
  }, [open, mode]);

  // Generar UUID cuando se abre el modal en modo "create"
  useEffect(() => {
    if (open && mode === 'create') {
      const uuid = uuidv4();
      setRepairUUID(uuid);
    }
  }, [open, mode]);

  // Polling a la API para obtener imágenes cada segundo
  useEffect(() => {
    if (!open || mode === 'edit' || !repairUUID) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      return;
    }

    const fetchImages = async () => {
      try {
        const backendUrl = getPublicUrl();
        const response = await fetch(`${backendUrl}/api/images-repair/${repairUUID}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.images)) {
            setImages(data.images);
          }
        }
      } catch (error) {
        // Silencioso - solo logging
        console.debug('Polling imágenes:', error);
      }
    };

    // Ejecutar inmediatamente
    fetchImages();

    // Polling cada segundo
    pollingIntervalRef.current = setInterval(fetchImages, 1000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [open, mode, repairUUID]);

  // Generar QR cuando repairUUID cambie
  useEffect(() => {
    if (!qrRef.current || !repairUUID || mode !== 'create') return;

    // Limpiar contenido anterior
    qrRef.current.innerHTML = '';

    const generateQR = async () => {
      try {
        const publicUrl = await getPublicUrlAsync();
        const qrCode = new QRCodeStyling({
          width: 160,
          height: 160,
          data: `${publicUrl}/images-repair-form/${repairUUID}`,
          margin: 10,
          type: 'svg',
          dotsOptions: {
            color: '#667eea',
            type: 'square',
          },
          backgroundOptions: {
            color: '#ffffff',
          },
        });

        qrCode.append(qrRef.current);
      } catch (error) {
        console.error('Error al generar QR:', error);
      }
    };

    generateQR();
  }, [repairUUID, mode]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.client_id) {
      window.alert('Selecciona un cliente.');
      return;
    }
    if (!form.repair_code.trim()) {
      window.alert('Ingresa un código de reparación.');
      return;
    }
    if (!form.device_description.trim()) {
      window.alert('Describe el dispositivo.');
      return;
    }
    if (!form.fault_option) {
      window.alert('Selecciona un tipo de falla.');
      return;
    }
    if (form.fault_option === 'Otros' && !form.fault_description.trim()) {
      window.alert('Describe la falla en el campo "Descripción personalizada".');
      return;
    }

    const finalFaultDescription =
      form.fault_option === 'Otros' ? form.fault_description.trim() : form.fault_option;

    const payload: DeviceRepairPayload = {
      repair_code: form.repair_code.trim(),
      client_id: form.client_id,
      technician_id: form.technician_id ?? undefined,
      device_description: form.device_description.trim(),
      fault_description: finalFaultDescription,
      status: form.status,
      total_amount: parseFloat(form.total_amount) || 0,
      receipt_number: form.receipt_number.trim() || undefined,
      repair_notes: form.repair_notes.trim() || undefined,
      images: mode === 'create' && images.length > 0 ? images : mode === 'edit' && editImages.length > 0 ? editImages : undefined,
    };
    await onSubmit(payload);
  }

  async function handleUploadImage(file: File) {
    if (!initialRepair?.id) return;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/images-repair/${initialRepair.id}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        // Agregar imagen a la lista
        setEditImages([...editImages, {
          name: data.file_name,
          path: data.path,
          url: data.url,
        }]);
      } else {
        alert('Error al subir imagen: ' + data.message);
      }
    } catch (error) {
      alert('Error al subir imagen: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDeleteImage(imageName: string) {
    if (!initialRepair?.id) return;
    if (!confirm('¿Eliminar esta imagen?')) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/images-repair/${initialRepair.id}/${imageName}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setEditImages(editImages.filter(img => img.name !== imageName));
      } else {
        alert('Error al eliminar imagen: ' + data.message);
      }
    } catch (error) {
      alert('Error al eliminar imagen: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }

  // Manejar cliente creado en el formulario rápido
  function handleClientCreated(newClient: ApiClient) {
    setForm({ ...form, client_id: newClient.id });
    setShowQuickClientForm(false);
  }

  // Manejar cierre del modal - limpiar imágenes huérfanas si es modo "create"
  async function handleClose() {
    if (mode === 'create' && repairUUID) {
      try {
        await imageRepairService.deleteRepairFolder(repairUUID);
      } catch (error) {
        console.error('Error limpiando imágenes huérfanas:', error);
      }
    }
    onClose();
  }

  return (
    <ModalScaffold onBackdropClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="repair-form-title"
        className="flex h-auto w-full max-w-2xl shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xl"
      >
        <div className="shrink-0 border-b border-slate-200 px-6 py-4">
          <h2 id="repair-form-title" className="text-lg font-semibold text-slate-900">
            {mode === 'create' ? 'Nuevo servicio de reparación' : 'Editar reparación'}
          </h2>
          {apiErrors.length > 0 ? (
            <ul className="mt-2 list-inside list-disc rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              {apiErrors.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* QR y UUID en modo create */}
            {mode === 'create' && repairUUID && (
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                <h3 className="text-sm font-semibold text-indigo-900 mb-3">
                  Carga de imágenes
                </h3>
                <div className="flex flex-col items-center gap-4">
                  {/* QR Code Container */}
                  <div
                    ref={qrRef}
                    className="flex justify-center p-3 bg-white rounded-lg border border-indigo-300"
                  />
                  
                  {/* ID */}
                  <div className="text-center w-full">
                    <p className="text-xs text-indigo-600 mb-2">ID de reparación:</p>
                    <p className="text-xs text-indigo-900 font-mono bg-white px-3 py-2 rounded border border-indigo-300 break-all">
                      {repairUUID}
                    </p>
                  </div>
                  
                  {/* Instrucción */}
                  <p className="text-xs text-indigo-700 text-center">
                    Escanea el QR con tu teléfono para cargar imágenes
                  </p>
                </div>
              </div>
            )}

            {/* Imágenes en modo EDICIÓN */}
            {mode === 'edit' && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">
                  Imágenes ({editImages.length})
                </h3>
                
                {editImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 mb-4">
                    {editImages.map((image) => (
                      <div key={image.name} className="relative group">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-24 object-cover rounded border border-blue-200 group-hover:opacity-75"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image.name)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Eliminar imagen"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleUploadImage(e.target.files[0]);
                    }
                  }}
                  disabled={uploadingImage}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                >
                  {uploadingImage ? '📤 Subiendo...' : '📷 Agregar imagen'}
                </button>
              </div>
            )}
            {/* Imágenes cargadas */}
            {images.length > 0 && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="text-sm font-semibold text-green-900 mb-3">
                  Imágenes cargadas ({images.length})
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {images.map((image) => (
                    <div key={image.name} className="relative group">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded border border-green-200"
                        loading="lazy"
                      />
                      
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Código de reparación */}
            <div>
              <label htmlFor="repair-code" className="block text-sm font-medium text-slate-700">
                Código de reparación *
              </label>
              <input
                id="repair-code"
                required
                maxLength={64}
                type="text"
                placeholder="Ej: REP-001"
                value={form.repair_code}
                onChange={(e) => setForm({ ...form, repair_code: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cliente *
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <ClientSearchSelect
                    id="repair-client"
                    label=""
                    value={form.client_id}
                    onChange={(clientId) => setForm({ ...form, client_id: clientId })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickClientForm(true)}
                  className="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 whitespace-nowrap transition-colors h-10"
                  title="Crear nuevo cliente sin salir del formulario"
                >
                  ➕ Crear cliente
                </button>
              </div>
            </div>

            {/* Técnico - solo en editar */}
            {mode === 'edit' && (
              <div>
                <label htmlFor="technician" className="block text-sm font-medium text-slate-700">
                  Técnico
                </label>
                <select
                  id="technician"
                  value={form.technician_id ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      technician_id: e.target.value ? parseInt(e.target.value, 10) : null,
                    })
                  }
                  disabled={loadingTechnicians}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="">Sin asignar</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dispositivo */}
            <div>
              <label htmlFor="device" className="block text-sm font-medium text-slate-700">
                Dispositivo *
              </label>
              <input
                id="device"
                required
                type="text"
                placeholder="Ej: Samsung Galaxy A12"
                value={form.device_description}
                onChange={(e) => setForm({ ...form, device_description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Falla */}
            <div>
              <label htmlFor="fault-select" className="block text-sm font-medium text-slate-700">
                Descripción de la falla *
              </label>
              <select
                id="fault-select"
                value={form.fault_option}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fault_option: e.target.value,
                    fault_description: e.target.value !== 'Otros' ? '' : form.fault_description,
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Selecciona el tipo de falla...</option>
                {FAULT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Campo de texto libre solo si seleccionó "Otros" */}
              {form.fault_option === 'Otros' && (
                <div className="mt-3">
                  <label htmlFor="fault-custom" className="block text-sm font-medium text-slate-600">
                    Descripción personalizada *
                  </label>
                  <textarea
                    id="fault-custom"
                    rows={3}
                    placeholder="Describe con detalle el problema que tiene el dispositivo..."
                    value={form.fault_description}
                    onChange={(e) => setForm({ ...form, fault_description: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Estado
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="recibido">Recibido</option>
                <option value="en_reparacion">En Reparación</option>
                <option value="reparado">Reparado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>

            {/* Total */}
            <div>
              <label htmlFor="total" className="block text-sm font-medium text-slate-700">
                Total
              </label>
              <input
                id="total"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.total_amount}
                onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Boleta */}
            <div>
              <label htmlFor="receipt" className="block text-sm font-medium text-slate-700">
                Boleta
              </label>
              <input
                id="receipt"
                type="text"
                maxLength={64}
                placeholder="Número de boleta"
                value={form.receipt_number}
                onChange={(e) => setForm({ ...form, receipt_number: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Notas */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
                Notas
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Notas adicionales sobre la reparación..."
                value={form.repair_notes}
                onChange={(e) => setForm({ ...form, repair_notes: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

      {/* Formulario rápido para crear cliente */}
      <QuickClientForm
        open={showQuickClientForm}
        onClose={() => setShowQuickClientForm(false)}
        onClientCreated={handleClientCreated}
      />
    </ModalScaffold>
  );
}