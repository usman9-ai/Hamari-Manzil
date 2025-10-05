import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; 
import { Offcanvas } from 'react-bootstrap';

const HomeHeader = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
    <header className="home-header bg-white border-bottom shadow-sm py-3">
      <div className="container-fluid px-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap">

          {/* Logo + Title */}
          <div className="d-flex align-items-center">
            {/* Logo Icon */}
            <div className="logo-icon me-2">
              <div className="bg-primary text-light fw-bold rounded-circle d-flex justify-content-center align-items-center me-2" style={{ width: '40px', height: '40px' }}>
                H
              </div>
            </div>
            {/* Site title */}
            <h1 className="fw-bold mb-0 text-primary fs-4">Hamari Manzil</h1>
          </div>

            {/* Added navigation links for larger screens */}
          <nav className="d-none d-lg-flex align-items-center gap-4 ">
            <a href="/" className="text-primary text-decoration-none fw-semibold hover-link">Home</a>
            <a href="/hostels" className="text-primary text-decoration-none fw-semibold hover-link">Hostels</a>
            <a href="/about" className="text-primary text-decoration-none fw-semibold hover-link">About</a>
            <a href="/contact" className="text-primary text-decoration-none fw-semibold hover-link">Contact</a>
          </nav>

          {/* Auth Buttons */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            <button className="btn btn-outline-primary btn-sm px-4 fw-semibold uniform-btn" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn btn-primary btn-sm px-3 fw-semibold uniform-btn" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>

          {/* --- Mobile Menu Button --- */}
            <button className="btn d-lg-none border-0 ms-auto p-2" onClick={() => setShowMenu(true)}>
            <FaBars style={{ color: 'var(--primary)', fontSize: '1.4rem' }} />
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Offcanvas Menu */}
    <Offcanvas
        show={showMenu}
        onHide={() => setShowMenu(false)}
        placement="end"
        className="mobile-menu"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold text-primary">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <nav className="d-flex flex-column gap-3">
            <a href="/" className="text-decoration-none text-dark fw-semibold" onClick={() => setShowMenu(false)}>Home</a>
            <a href="/hostels" className="text-decoration-none text-dark fw-semibold" onClick={() => setShowMenu(false)}>Hostels</a>
            <a href="/about" className="text-decoration-none text-dark fw-semibold" onClick={() => setShowMenu(false)}>About</a>
            <a href="/contact" className="text-decoration-none text-dark fw-semibold" onClick={() => setShowMenu(false)}>Contact</a>
          </nav>
          <hr />
          <div className="d-flex flex-column gap-2 mt-3">
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => {
                navigate('/login');
                setShowMenu(false);
              }}
            >
              Login
            </button>
            <button
              className="btn btn-primary w-100"
              onClick={() => {
                navigate('/signup');
                setShowMenu(false);
              }}
            >
              Sign Up
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default HomeHeader;
