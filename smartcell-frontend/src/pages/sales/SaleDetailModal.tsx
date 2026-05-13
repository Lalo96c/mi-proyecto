import { ModalScaffold } from '../../components/ModalScaffold';
import { formatCurrency } from '../../utils/format';
import type { ApiSale } from '../../types/sale';
import { clientDisplayName } from '../../types/sale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type SaleDetailModalProps = {
  open: boolean;
  sale: ApiSale | null;
  onClose: () => void;
};

async function loadImageAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo cargar la imagen: ${url}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('No se pudo convertir la imagen a base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}


function parseNum(v: string | number): number {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isNaN(n) ? 0 : n;
}

export function SaleDetailModal({ open, sale, onClose }: SaleDetailModalProps) {
  if (!open || !sale) return null;

  const total = parseNum(sale.total_amount);
  const lines = sale.detail ?? [];

  const generatePDF = async () => {
    console.log('Generando PDF');
    try {
      const doc = new jsPDF();

      // Agregar logo (carga como data URL desde public)
      try {
        const logoDataUrl = await loadImageAsDataUrl('/logo.jpg');
        doc.addImage(logoDataUrl, 'JPEG', 150, 10, 30, 30);
      } catch (error) {
        console.warn('No se pudo cargar el logo para el PDF:', error);
      }

      // Datos de la empresa
      doc.setFontSize(14);
      doc.text('Smartcell', 20, 15);
      doc.setFontSize(10);
      doc.text('Dirección: AV. LA UNION N° 1496 Piso 4 - Villa Maria Del Triunfo, Lima, Perú', 20, 22);
      doc.text('Teléfono: +51 950262596', 20, 28);

      // Título de la boleta
      doc.setFontSize(18);
      doc.text('Boleta de Venta', 20, 42);

      doc.setFontSize(12);
      doc.text(`Código de Venta: ${sale.sale_code}`, 20, 54);
      doc.text(`Fecha: ${sale.sale_date}`, 20, 62);
      doc.text(`Cliente: ${clientDisplayName(sale.client ?? undefined)}`, 20, 70);

      const tableData = lines.map(line => [
        line.product?.code ?? `#${line.product_id}`,
        line.product?.name ?? '—',
        line.quantity.toString(),
        formatCurrency(parseNum(line.unit_price)),
        formatCurrency(parseNum(line.line_total))
      ]);

      autoTable(doc, {
        head: [['Código', 'Producto', 'Cant.', 'P. Unit.', 'Subtotal']],
        body: tableData,
        startY: 80,
      });

      const finalY = (doc as any).lastAutoTable?.finalY ?? 90;
      doc.text(`Total: ${formatCurrency(total)}`, 20, finalY + 10);

      doc.save(`boleta-venta-${sale.sale_code}.pdf`);
      console.log('PDF generado y descargado');
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  };

  return (
    <ModalScaffold onBackdropClick={onClose} zIndexClass="z-[60]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-detail-title"
        className="flex h-auto w-full max-w-2xl shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xl"
      >
        <div className="shrink-0 border-b border-slate-200 px-6 py-4">
          <h2 id="sale-detail-title" className="text-lg font-semibold text-slate-900">
            Venta {sale.sale_code}
          </h2>
          <div className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <span className="font-medium text-slate-700">Fecha: </span>
              {sale.sale_date}
            </p>
            <p>
              <span className="font-medium text-slate-700">Cliente: </span>
              {clientDisplayName(sale.client ?? undefined)}
            </p>
            <p className="sm:col-span-2">
              <span className="font-medium text-slate-700">Total: </span>
              <span className="tabular-nums text-slate-900">{formatCurrency(total)}</span>
            </p>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="mb-2 text-sm font-medium text-slate-800">Registros</p>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 font-semibold text-slate-700">Producto</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Cant.</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">P. unit.</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lines.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                      Sin registros
                    </td>
                  </tr>
                ) : (
                  lines.map((line) => (
                    <tr key={line.id}>
                      <td className="px-3 py-2 text-slate-800">
                        <span className="font-mono text-xs text-slate-500">
                          {line.product?.code ?? `#${line.product_id}`}
                        </span>{' '}
                        {line.product?.name ?? '—'}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-800">
                        {line.quantity}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-800">
                        {formatCurrency(parseNum(line.unit_price))}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium text-slate-900">
                        {formatCurrency(parseNum(line.line_total))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 px-6 py-3">
          <button
            type="button"
            onClick={generatePDF}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 mr-2"
          >
            Generar PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </ModalScaffold>
  );
}
