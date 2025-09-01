import React from 'react';
import { Toast, useToast } from '../ui/Toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            isVisible={true}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
};