import React, { useState } from 'react';

const HostelCard = ({ hostel, onFavoriteToggle }) => {
  const [isFavorited, setIsFavorited] = useState(hostel.isFavorited || false);
  const [loading, setLoading] = useState(false);

  // ----- Favorite Toggle Handler -----
  const handleFavoriteToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/hostels/${hostel.id}/favorite/`, {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setIsFavorited(!isFavorited);
        onFavoriteToggle && onFavoriteToggle(hostel.id, !isFavorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  // ----- Render Rating Stars -----
  const renderStars = (rating = 0) => {
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

  return (
    <div className="col-12 mb-4">
      <div className="card hostel-card shadow-sm hover-shadow transition">
        <div className="position-relative">

          {/*Placeholder image*/}
          <img
            src={hostel.images?.[0] || '/placeholder-hostel.jpg'}
            className="card-img-top"
            alt={hostel.name}
            style={{ height: '200px', objectFit: 'cover' }}
          />

          {/*Favorite Button*/}
          <button
            className={`btn btn-sm position-absolute top-0 end-0 m-2 ${
              isFavorited ? 'btn-danger' : 'btn-outline-light'
            }`}
            onClick={handleFavoriteToggle}
            disabled={loading}
          >
            <i className={`${isFavorited ? 'fas' : 'far'} fa-heart`}></i>
          </button>

          {/*Discount Badge*/}
          {hostel.discount && (
            <span className="badge bg-success position-absolute top-0 start-0 m-2">
              {hostel.discount}% OFF
            </span>
          )}
        </div>

        <div className="card-body d-flex flex-column">

          {/* Title + Rating */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title fw-semibold mb-0 flex-grow-1">{hostel.name || 'Unknown Hostel'}{/*Fallback name */}</h5>
            <div className="text-end">
              <div className="d-flex align-items-center mb-1">
                {renderStars(hostel.rating || 0)} {/* Default rating*/}
                <span className="ms-1 text-muted small">({hostel.reviewCount || 0 }) {/*Default reviews*/}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <p className="text-muted small mb-2">
            <i className="fas fa-map-marker-alt me-1"></i>
            {hostel.location}
          </p>

          {/* Amenities*/}
          <div className="amenities mb-3 text-wrap">
            {hostel.amenities?.slice(0, 3).map((amenity, index) => (
              <span key={index} className="badge bg-light text-dark me-1 mb-1">
                {amenity}
              </span>
            ))}
            {hostel.amenities?.length > 3 && (
              <span className="text-muted small">+{hostel.amenities.length - 3} more</span>
            )}
          </div>

          {/* Pricing + Availability */}
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <span className="text-muted small">From</span>
                <div className="d-flex align-items-baseline">
                  {hostel.originalPrice && hostel.originalPrice > hostel.price && (
                    <span className="text-muted text-decoration-line-through me-1">
                      {hostel.originalPrice}
                    </span>
                  )}
                  <span className="h5 fw-bold text-primary mb-0">{hostel.price || 0} {/* Default price */}</span>
                  <span className="text-muted small"></span>
                </div>
              </div>
              <div className="text-end">
                <div className="text-success small fw-medium">
                  {hostel.availability || 'Available'} {/* Default availability */}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="d-grid gap-2">
              <a
                href={`/hostels/${hostel.id}`}
                className="btn btn-primary"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
