import type { ReactNode } from 'react';

export type Column<T> = {
  key: string;
  label: string;
  headerClassName?: string;
  cellClassName?: string;
  render?: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  caption?: string;
  emptyMessage?: string;
  getRowId?: (row: T, index: number) => string | number;
};

export function DataTable<T>({
  columns,
  rows,
  caption,
  emptyMessage = 'No hay datos para mostrar.',
  getRowId = (row, index) =>
    row && typeof row === 'object' && 'id' in row
      ? (row as { id: string | number }).id
      : index,
}: DataTableProps<T>) {
  const colCount = columns.length;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/70 bg-white shadow-sm shadow-slate-900/5">
      <table className="min-w-full divide-y divide-slate-200/80 text-left text-sm text-slate-800">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-slate-100/80">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`whitespace-nowrap px-4 py-3 font-semibold text-slate-700 ${col.headerClassName ?? ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={colCount}
                className="px-4 py-8 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={getRowId(row, rowIndex)}
                className="transition-colors hover:bg-slate-50/90"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 align-middle text-slate-700 ${col.cellClassName ?? ''}`}
                  >
                    {col.render
                      ? col.render(row)
                      : String(
                          (row as Record<string, unknown>)[col.key] ?? '',
                        )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
