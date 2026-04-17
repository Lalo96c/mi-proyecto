import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  const state = location.state as { from?: { pathname: string } } | undefined;
  const from = state?.from?.pathname ?? '/';

  if (initializing) {
    return (
      <section className="flex min-h-dvh flex-1 items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"
            role="status"
            aria-label="Cargando"
          />
          <p className="text-sm text-slate-500">Comprobando sesión…</p>
        </div>
      </section>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
}
