import React, { useState, useEffect, useCallback } from 'react';

const Toast = ({ 
    show, 
    onClose, 
    type = 'success', 
    title, 
    message, 
    duration = 5000 
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for animation to complete
    }, [onClose]);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, handleClose]);

    const getToastStyles = () => {
        const baseStyles = "toast align-items-center text-white border-0";
        const typeStyles = {
            success: "bg-success",
            error: "bg-danger", 
            warning: "bg-warning",
            info: "bg-info"
        };
        return `${baseStyles} ${typeStyles[type] || typeStyles.success}`;
    };

    const getIcon = () => {
        const icons = {
            success: "fas fa-check-circle",
            error: "fas fa-exclamation-circle",
            warning: "fas fa-exclamation-triangle", 
            info: "fas fa-info-circle"
        };
        return icons[type] || icons.success;
    };

    if (!show) return null;

    return (
        <div 
            className={`toast-container position-fixed top-0 end-0 p-3`}
            style={{ zIndex: 9999 }}
        >
            <div 
                className={getToastStyles()}
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'all 0.3s ease-in-out',
                    minWidth: '300px'
                }}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="d-flex">
                    <div className="toast-body d-flex align-items-center">
                        <i className={`${getIcon()} me-3 fs-5`}></i>
                        <div>
                            {title && <div className="fw-bold">{title}</div>}
                            <div className="small">{message}</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white me-2 m-auto"
                        onClick={handleClose}
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
