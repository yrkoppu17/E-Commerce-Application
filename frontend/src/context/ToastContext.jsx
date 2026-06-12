import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="text-rose-500 w-5 h-5 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />;
      default:
        return <Info className="text-blue-500 w-5 h-5 flex-shrink-0" />;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-100 bg-emerald-50/90 text-emerald-900 shadow-emerald-100/30';
      case 'error':
        return 'border-rose-100 bg-rose-50/90 text-rose-900 shadow-rose-100/30';
      case 'warning':
        return 'border-amber-100 bg-amber-50/90 text-amber-900 shadow-amber-100/30';
      default:
        return 'border-blue-100 bg-blue-50/90 text-blue-900 shadow-blue-100/30';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Portal Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 transform translate-y-0 scale-100 animate-fade-slide-up ${getTypeStyles(
              toast.type
            )}`}
          >
            <div className="flex items-center gap-3">
              {getIcon(toast.type)}
              <p className="text-sm font-semibold tracking-wide leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-450 hover:text-slate-700 ml-4 p-1 rounded-full hover:bg-slate-200/50 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
