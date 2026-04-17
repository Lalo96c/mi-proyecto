import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalScaffoldProps = {
  children: ReactNode;
  onBackdropClick?: () => void;
  /** z-index del overlay (p. ej. z-50 o z-[60]) */
  zIndexClass?: string;
};

/**
 * Modal en portal + scroll del documento bloqueado + fondo que cubre todo el scroll
 * (evita ver blanco al desplazar modales altos o con overscroll).
 */
export function ModalScaffold({
  children,
  onBackdropClick,
  zIndexClass = 'z-50',
}: ModalScaffoldProps) {
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  return createPortal(
    <div
      className={`fixed inset-0 ${zIndexClass} overflow-y-auto overflow-x-hidden overscroll-contain`}
    >
      {/* items-center: centra el panel; sin stretch (default) el panel no ocupa toda la altura → botones pegados al contenido */}
      <div className="relative flex min-h-full items-center justify-center p-4 py-8">
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/60"
          aria-label="Cerrar"
          onClick={onBackdropClick}
        />
        <div className="relative z-10 flex w-full shrink-0 justify-center">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
