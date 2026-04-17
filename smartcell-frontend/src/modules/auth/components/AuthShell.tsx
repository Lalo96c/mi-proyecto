import type { ReactNode } from 'react';

type AuthShellProps = {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
};

/**
 * Contenedor visual para login / registro: fondo con gradiente, tarjeta y marca.
 */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col justify-center overflow-y-auto bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-30%,rgba(99,102,241,0.35),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-slate-900/20 backdrop-blur-sm sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/35 ring-4 ring-indigo-500/10">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
                <path d="M12 22V12" />
                <path d="M4 7l8 5 8-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            {subtitle ? (
              <div className="mt-2 text-sm leading-relaxed text-slate-600">{subtitle}</div>
            ) : null}
          </div>
          {children}
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          Conexión segura · Tus credenciales se envían cifrado (HTTPS en producción)
        </p>
      </div>
    </div>
  );
}
