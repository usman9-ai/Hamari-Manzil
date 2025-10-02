import React from 'react';

const SignupFooter = () => {
  return (
    <div className="signup-footer text-center mt-4">
      <p className="text-muted mb-3">
        Already have an account?{' '}
        <a href="/login" className="text-primary text-decoration-none fw-medium">
          Sign in
        </a>
      </p>
      <div className="divider mb-3">
        <span className="text-muted">or</span>
      </div>
      <button className="btn btn-outline-secondary w-100 mb-2">
        <i className="fab fa-google me-2"></i>
        Sign up with Google
      </button>
      <button className="btn btn-outline-secondary w-100">
        <i className="fab fa-facebook me-2"></i>
        Sign up with Facebook
      </button>
    </div>
  );
};

export default SignupFooter;