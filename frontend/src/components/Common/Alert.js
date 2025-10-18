import React, { useState, useEffect } from 'react';

const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  dismissible = false,
  autoClose = false,
  autoCloseDelay = 5000,
  onClose,
  className = '',
  icon,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay ]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const alertClasses = [
    'alert',
    `alert-${type}`,
    dismissible && 'alert-dismissible',
    className
  ].filter(Boolean).join(' ');

  const getDefaultIcon = () => {
    const iconMap = {
      success: 'fas fa-check-circle',
      danger: 'fas fa-exclamation-triangle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
      primary: 'fas fa-info-circle',
      secondary: 'fas fa-info-circle',
      light: 'fas fa-info-circle',
      dark: 'fas fa-info-circle'
    };
    return iconMap[type] || 'fas fa-info-circle';
  };

  const alertIcon = icon || getDefaultIcon();

  return (
    <div className={alertClasses} role="alert" {...props}>
      <div className="d-flex align-items-start">
        {alertIcon && (
          <div className="me-3 mt-1">
            <i className={alertIcon}></i>
          </div>
        )}
        
        <div className="flex-grow-1">
          {title && (
            <h6 className="alert-heading fw-semibold mb-1">{title}</h6>
          )}
          <div>{children}</div>
        </div>
        
        {dismissible && (
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
            aria-label="Close"
          ></button>
        )}
      </div>
      
      {autoClose && (
        <div className="mt-2">
          <div className="progress" style={{ height: '2px' }}>
            <div
              className="progress-bar"
              style={{
                animation: `shrink ${autoCloseDelay}ms linear`,
                width: '100%'
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alert;
