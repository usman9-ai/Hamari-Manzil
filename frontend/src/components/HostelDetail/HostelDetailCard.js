import React, { useState, useEffect } from 'react';

const HostelDetailCard = ({ hostelId, hostel }) => {
  const [hostelData, setHostelData] = useState(hostel || null);
  const [loading, setLoading] = useState(!hostel);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!hostel && hostelId) {
      fetchHostelDetails();
    }
    if (hostel) {
      setIsFavorited(hostel.isFavorited || false);
    }
  }, [hostelId, hostel]);

  const fetchHostelDetails = async () => {
    try {
      const response = await fetch(`/api/hostels/${hostelId}/`);
      if (response.ok) {
        const data = await response.json();
        setHostelData(data);
        setIsFavorited(data.isFavorited || false);
      }
    } catch (error) {
      console.error('Error fetching hostel details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const response = await fetch(`/api/hostels/${hostelData.id}/favorite/`, {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setIsFavorited(!isFavorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-warning"></i>);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="card hostel-detail-card mb-4">
        <div className="card-body">
          <div className="placeholder-glow">
            <h1 className="placeholder col-8"></h1>
            <p className="placeholder col-6"></p>
            <div className="placeholder col-12" style={{ height: '100px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hostelData) {
    return (
      <div className="alert alert-danger">
        Hostel not found
      </div>
    );
  }

  return (
    <div className="card hostel-detail-card mb-4 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h1 className="h3 fw-bold mb-2">{hostelData.name}</h1>
            <div className="d-flex align-items-center mb-2">
              <div className="me-3">
                {renderStars(hostelData.rating)}
                <span className="ms-2 fw-medium">{hostelData.rating}</span>
                <span className="text-muted ms-1">({hostelData.reviewCount} reviews)</span>
              </div>
              {hostelData.verified && (
                <span className="badge bg-success">
                  <i className="fas fa-check-circle me-1"></i>
                  Verified
                </span>
              )}
            </div>
            <p className="text-muted mb-0">
              <i className="fas fa-map-marker-alt me-2"></i>
              {hostelData.address}
            </p>
          </div>
          <div className="text-end">
            <button
              className={`btn ${isFavorited ? 'btn-danger' : 'btn-outline-danger'} mb-2`}
              onClick={handleFavoriteToggle}
            >
              <i className={`${isFavorited ? 'fas' : 'far'} fa-heart me-1`}></i>
              {isFavorited ? 'Saved' : 'Save'}
            </button>
            <div className="price-display">
              <div className="text-muted small">From</div>
              <div className="d-flex align-items-baseline">
                {hostelData.originalPrice && hostelData.originalPrice > hostelData.price && (
                  <span className="text-muted text-decoration-line-through me-2">
                    ${hostelData.originalPrice}
                  </span>
                )}
                <span className="h4 fw-bold text-primary">${hostelData.price}</span>
                <span className="text-muted">/night</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hostel-highlights mb-4">
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <div className="highlight-item text-center p-3 bg-light rounded">
                <i className="fas fa-bed text-primary fa-2x mb-2"></i>
                <div className="fw-medium">{hostelData.totalBeds || 'N/A'}</div>
                <div className="text-muted small">Total Beds</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="highlight-item text-center p-3 bg-light rounded">
                <i className="fas fa-door-open text-primary fa-2x mb-2"></i>
                <div className="fw-medium">{hostelData.roomTypes?.length || 0}</div>
                <div className="text-muted small">Room Types</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="highlight-item text-center p-3 bg-light rounded">
                <i className="fas fa-wifi text-primary fa-2x mb-2"></i>
                <div className="fw-medium">Free</div>
                <div className="text-muted small">WiFi</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="highlight-item text-center p-3 bg-light rounded">
                <i className="fas fa-clock text-primary fa-2x mb-2"></i>
                <div className="fw-medium">24/7</div>
                <div className="text-muted small">Reception</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hostel-description mb-4">
          <h5 className="fw-semibold mb-3">About this hostel</h5>
          <p className="text-muted">{hostelData.description}</p>
        </div>

        <div className="amenities-section mb-4">
          <h5 className="fw-semibold mb-3">Amenities</h5>
          <div className="row">
            {hostelData.amenities?.map((amenity, index) => (
              <div key={index} className="col-md-4 col-6 mb-2">
                <div className="d-flex align-items-center">
                  <i className="fas fa-check text-success me-2"></i>
                  <span>{amenity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="policies-section">
          <h5 className="fw-semibold mb-3">House Rules</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="policy-item mb-2">
                <strong>Check-in:</strong> {hostelData.checkInTime || '3:00 PM'}
              </div>
              <div className="policy-item mb-2">
                <strong>Check-out:</strong> {hostelData.checkOutTime || '11:00 AM'}
              </div>
              <div className="policy-item mb-2">
                <strong>Age restriction:</strong> {hostelData.ageRestriction || '18+'}
              </div>
            </div>
            <div className="col-md-6">
              <div className="policy-item mb-2">
                <strong>Smoking:</strong> {hostelData.smokingPolicy || 'Not allowed'}
              </div>
              <div className="policy-item mb-2">
                <strong>Pets:</strong> {hostelData.petPolicy || 'Not allowed'}
              </div>
              <div className="policy-item mb-2">
                <strong>Parties:</strong> {hostelData.partyPolicy || 'Not allowed'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailCard;
