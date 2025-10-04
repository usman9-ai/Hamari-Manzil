import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="home-header bg-white border-bottom shadow-sm">
      <div className="container-fluid px-3 py-3">
        <div className="d-flex justify-content-between align-items-center">

          {/* Logo + Title */}
          <header className="d-flex align-items-center">
            {/* Logo Icon */}
            <div className="logo-icon me-2">
              <div className="bg-primary rounded" style={{ width: '24px', height: '24px' }}>
              </div>
            </div>
            {/* Site titlle */}
            <h1 className="h5 fw-bold mb-0 text-primary">Hamari Manzil</h1>
          </header>

          {/* Auth Buttons */}
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary btn-sm px-3 py-1" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn btn-primary btn-sm px-2 py-1" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
