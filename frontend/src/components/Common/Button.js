import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  outline = false,
  block = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClass = 'btn';
  
  const variantClass = outline 
    ? `btn-outline-${variant}` 
    : `btn-${variant}`;
  
  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  }[size];
  
  const blockClass = block ? 'w-100' : '';
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    blockClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const renderIcon = () => {
    if (loading) {
      return <span className="spinner-border spinner-border-sm me-2" role="status"></span>;
    }
    if (icon) {
      return <i className={`${icon} ${iconPosition === 'right' ? 'ms-2' : 'me-2'}`}></i>;
    }
    return null;
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;
