import React, { useState } from 'react';

const LoginForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Call parent onSubmit with form data and error setter
    onSubmit(formData, setErrors);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {errors.general && (
        <div className="alert alert-danger" role="alert">
          {errors.general}
        </div>
      )}
      
      {/*email*/}
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-medium">Email</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      {/*password*/}
      <div className="mb-3">
        <label htmlFor="password" className="form-label fw-medium">Password</label>
        <input
          type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>

      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="remember" />
        <label className="form-check-label" htmlFor="remember">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100 py-2 fw-medium"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="text-center mt-3">
        <a href="/forgot-password" className="text-primary text-decoration-none">
          Forgot your password?
        </a>
      </div>
    </form>
  );
};

export default LoginForm;