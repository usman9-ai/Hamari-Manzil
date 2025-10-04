import React, { useState, useEffect } from 'react';
import HostelCard from '../HostelListing/HostelCard';
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
      <div className="featured-hostels-grid">
        {/*Section Heading*/}
        <h3 className="fw-bold mb-4">Featured Hostels</h3>
        <div className="row">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card">
                <div className="placeholder-glow">
                  <div className="placeholder" style={{ height: '200px' }}></div>
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
    <div className="featured-hostels-grid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Featured Hostels</h3>
        
        <a href="/hostels" className="btn btn-primary btn-sm text-white d-inline-flex align-items-center">
          View All Hostels <i className="fas fa-arrow-right ms-1"></i>
        </a>
      </div>
      
      <div className="row">
        {featuredHostels.slice(0, 3).map((hostel) => (
         
          <HostelCard
            key={hostel.id}
            hostel={{
              ...hostel,
              images: hostel.images || [hostel.image],
            }}
            showFavoriteIcon={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedHostelsGrid;
