import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  image,
  imageAlt,
  imageHeight = '200px',
  header,
  footer,
  className = '',
  bodyClassName = '',
  shadow = 'sm',
  border = true,
  hover = false,
  ...props 
}) => {
  const cardClasses = [
    'card',
    shadow && `shadow-${shadow}`,
    !border && 'border-0',
    hover && 'hover-shadow transition',
    className
  ].filter(Boolean).join(' ');

  const bodyClasses = [
    'card-body',
    bodyClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {image && (
        <img
          src={image}
          className="card-img-top"
          alt={imageAlt || 'Card image'}
          style={{ height: imageHeight, objectFit: 'cover' }}
        />
      )}
      
      {header && (
        <div className="card-header">
          {header}
        </div>
      )}
      
      <div className={bodyClasses}>
        {title && (
          <h5 className="card-title fw-semibold">
            {title}
            {subtitle && <small className="text-muted d-block">{subtitle}</small>}
          </h5>
        )}
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
