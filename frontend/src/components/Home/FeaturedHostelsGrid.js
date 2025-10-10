import React, { useState, useEffect } from 'react';
import HostelCard from '../HostelListing/HostelCard';
import { FaArrowRight } from 'react-icons/fa';
import dummyHostels from '../../data/dummyHostels';

//   hostels - optional array of hostels to display; if not provided, fetch from API or use dummy data
const FeaturedHostelsGrid = ({ hostels }) => {
  const [featuredHostels, setFeaturedHostels] = useState(hostels || []);
  const [loading, setLoading] = useState(!hostels);

  useEffect(() => {
    if (!hostels) {
      fetchFeaturedHostels(); // Fetch if no hostels prop passed
    }
  }, [hostels]);

  // ----- API CALL -----
  const fetchFeaturedHostels = async () => {
    try {
      const response = await fetch('/api/hostels/featured/');
      if (response.ok) {
        const data = await response.json();
        // Some APIs return {results: []}, others just []
        setFeaturedHostels(data.results || data.hostels || data);
      } else {
        // If API fails, use dummy data
        setFeaturedHostels(dummyHostels);
      }
    } catch (error) {
      console.error('Error fetching featured hostels:', error);
      // On Error > still show dummy data
      setFeaturedHostels(dummyHostels);
    } finally {
      setLoading(false);
    }
  };

  // ----- LOADING STATE -----
  if (loading) {
    return (
      <div className="featured-hostels-grid container my-5">
        {/*Section Heading*/}
        <h3 className="fw-bold mb-4 text-center text-primary">Featured Hostels</h3>
        <div className="row justify-content-center">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-4 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="placeholder-glow">
                  <div className="placeholder rounded" style={{ height: '200px' }}></div>
                </div>
                <div className="card-body">
                  <div className="placeholder-glow">
                    <h5 className="placeholder col-8"></h5>
                    <p className="placeholder col-6"></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----- MAIN RENDER -----
  return (
    <div className="featured-hostels-grid container my-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-3 mb-md-0 text-primary">Featured Hostels</h3>
        
        <a href="/hostels" className="btn btn-primary btn-sm text-white d-inline-flex align-items-center px-3 py-2">
          View All Hostels <FaArrowRight className="ms-2" />
        </a>
      </div>
      
      <div className="row">
        {featuredHostels.slice(0, 3).map((hostel) => (
         <div key={hostel.id} className="col-12 col-sm-6 col-lg-4 mb-4">
          <HostelCard
            hostel={{
              ...hostel,
              images: hostel.images || [hostel.image],
            }}
            showFavoriteIcon={true}
          />
        </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedHostelsGrid;
