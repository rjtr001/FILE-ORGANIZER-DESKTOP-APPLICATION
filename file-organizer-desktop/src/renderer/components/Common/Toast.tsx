import React, { useState, useEffect } from 'react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const Toast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Listen for toast messages from main process
    const handleToast = (message: string, type: 'success' | 'error' | 'info') => {
      const id = Date.now().toString();
      const newToast: ToastMessage = { id, message, type };
      
      setToasts(prev => [...prev, newToast]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 5000);
    };

    // Store reference for cleanup
    (window as any).showToast = handleToast;

    return () => {
      delete (window as any).showToast;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast ${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <span>{getToastIcon(toast.type)}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
