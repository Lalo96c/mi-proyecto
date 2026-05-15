import { useState, useEffect } from 'react';
import { ModalScaffold } from './ModalScaffold';
import { AVAILABLE_TOOLS } from '../types/deviceRepair';

type TechnicianToolsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (toolIds: string[]) => void;
  initialTools?: string[];
  technicianName?: string;
};

export function TechnicianToolsModal({
  isOpen,
  onClose,
  onSave,
  initialTools = [],
  technicianName = 'Técnico',
}: TechnicianToolsModalProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>(initialTools);

  useEffect(() => {
    setSelectedTools(initialTools);
  }, [initialTools, isOpen]);

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleSave = () => {
    onSave(selectedTools);
    onClose();
  };

  if (!isOpen) return null;

  // Agrupar herramientas por categoría
  const groupedTools = AVAILABLE_TOOLS.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, typeof AVAILABLE_TOOLS>
  );

  const categoryLabels: Record<string, string> = {
    diagnostico: '🔍 Diagnóstico',
    reparacion: '🔧 Reparación',
    limpieza: '🧹 Limpieza',
    seguridad: '⚡ Seguridad',
    otro: '📦 Otro',
  };

  return (
    <ModalScaffold onBackdropClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tools-modal-title"
        className="h-auto w-full max-w-2xl shrink-0 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/15"
      >
        <div className="mb-6">
          <h2 id="tools-modal-title" className="text-lg font-semibold text-slate-900">
            Herramientas utilizadas por {technicianName}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Selecciona las herramientas que utilizó el técnico durante la reparación
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedTools).map(([category, tools]) => (
            <div key={category}>
              <h3 className="mb-3 font-medium text-slate-900">
                {categoryLabels[category] || category}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {tools.map((tool) => (
                  <label
                    key={tool.id}
                    className="flex items-center space-x-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(tool.id)}
                      onChange={() => toggleTool(tool.id)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">{tool.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Guardar herramientas ({selectedTools.length})
          </button>
        </div>
      </div>
    </ModalScaffold>
  );
}
