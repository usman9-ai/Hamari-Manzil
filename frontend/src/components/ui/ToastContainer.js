import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts, onRemove }) => {
    return (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    show={true}
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={() => onRemove(toast.id)}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
