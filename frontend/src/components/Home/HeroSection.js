import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUserPlus } from 'react-icons/fa';

const HeroSection = ({ onExploreClick, onJoinClick }) => {
  const navigate = useNavigate();

  return (
    <section className="hero-section bg-primary text-white py-5 py-lg-6 rounded-3 shadow-sm mb-5 text-center">
      <div className="container text-center px-3">
        
            <h1 className="fw-bold mb-3 display-6 display-md-5 display-lg-4">
              Find Your Perfect Hostel
            </h1>

            <p className="lead mb-4 text-light opacity-90 fs-6 fs-md-5">
              Discover amazing hostels with Hamari Manzil. 
              <br className='d-none d-md-block'/>
              Book your next adventure with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
          <button 
            className="btn btn-light btn-lg px-5 py-2 fw-semibold shadow-sm explore-btn"
            onClick={onExploreClick ? onExploreClick : () => navigate('/hostels')} 
          >
            <FaSearch className="me-2" />
            Explore Hostels
          </button>

          <button 
            className="btn btn-warning btn-md px-4 fw-semibold text-white join-btn"
            onClick={onJoinClick ? onJoinClick : () => navigate('/signup')}
          >
            <FaUserPlus className="me-2" />
            Join Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
