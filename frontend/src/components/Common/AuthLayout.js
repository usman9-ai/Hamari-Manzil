import React from 'react';
import FooterNav from '../Navigation/FooterNav';

const AuthLayout = ({
  children,
  footer,
  pageClassName = 'auth-page',
  maxWidthClass = 'col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6'
}) => {
  return (
    <div className={`${pageClassName} min-vh-100 d-flex align-items-center bg-light`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className={maxWidthClass}>
            <div className="card shadow border-0">
              <div className="card-body p-4 p-md-5" style={{ paddingBottom: '80px' }}>
                {children}
              </div>
            </div>
            {footer && (
              <div className="mt-3 d-none d-md-block">
                {footer}
              </div>
            )}
            {!footer && (
              <div className="mt-3 d-none d-md-block">
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;


