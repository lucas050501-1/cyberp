import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  const Icon = icons[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-1 duration-300">
      <div className={`
        max-w-sm w-full border rounded-lg p-4 shadow-lg
        ${colors[type]}
      `}>
        <div className="flex items-start">
          <Icon className={`w-5 h-5 mt-0.5 mr-3 ${iconColors[type]}`} />
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast hook for global usage
interface ToastState {
  toasts: Array<{
    id: string;
    type: ToastProps['type'];
    message: string;
  }>;
}

export const useToast = () => {
  const [state, setState] = React.useState<ToastState>({ toasts: [] });

  const addToast = (type: ToastProps['type'], message: string) => {
    const id = Math.random().toString(36).substring(2, 15);
    setState(prev => ({
      toasts: [...prev.toasts, { id, type, message }],
    }));
  };

  const removeToast = (id: string) => {
    setState(prev => ({
      toasts: prev.toasts.filter(toast => toast.id !== id),
    }));
  };

  const showSuccess = (message: string) => addToast('success', message);
  const showError = (message: string) => addToast('error', message);
  const showWarning = (message: string) => addToast('warning', message);
  const showInfo = (message: string) => addToast('info', message);

  return {
    toasts: state.toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
  };
};