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
      <div className="divider mb-3">
        <span className="text-muted">or</span>
      </div>
      <button className="btn btn-outline-secondary w-100 mb-2">
        <i className="fab fa-google me-2"></i>
        Continue with Google
      </button>
      <button className="btn btn-outline-secondary w-100">
        <i className="fab fa-facebook me-2"></i>
        Continue with Facebook
      </button>
    </div>
  );
};

export default LoginFooter;