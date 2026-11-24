import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const VARIANT_STYLES = {
  success: {
    container: 'bg-white border-emerald-200 text-slate-800 shadow-lg shadow-emerald-900/5',
    iconWrap: 'bg-emerald-50 text-emerald-600',
    Icon: CheckCircle2,
  },
  error: {
    container: 'bg-white border-rose-200 text-slate-800 shadow-lg shadow-rose-900/5',
    iconWrap: 'bg-rose-50 text-rose-600',
    Icon: AlertCircle,
  },
  info: {
    container: 'bg-white border-blue-200 text-slate-800 shadow-lg shadow-blue-900/5',
    iconWrap: 'bg-blue-50 text-blue-600',
    Icon: Info,
  },
};

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 w-full max-w-sm px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((toast) => {
        const style = VARIANT_STYLES[toast.type] || VARIANT_STYLES.info;
        const { Icon } = style;

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-200 ${style.container}`}
          >
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconWrap}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
              )}
              <p className="text-sm text-slate-600 break-words">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
