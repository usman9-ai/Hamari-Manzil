import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { handlePasswordResetConfirm } from '../services/userServices';

const ResetPasswordPage = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    if (formData.new_password !== formData.confirm_password) {
      setErrors({ confirm_password: 'Passwords do not match' });
      return;
    }

    if (formData.new_password.length < 8) {
      setErrors({ new_password: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);

    try {
      await handlePasswordResetConfirm(
        uidb64,
        token,
        formData.new_password,
        formData.confirm_password
      );
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset failed:', error);
      if (error.response?.data) {
        const backendErrors = error.response.data;
        if (backendErrors.error) {
          setErrors({ general: backendErrors.error });
        } else {
          setErrors(backendErrors);
        }
      } else {
        setErrors({ general: 'Failed to reset password. The link may have expired.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Set New Password</h2>
                  <p className="text-muted">
                    Please enter your new password below.
                  </p>
                </div>

                {/* Success Message */}
                {success ? (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Password reset successful! Redirecting to login...
                  </div>
                ) : (
                  <>
                    {/* Error Message */}
                    {errors.general && (
                      <div className="alert alert-danger" role="alert">
                        {errors.general}
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="new_password" className="form-label fw-medium">
                          New Password
                        </label>
                        <input
                          type="password"
                          className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                          id="new_password"
                          name="new_password"
                          value={formData.new_password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          required
                        />
                        {errors.new_password && (
                          <div className="invalid-feedback">{errors.new_password}</div>
                        )}
                        <small className="text-muted">Minimum 8 characters</small>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="confirm_password" className="form-label fw-medium">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                          id="confirm_password"
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          placeholder="Confirm new password"
                          required
                        />
                        {errors.confirm_password && (
                          <div className="invalid-feedback">{errors.confirm_password}</div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-medium"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Resetting...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </button>
                    </form>
                  </>
                )}

                {/* Footer */}
                <div className="text-center mt-4">
                  <p className="mb-0 text-muted">
                    Remember your password?{' '}
                    <Link to="/login" className="text-primary fw-medium text-decoration-none">
                      Back to Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

