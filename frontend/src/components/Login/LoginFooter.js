import React from 'react';

const LoginFooter = () => {
  return (
    <div className="login-footer text-center mt-4">
      <p className="text-muted mb-3">
        Don't have an account?{' '}
        <a href="/signup" className="text-primary text-decoration-none fw-medium">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default LoginFooter;