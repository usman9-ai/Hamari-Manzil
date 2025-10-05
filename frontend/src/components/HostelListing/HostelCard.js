import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar,FaMapMarkerAlt } from 'react-icons/fa';

const HostelCard = ({ hostel, onFavoriteToggle }) => {
  const [isFavorited, setIsFavorited] = useState(hostel.isFavorited || false);
  const [loading, setLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    if (loading) return;

    const previous = isFavorited;
    setIsFavorited(!previous);
    setLoading(true);

    try {
      const response = await fetch(`/api/hostels/${hostel.id}/favorite/`, {
        method: previous ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsFavorited(previous);
        console.error('Failed to toggle favorite.');
      } else {
        onFavoriteToggle && onFavoriteToggle(hostel.id, !previous);
      }
    } catch (error) {
      setIsFavorited(previous);
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning me-1" />);
    }
    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning me-1" />);
    }
    const totalRendered = fullStars + (halfStar ? 1 : 0);
    for (let i = totalRendered; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-warning me-1" />);
    }
    return stars;
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="position-relative">
        <img
          src={hostel.images?.[0] || '/placeholder-hostel.jpg'}
          alt={hostel.name}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />

        {/* Favorite Button */}
        <button
          type="button"
          className="position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center rounded-circle bg-white border shadow-sm"
          onClick={handleFavoriteToggle}
          disabled={loading}
          aria-pressed={isFavorited}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          style={{ width: 36, height: 36 }}
        >
          {isFavorited ? (
          <FaHeart className="text-danger" style={{ fontSize: '1.0rem' }} />
          ) : (
            <FaRegHeart className="text-muted" style={{ fontSize: '1.0rem' }} />
          )}
        </button>

        {/* Discount Badge */}
        {hostel.discount && (
          <span className="badge bg-success position-absolute top-0 start-0 m-2">
            {hostel.discount}% OFF
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between mb-2">
          <h5 className="card-title fw-semibold mb-0 text-truncate">
            {hostel.name || 'Unknown Hostel'}
          </h5>
          <div className="text-end">
            <div className="d-flex align-items-center">
              {renderStars(hostel.rating || 0)}
              <span className="ms-1 small text-muted">({hostel.reviewCount || 0})</span>
            </div>
          </div>
        </div>

        <p className="text-muted small mb-2">
          <i className="fas fa-map-marker-alt me-1"></i>
          {hostel.location || 'Location not available'}
        </p>

        <div className="mb-3">
          {(hostel.amenities || []).slice(0, 3).map((a, i) => (
            <span key={i} className="badge bg-light text-dark me-1 mb-1">{a}</span>
          ))}
          {hostel.amenities?.length > 3 && (
            <span className="text-muted small">+{hostel.amenities.length - 3} more</span>
          )}
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <small className="text-muted">From</small>
              <div>
                {hostel.originalPrice && hostel.originalPrice > hostel.price && (
                  <span className="text-decoration-line-through text-muted me-1">
                    {hostel.originalPrice}
                  </span>
                )}
                <span className="fw-bold text-primary">{hostel.price || 0}</span>
              </div>
            </div>
            <small className="text-success fw-medium">
              {hostel.availability || 'Available'}
            </small>
          </div>

          <a href={`/hostels/${hostel.id}`} className="btn btn-primary w-100 fw-semibold">
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
