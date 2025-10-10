import React from 'react';

const CallToActionCard = ({ onGetStarted }) => {
  return (
    <div className="call-to-action-card bg-primary bg-gradient text-white rounded-3 shadow-sm p-4 mb-4 text-center">
      
      {/* Center the content using a flex container */}
      <div className="d-flex flex-column align-items-center px-2">

        {/* Heading */}
        <h3 className="fw-bold mb-3">Ready for Your Next Adventure?</h3>

        {/* Subtext */}
        <p className="lead mb-4 mx-auto">
          Join thousands of students who trust Hamari Manzil for their accommodation needs. 
          Book and explore with confidence.
        </p>

        {/* Buttons */}
        <div className="d-flex gap-2 mb-4 justify-content-center flex-wrap">
          <button 
            className="btn btn-light btn-lg fw-semibold transition"
            style={{ transition: 'all 0.3s ease', transformOrigin: 'center' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
            onClick={onGetStarted}
          >
            <i className="fas fa-rocket me-2"></i>
            Get Started
          </button>
          
          <button className="btn btn-outline-light btn-lg fw-semibold transition"
          style={{ transition: 'all 0.3s ease', transformOrigin: 'center' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
          >
            <i className="fas fa-play me-2"></i>
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="cta-stats w-100">
          <div className="row text-center gy-3">
            <div className="col-4 d-flex flex-column align-items-center">
              <i className="fas fa-smile-beam text-warning mb-2 fs-4"></i>
              <h4 className="fw-bold mb-0">10K+</h4>
              <small>Happy Students</small>
            </div>
            <div className="col-4 d-flex flex-column align-items-center">
              <i className="fas fa-hotel text-warning mb-2 fs-4"></i>
              <h4 className="fw-bold mb-0">500+</h4>
              <small>Hostels</small>
            </div>
            <div className="col-4 d-flex flex-column align-items-center">
              <i className="fas fa-city text-warning mb-2 fs-4"></i>
              <h4 className="fw-bold mb-0">50+</h4>
              <small>Cities</small>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CallToActionCard;
