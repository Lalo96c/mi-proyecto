import { PageHeader } from '../../components/layout/PageHeader';

type ModulePlaceholderPageProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function ModulePlaceholderPage({
  title,
  description,
  eyebrow = 'Módulo',
}: ModulePlaceholderPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="flex-1 p-6 sm:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-300/70 border-dashed bg-slate-200/40 px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-300/50 text-slate-600">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <p className="text-base font-medium text-slate-800">Contenido en construcción</p>
            <p className="mt-2 text-sm text-slate-600">
              Esta sección se implementará cuando conectes el backend correspondiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
