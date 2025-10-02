import React from 'react';

const LoginHeader = ({ title = "Welcome Back", subtitle = "Sign in to your account" }) => {
  return (
    <div className="login-header text-center mb-4">
      <div className="logo mb-3">
        <h2 className="text-primary fw-bold">HostelFinder</h2>
      </div>
      <h1 className="h3 fw-semibold text-dark mb-2">{title}</h1>
      <p className="text-muted">{subtitle}</p>
    </div>
  );
};

export default LoginHeader;