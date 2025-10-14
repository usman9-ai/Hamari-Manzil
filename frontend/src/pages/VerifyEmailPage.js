import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api/index';

const VerifyEmailPage = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyEmail = async () => {
    try {
      // Call backend verification endpoint
      await api.get(`/users/verify/${uidb64}/${token}/`);
      
      setStatus('success');
      setMessage('Email verified successfully! You can now log in.');
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Verification failed:', error);
      setStatus('error');
      
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Invalid or expired verification link. Please try again or contact support.');
      }
    }
  };

  return (
    <div className="verify-email-page min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-body p-4 p-md-5 text-center">
                {/* Icon */}
                <div className="mb-4">
                  {status === 'verifying' && (
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  {status === 'success' && (
                    <div className="text-success">
                      <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem' }}></i>
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="text-danger">
                      <i className="bi bi-x-circle-fill" style={{ fontSize: '4rem' }}></i>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2 className="fw-bold mb-3">
                  {status === 'verifying' && 'Verifying Email'}
                  {status === 'success' && 'Email Verified!'}
                  {status === 'error' && 'Verification Failed'}
                </h2>

                {/* Message */}
                <p className="text-muted mb-4">{message}</p>

                {/* Actions */}
                {status === 'success' && (
                  <div className="alert alert-info" role="alert">
                    <small>Redirecting to login page in 3 seconds...</small>
                  </div>
                )}

                {status === 'error' && (
                  <div className="d-grid gap-2">
                    <Link to="/signup" className="btn btn-primary">
                      Register Again
                    </Link>
                    <Link to="/login" className="btn btn-outline-secondary">
                      Go to Login
                    </Link>
                  </div>
                )}

                {status === 'success' && (
                  <Link to="/login" className="btn btn-primary">
                    Go to Login Now
                  </Link>
                )}

                {/* Footer */}
                <div className="mt-4">
                  <Link to="/" className="text-muted text-decoration-none">
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

