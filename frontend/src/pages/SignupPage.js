import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
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
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

    setLoading(true);

        try {
            // Simulate API call - Replace with actual API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock successful signup
            const mockUser = {
                id: 1,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                role: 'owner'
            };
            
            localStorage.setItem('token', 'mock-token-' + Date.now());
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            navigate('/hostel/dashboard');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
      setLoading(false);
      }
  };

  return (
        <div className="min-vh-100 d-flex align-items-center py-5" style={{ backgroundColor: '#f8f9fa' }}>
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
                                        <i className="fas fa-user-plus fa-5x mb-4" style={{ opacity: 0.9 }}></i>
                                        <h2 className="fw-bold mb-3">Join Us Today!</h2>
                                        <p className="mb-4" style={{ opacity: 0.9, lineHeight: 1.6 }}>
                                            Create your hostel owner account and start managing your properties with ease
                                        </p>
                                        <div className="text-start mt-4" style={{ opacity: 0.8 }}>
                                            <div className="mb-3">
                                                <i className="fas fa-check-circle me-2"></i>
                                                List unlimited hostels
                                            </div>
                                            <div className="mb-3">
                                                <i className="fas fa-check-circle me-2"></i>
                                                Manage rooms & pricing
                                            </div>
                                            <div className="mb-3">
                                                <i className="fas fa-check-circle me-2"></i>
                                                View analytics & reports
                                            </div>
                                            <div className="mb-3">
                                                <i className="fas fa-check-circle me-2"></i>
                                                24/7 Support available
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Signup Form */}
                                <div className="col-lg-7 p-5">
                                    <div className="mb-4">
                                        <Link to="/" className="btn btn-link text-decoration-none p-0 mb-3">
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Back to Browse Hostels
                                        </Link>
                                        <h3 className="fw-bold mb-2">Create Your Account</h3>
                                        <p className="text-muted">Register as a hostel owner and start growing your business</p>
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            <i className="fas fa-exclamation-circle me-2"></i>
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">First Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    className="form-control"
                                                    placeholder="Enter first name"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Last Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    className="form-control"
                                                    placeholder="Enter last name"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-semibold">Email Address <span className="text-danger">*</span></label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="Enter your email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className="form-control"
                                                    placeholder="+92 300 1234567"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Password <span className="text-danger">*</span></label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control"
                                                    placeholder="Create password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    minLength="6"
                                                    style={{ borderRadius: '10px' }}
                                                />
                                                <small className="text-muted">Minimum 6 characters</small>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Confirm Password <span className="text-danger">*</span></label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    className="form-control"
                                                    placeholder="Confirm password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>

                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="agreeTerms"
                                                        required
                                                    />
                                                <label className="form-check-label" htmlFor="agreeTerms">
                                                    I agree to the <Link to="/terms" className="text-primary" target="_blank">Terms & Conditions</Link> and <Link to="/privacy" className="text-primary" target="_blank">Privacy Policy</Link>
                                                </label>
                                                </div>
                                            </div>

                                            <div className="col-12 mt-4">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary w-100 py-3 mb-3"
                                                    disabled={loading}
                                                    style={{ borderRadius: '10px', fontWeight: '600', fontSize: '16px' }}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                            Creating Account...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-user-plus me-2"></i>
                                                            Create Account
                                                        </>
                                                    )}
                                                </button>

                                                <div className="text-center">
                                                    <p className="text-muted mb-0">
                                                        Already have an account?{' '}
                                                        <Link to="/hostel/login" className="text-primary fw-semibold text-decoration-none">
                                                            Sign In
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
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

export default SignupPage;
