import React, { useState } from 'react';
import { handleChangePassword } from '../../services/userServices';

const ChangePasswordModal = ({ show, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      await handleChangePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      });
      
      // Reset form
      setFormData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Password change failed:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to change password. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Change Password</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  {errors.general}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="old_password" className="form-label">Current Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.old_password ? 'is-invalid' : ''}`}
                  id="old_password"
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  required
                />
                {errors.old_password && <div className="invalid-feedback">{errors.old_password}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="new_password" className="form-label">New Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                  id="new_password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                />
                {errors.new_password && <div className="invalid-feedback">{errors.new_password}</div>}
                <small className="text-muted">Minimum 8 characters</small>
              </div>

              <div className="mb-3">
                <label htmlFor="confirm_password" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
                {errors.confirm_password && <div className="invalid-feedback">{errors.confirm_password}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

