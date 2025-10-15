import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Simulate API call
        try {
            // Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock success
            setSuccess(true);
            setEmail('');
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
            console.error('Reset error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="card shadow-lg border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <div className="row g-0">
                        {/* Left Side - Gradient Panel */}
                        <div
                            className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center p-5"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                minHeight: '550px'
                            }}
                        >
                            <i className="fas fa-key fa-5x mb-4" style={{ opacity: 0.9 }}></i>
                            <h3 className="text-center fw-bold mb-3">Reset Your Password</h3>
                            <p className="text-center mb-4" style={{ opacity: 0.9, lineHeight: 1.6 }}>
                                No worries! Enter your email address and we'll send you instructions to reset your password.
                            </p>
                            <div className="text-center mt-3" style={{ opacity: 0.8 }}>
                                <div className="mb-3">
                                    <i className="fas fa-check-circle me-2"></i>
                                    Secure & Fast
                                </div>
                                <div className="mb-3">
                                    <i className="fas fa-check-circle me-2"></i>
                                    Email Verification
                                </div>
                                <div className="mb-3">
                                    <i className="fas fa-check-circle me-2"></i>
                                    Quick Recovery
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Reset Form */}
                        <div className="col-lg-6 p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold mb-2">Forgot Password?</h2>
                                <p className="text-muted">We'll help you get back to your account</p>
                            </div>

                            {success && (
                                <div className="alert alert-success d-flex align-items-center" role="alert">
                                    <i className="fas fa-check-circle me-3 fs-4"></i>
                                    <div>
                                        <strong>Success!</strong> If an account exists with that email, we've sent password reset instructions. Please check your inbox.
                                    </div>
                                </div>
                            )}

                            {error && <div className="alert alert-danger">{error}</div>}

                            {!success ? (
                                <form onSubmit={handleResetSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="emailInput" className="form-label fw-semibold">
                                            Email Address
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <i className="fas fa-envelope text-muted"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control border-start-0"
                                                id="emailInput"
                                                placeholder="Enter your registered email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                style={{ borderRadius: '0 8px 8px 0' }}
                                            />
                                        </div>
                                        <small className="text-muted">
                                            Enter the email address associated with your account
                                        </small>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-bold mb-3"
                                        disabled={loading}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Sending Reset Link...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-2"></i>
                                                Send Reset Link
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <Link to="/hostel/login" className="text-primary text-decoration-none">
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Back to Sign In
                                        </Link>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center">
                                    <div className="my-4">
                                        <i className="fas fa-envelope-open-text text-primary mb-3" style={{ fontSize: '60px', opacity: 0.8 }}></i>
                                        <p className="text-muted mb-4">
                                            Didn't receive the email? Check your spam folder or try again.
                                        </p>
                                        <button
                                            className="btn btn-outline-primary me-2"
                                            onClick={() => {
                                                setSuccess(false);
                                                setEmail('');
                                            }}
                                        >
                                            <i className="fas fa-redo me-2"></i>
                                            Try Again
                                        </button>
                                        <Link to="/hostel/login" className="btn btn-primary">
                                            <i className="fas fa-sign-in-alt me-2"></i>
                                            Back to Sign In
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {!success && (
                                <div className="mt-5 pt-4 border-top">
                                    <div className="text-center">
                                        <p className="text-muted mb-2">Don't have an account?</p>
                                        <Link to="/hostel/signup" className="text-primary fw-bold text-decoration-none">
                                            Sign Up Now
                                        </Link>
                                    </div>
                                    <div className="text-center mt-3">
                                        <Link to="/" className="text-secondary text-decoration-none small">
                                            <i className="fas fa-arrow-left me-1"></i>
                                            Back to Browse Hostels
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Need Help Section */}
                            <div className="mt-4 p-3 bg-light rounded-3">
                                <div className="text-center">
                                    <small className="text-muted d-block mb-2">
                                        <i className="fas fa-info-circle me-1"></i>
                                        Still having trouble accessing your account?
                                    </small>
                                    <a 
                                        href="https://wa.me/923004334270" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-success"
                                        style={{ borderRadius: '8px' }}
                                    >
                                        <i className="fab fa-whatsapp me-2"></i>
                                        Contact Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

