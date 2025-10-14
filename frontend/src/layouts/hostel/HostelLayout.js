import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HostelLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/hostel/dashboard', icon: 'fa-home', label: 'Dashboard' },
        { path: '/hostel/hostels', icon: 'fa-hotel', label: 'Hostels' },
        { path: '/hostel/rooms', icon: 'fa-bed', label: 'Rooms' },
        { path: '/hostel/reviews', icon: 'fa-star', label: 'Reviews' },
        { 
            path: '/hostel/verification', 
            icon: 'fa-certificate', 
            label: 'Verification',
            submenu: [
                { path: '/hostel/verification', icon: 'fa-dashboard', label: 'Verification Dashboard' },
                { path: '/hostel/user-verification', icon: 'fa-user-check', label: 'User Verification' },
                { path: '/hostel/hostel-verification', icon: 'fa-building', label: 'Hostel Verification' },
                { path: '/hostel/room-verification', icon: 'fa-camera', label: 'Room Verification' },
            ]
        },
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
                        <div className="d-flex align-items-center">
                            <div
                                className="bg-primary rounded d-flex align-items-center justify-content-center me-2"
                                style={{ width: '40px', height: '40px' }}
                            >
                                <i className="fas fa-hotel text-white"></i>
                            </div>
                            <div>
                                <h5 className="mb-0 fw-bold text-primary">Hamari Manzil</h5>
                                <small className="text-muted">Hostel Portal</small>
                            </div>
                        </div>
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
                        <div key={item.path} className="mb-2">
                            <button
                                onClick={() => navigate(item.path)}
                                className={`btn w-100 text-start d-flex align-items-center ${isActive(item.path)
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
                            
                            {/* Submenu */}
                            {item.submenu && (
                                <div className="ms-4 mt-2">
                                    {item.submenu.map((subItem) => (
                                        <button
                                            key={subItem.path}
                                            onClick={() => navigate(subItem.path)}
                                            className={`btn w-100 text-start d-flex align-items-center ${isActive(subItem.path)
                                                ? 'btn-primary text-white'
                                                : 'btn-link text-dark text-decoration-none'
                                                }`}
                                            style={{
                                                borderRadius: '8px',
                                                padding: '8px 12px',
                                                fontSize: '14px',
                                                fontWeight: isActive(subItem.path) ? '600' : '500',
                                                backgroundColor: isActive(subItem.path) ? undefined : 'transparent',
                                            }}
                                        >
                                            <i className={`fas ${subItem.icon} me-2`} style={{ width: '16px' }}></i>
                                            <span>{subItem.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="mt-auto p-3 border-top" style={{ borderColor: '#dee2e6' }}>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger w-100"
                        style={{ borderRadius: '10px' }}
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
                                <div className="dropdown">
                                    <button
                                        className="btn btn-link text-dark dropdown-toggle d-flex align-items-center text-decoration-none"
                                        type="button"
                                        id="userMenu"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
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
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                                        <li>
                                            <button className="dropdown-item" onClick={() => navigate('/hostel/profile')}>
                                                <i className="fas fa-user me-2"></i>
                                                Profile
                                            </button>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                                <i className="fas fa-sign-out-alt me-2"></i>
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
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
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                © {new Date().getFullYear()} Hamari Manzil. All rights reserved.
                            </small>
                            <small className="text-muted">
                                Need help? <a href="/support" className="text-primary">Contact Support</a>
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
