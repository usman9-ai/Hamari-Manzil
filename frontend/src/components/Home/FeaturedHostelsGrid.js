import React, { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import HostelCard from '../../components/HostelCard';
import { hostels } from '../../data/hostels'; // using same data as dashboard

const FeaturedHostelsGrid = () => {
  const [featuredHostels, setFeaturedHostels] = useState([]);

  useEffect(() => {
    setFeaturedHostels(hostels);
  }, []);

  return (
    <div className="featured-hostels-grid container my-5">
      {/* ---- Section Header ---- */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-3 mb-md-0 text-primary">Featured Hostels</h3>
        <a
          href="/hostels"
          className="btn btn-primary btn-sm text-white d-inline-flex align-items-center px-3 py-2"
        >
          View All Hostels <FaArrowRight className="ms-2" />
        </a>
      </div>

      {/* ---- Hostels Grid ---- */}
      <div className="row g-4 justify-content-center">
        {featuredHostels && featuredHostels.length > 0 ? (
          featuredHostels.slice(0, 3).map((hostel) => (
            <div key={hostel.id} className="col-12 col-sm-6 col-lg-4">
              {/* ✅ Removed extra Bootstrap col from HostelCard */}
              <HostelCard
                hostel={{
                  ...hostel,
                  images: hostel.images || [hostel.image],
                }}
                showFavoriteIcon={true}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No featured hostels available</h5>
          </div>
        )}
      </div>

      {/* Custom Styling */}
      <style>
        {`
          .featured-hostels-grid .hostel-card {
            min-height: 480px !important;
            border-radius: 12px;
            width: 100%;
          }

          .featured-hostels-grid .hostel-card img {
            height: 250px !important;
            object-fit: cover;
          }

          .featured-hostels-grid .card-body {
            padding: 1.2rem !important;
          }

          @media (min-width: 992px) {
            .featured-hostels-grid .col-lg-4 {
              display: flex;
              justify-content: center;
            }
            .featured-hostels-grid .hostel-card {
              max-width: 370px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FeaturedHostelsGrid;
