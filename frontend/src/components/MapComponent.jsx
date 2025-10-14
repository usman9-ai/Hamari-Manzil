import React, { useEffect, useRef } from 'react';

const MapComponent = ({ hostels, selectedHostelId, onHostelSelect }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize map
    const initMap = () => {
      if (!mapRef.current) return;

      // Create a simple map representation using CSS
      // In a real application, you would use Google Maps, Leaflet, or similar
      const mapContainer = mapRef.current;
      
      // Clear existing markers
      markersRef.current.forEach(marker => {
        if (marker.parentNode) {
          marker.parentNode.removeChild(marker);
        }
      });
      markersRef.current = [];

      // Create markers for each hostel
      hostels.forEach((hostel, index) => {
        const marker = document.createElement('div');
        marker.className = `map-marker ${selectedHostelId === hostel.id ? 'selected' : ''}`;
        marker.style.cssText = `
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: ${selectedHostelId === hostel.id ? '#007bff' : '#dc3545'};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          left: ${20 + (index * 15)}%;
          top: ${30 + (index * 10)}%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;
        
        marker.title = hostel.name;
        marker.addEventListener('click', () => {
          onHostelSelect?.(hostel.id);
        });
        
        mapContainer.appendChild(marker);
        markersRef.current.push(marker);
      });
    };

    initMap();
  }, [hostels, selectedHostelId, onHostelSelect]);

  return (
    <div className="map-component">
      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">
            <i className="fas fa-map-marker-alt me-2"></i>
            Hostel Locations
          </h6>
        </div>
        <div className="card-body p-0">
          <div
            ref={mapRef}
            className="map-container position-relative"
            style={{
              height: '400px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
              `,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Map overlay with city names */}
            <div className="position-absolute" style={{ top: '20%', left: '15%' }}>
              <span className="badge bg-white text-dark shadow">Lahore</span>
            </div>
            <div className="position-absolute" style={{ top: '60%', left: '70%' }}>
              <span className="badge bg-white text-dark shadow">Karachi</span>
            </div>
            <div className="position-absolute" style={{ top: '40%', left: '50%' }}>
              <span className="badge bg-white text-dark shadow">Islamabad</span>
            </div>
            
            {/* Legend */}
            <div className="position-absolute bottom-0 start-0 m-3">
              <div className="bg-white rounded p-2 shadow-sm">
                <small className="text-muted d-block mb-1">Legend:</small>
                <div className="d-flex align-items-center mb-1">
                  <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#007bff', borderRadius: '50%' }}></div>
                  <small>Selected</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#dc3545', borderRadius: '50%' }}></div>
                  <small>Available</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <small className="text-muted">
            <i className="fas fa-info-circle me-1"></i>
            Click on markers to view hostel details
          </small>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
