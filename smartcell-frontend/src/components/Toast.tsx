import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export type ToastProps = {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
};

export function Toast({ type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-rose-50 border-rose-200',
    info: 'bg-blue-50 border-blue-200',
  }[type];

  const textColor = {
    success: 'text-emerald-800',
    error: 'text-rose-800',
    info: 'text-blue-800',
  }[type];

  const iconBg = {
    success: 'bg-emerald-100 text-emerald-600',
    error: 'bg-rose-100 text-rose-600',
    info: 'bg-blue-100 text-blue-600',
  }[type];

  const icon = {
    success: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-[9999] flex gap-3 rounded-lg border ${bgColor} p-4 shadow-lg max-w-sm animate-in fade-in slide-in-from-top-4`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${textColor}`}>{title}</p>
        {message && <p className={`mt-1 text-xs ${textColor} opacity-75`}>{message}</p>}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className={`ml-2 shrink-0 text-sm font-medium ${textColor} hover:opacity-75`}
      >
        ✕
      </button>
    </div>
  );
}
