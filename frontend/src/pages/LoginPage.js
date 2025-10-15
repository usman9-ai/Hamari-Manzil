import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    setLoading(true);
        setError('');

        try {
            // Simulate API call - Replace with actual API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock successful login
            const mockUser = {
                id: 1,
                email: formData.email,
                firstName: 'Hostel',
                lastName: 'Owner',
                role: 'owner'
            };
            
            localStorage.setItem('token', 'mock-token-' + Date.now());
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            navigate('/hostel/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
      setLoading(false);
      }
  };

  return (
        <div className="min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="row g-0">
                                {/* Left Side - Gradient Panel */}
                                <div
                                    className="col-lg-5 d-none d-lg-flex flex-column justify-content-center align-items-center p-5"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white'
                                    }}
                                >
                                    <div className="text-center">
                                        <i className="fas fa-building fa-5x mb-4" style={{ opacity: 0.9 }}></i>
                                        <h2 className="fw-bold mb-3">Welcome Back!</h2>
                                        <p className="mb-4" style={{ opacity: 0.9, lineHeight: 1.6 }}>
                                            Sign in to manage your hostel properties, track bookings, and grow your business
                                        </p>
                                        <div className="text-start mt-4" style={{ opacity: 0.8 }}>
                                            <div className="mb-3">
                                                <i className="fas fa-check-circle me-2"></i>
                                                Manage multiple hostels
                                            </div>
                                            <div className="mb-3">
                                                <i className="fas fa-check-circle me-2"></i>
                                                Track bookings & revenue
                                            </div>
                                            <div className="mb-3">
                                                <i className="fas fa-check-circle me-2"></i>
                                                Get verified badge
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Login Form */}
                                <div className="col-lg-7 p-5">
                                    <div className="mb-4">
                                        <Link to="/" className="btn btn-link text-decoration-none p-0 mb-3">
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Back to Browse Hostels
                                        </Link>
                                        <h3 className="fw-bold mb-2">Sign In to Your Account</h3>
                                        <p className="text-muted">Enter your credentials to access the hostel owner portal</p>
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            <i className="fas fa-exclamation-circle me-2"></i>
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control form-control-lg"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                style={{ borderRadius: '10px' }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                className="form-control form-control-lg"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                style={{ borderRadius: '10px' }}
                                            />
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="rememberMe"
                                                />
                                                <label className="form-check-label" htmlFor="rememberMe">
                                                    Remember me
                                                </label>
                                            </div>
                                            <Link to="/hostel/forgot-password" className="text-primary text-decoration-none small">
                                                Forgot Password?
                                            </Link>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 py-3 mb-3"
                                            disabled={loading}
                                            style={{ borderRadius: '10px', fontWeight: '600', fontSize: '16px' }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Signing In...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-sign-in-alt me-2"></i>
                                                    Sign In
                                                </>
                                            )}
                                        </button>

                                        <div className="text-center">
                                            <p className="text-muted mb-0">
                                                Don't have an account?{' '}
                                                <Link to="/hostel/signup" className="text-primary fw-semibold text-decoration-none">
                                                    Sign Up Now
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
