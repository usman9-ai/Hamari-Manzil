import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

// FooterNav component: Displays footer with brand info, quick links, and social icons
const FooterNav = () => {
  return (
    <footer className="bg-white text-primary rounded-3 shadow-sm p-4 my-4">
      <div className="container">

        {/* ----- Footer Content Row ----- */}
        <div className="row g-4 align-items-start text-center text-md-start">

          {/* ----- Brand & About ----- */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold mb-2">Hamari Manzil</h5>
            <p className="text-primary small">
              Find your perfect hostel easily and book with confidence.
            </p>
          </div>

          {/* ----- Quick Links ----- */}
          <div className="col-12 col-md-4">
            <h6 className="fw-bold mb-2">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              {[
                { name: 'Hostels', href: '/hostels' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Privacy Policy', href: '/privacy' },
              ].map((link, index) => (
                <li key={index} className="mb-1">
                  <a
                    href={link.href}
                    className="text-primary text-decoration-none fw-medium"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ----- Social Media ----- */}
          <div className="col-12 col-md-4 text-md-start text-center">
            <h6 className="fw-bold mb-2">Follow Us</h6>

              <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-2">
              {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-primary fs-5 d-flex align-items-center justify-content-center border-rounded-circle"
                  style={{
                    width: '38px',
                    height: '38px',
                    transition: 'all 0.3s ease',
                    borderColor: '#0d6efd',
                  }}
                  
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.15)';
                    e.currentTarget.style.backgroundColor = '#0d6efd';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#0d6efd';
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ----- Divider ----- */}
        <hr className="bg-secondary mt-4" />

        {/* ----- Copyright ----- */}
        <div className="text-center text-primary small mt-3">
          &copy; {new Date().getFullYear()} Hamari Manzil. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterNav;
