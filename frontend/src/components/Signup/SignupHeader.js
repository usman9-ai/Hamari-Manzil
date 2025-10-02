import React from 'react';

const SignupHeader = ({ title = "Create Account", subtitle = "Find Your Tribe, Find Your Stay" }) => {
  return (
    <div className="signup-header text-center mb-4">
      <div className="logo mb-3">
        <h2 className="text-primary fw-bold">Hamari Manzil</h2>
      </div>
      <h1 className="h3 fw-semibold text-dark mb-2">{title}</h1>
      <p className="text-muted">{subtitle}</p>
    </div>
  );
};

export default SignupHeader;