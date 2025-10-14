import { useState, useCallback } from 'react';

const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback(({ type = 'success', title, message, duration = 5000 }) => {
        const id = Date.now() + Math.random();
        const newToast = { id, type, title, message, duration };
        
        setToasts(prev => [...prev, newToast]);
        
        // Auto remove after duration
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);

    const showSuccess = useCallback((title, message) => {
        showToast({ type: 'success', title, message });
    }, [showToast]);

    const showError = useCallback((title, message) => {
        showToast({ type: 'error', title, message });
    }, [showToast]);

    const showWarning = useCallback((title, message) => {
        showToast({ type: 'warning', title, message });
    }, [showToast]);

    const showInfo = useCallback((title, message) => {
        showToast({ type: 'info', title, message });
    }, [showToast]);

    return {
        toasts,
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast
    };
};

export default useToast;
