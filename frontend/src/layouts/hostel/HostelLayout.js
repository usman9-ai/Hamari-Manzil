import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HostelLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/hostel/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
        { path: '/hostel/hostels', icon: 'fa-home', label: 'Hostels' },
        { path: '/hostel/rooms', icon: 'fa-bed', label: 'Rooms' },
        { path: '/hostel/reviews', icon: 'fa-star', label: 'Reviews' },
        { path: '/hostel/verification', icon: 'fa-certificate', label: 'Verification' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <div
                className={`text-dark ${sidebarOpen ? '' : 'd-none d-lg-block'}`}
                style={{
                    width: sidebarOpen ? '260px' : '0',
                    transition: 'width 0.3s',
                    position: 'fixed',
                    height: '100vh',
                    overflowY: 'auto',
                    zIndex: 1000,
                    background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRight: '1px solid #dee2e6',
                    boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
                }}
            >
                <div className="p-3 border-bottom" style={{ borderColor: '#dee2e6' }}>
                    <div className="d-flex align-items-center justify-content-between">
                        <button
                            onClick={() => navigate('/')}
                            className="d-flex align-items-center btn btn-link text-decoration-none p-0"
                            style={{ border: 'none' }}
                        >
                            <div
                                className="bg-primary rounded d-flex align-items-center justify-content-center me-2"
                                style={{ width: '40px', height: '40px' }}
                            >
                                <i className="fas fa-home text-white"></i>
                            </div>
                            <div className='text-start'>
                                <h5 className="mb-0 fw-bold text-primary">Hamari Manzil</h5>
                                <small className="text-muted">Hostel Portal</small>
                            </div>
                        </button>
                        <button
                            className="btn btn-link text-dark d-lg-none p-0"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <nav className="p-3">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`btn w-100 text-start mb-2 d-flex align-items-center ${isActive(item.path)
                                ? 'btn-primary text-white'
                                : 'btn-link text-dark text-decoration-none'
                                }`}
                            style={{
                                borderRadius: '10px',
                                padding: '12px 16px',
                                fontWeight: isActive(item.path) ? '600' : '500',
                                backgroundColor: isActive(item.path) ? undefined : 'transparent',
                            }}
                        >
                            <i className={`fas ${item.icon} me-3`} style={{ width: '20px' }}></i>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto p-3 border-top" style={{ borderColor: '#dee2e6' }}>
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger w-100"
                        style={{ borderRadius: '10px', fontWeight: '600' }}
                    >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div
                className="flex-fill"
                style={{
                    marginLeft: sidebarOpen ? '260px' : '0',
                    transition: 'margin-left 0.3s',
                }}
            >
                {/* Header */}
                <header className="bg-white border-bottom sticky-top">
                    <div className="container-fluid">
                        <div className="d-flex align-items-center justify-content-between py-3">
                            <button
                                className="btn btn-link text-dark d-lg-none p-0"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <i className="fas fa-bars fa-lg"></i>
                            </button>

                            <div className="d-flex align-items-center gap-3 ms-auto">
                                <button
                                    className="btn btn-link text-dark d-flex align-items-center text-decoration-none p-0"
                                    onClick={() => navigate('/hostel/profile')}
                                    style={{ border: 'none' }}
                                >
                                    <div
                                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                                        style={{ width: '36px', height: '36px' }}
                                    >
                                        <i className="fas fa-user text-white"></i>
                                    </div>
                                    <div className="text-start d-none d-md-block">
                                        <div className="fw-semibold small">Hostel Owner</div>
                                        <div className="text-muted" style={{ fontSize: '12px' }}>
                                            owner@example.com
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 73px)' }}>
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-white border-top py-3">
                    <div className="container-fluid">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <small className="text-muted">
                                © {new Date().getFullYear()} Hamari Manzil. All rights reserved.
                            </small>
                            <small className="text-muted">
                                <a href="/privacy" className="text-muted text-decoration-none me-2">Privacy Policy</a>
                                <span>•</span>
                                <a href="/terms" className="text-muted text-decoration-none ms-2 me-3">Terms</a>
                                <span>•</span>
                                <span className="ms-2">Need help? <a href="https://wa.me/923004334270" target="_blank" rel="noopener noreferrer" className="text-primary">Contact Support</a></span>
                            </small>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                    style={{ zIndex: 999 }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default HostelLayout;
