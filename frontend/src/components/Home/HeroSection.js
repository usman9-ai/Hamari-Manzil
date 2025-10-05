import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ onExploreClick, onJoinClick }) => {
  const navigate = useNavigate();
  return (
    <section className="hero-section bg-primary text-white py-5 rounded-3 shadow-sm mb-5">
      <div className="container text-center">
        
            <h1 className="h2 fw-bold mb-3">
              Find Your Perfect Hostel
            </h1>
            <p className="mb-4">
              Discover amazing hostels with Hamari Manzil. 
              Book your next adventure with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="d-flex justify-content-center gap-3">
          <button 
            className="btn btn-light btn-sm"
            onClick={onExploreClick ? onExploreClick : () => navigate('/hostels')} 
          >
            <i className="fas fa-search me-2"></i>
            Explore Hostels
          </button>

          <button 
            className="btn btn-warning btn-sm text-white"
            onClick={onJoinClick ? onJoinClick : () => navigate('/signup')}
          >
            <i className="fas fa-user-plus me-2"></i>
            Join Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
