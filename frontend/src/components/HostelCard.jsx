import React from 'react';
import { useNavigate } from 'react-router-dom';

const HostelCard = ({
  hostel,
  isInWishlist = false,
  onAddToWishlist = () => {},
  onRemoveFromWishlist = () => {},
}) => {
  const navigate = useNavigate();

  // Navigate to hostel details
  const handleViewDetails = () => {
    navigate(`/student/hostel-details/${hostel.id}`);
  };

  // Toggle wishlist
  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      onRemoveFromWishlist(hostel.id);
    } else {
      onAddToWishlist(hostel.id);
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


  return (
    <div
      className="card hostel-card mb-3 shadow-sm  border-0 h-100"
      style={{
        cursor: 'pointer',
        height: 'auto'
      }}
      onClick={handleViewDetails}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* ===== Image Section ===== */}
      <div className="position-relative">
        <img
          src={
            hostel.images && hostel.images.length > 0
              ? hostel.images[0]
              : '/images/default-hostel.jpg'
          }
          alt={hostel.name}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
        />

        {/* Verified Badge */}
        {hostel.verified && (
          <span className="badge bg-success position-absolute top-0 start-0 m-2">Verified</span>
        )}

        {/* Wishlist Icon */}
        <button
          onClick={toggleWishlist}
          className="position-absolute top-0 end-0 m-2 btn btn-sm btn-light rounded-circle shadow-sm"
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i className={isInWishlist ? 'fas fa-heart text-danger' : 'far fa-heart text-muted'} />
        </button>

        {/* Location */}
        <div className="position-absolute bottom-0 start-0 m-2">
          <span className="badge bg-primary">
            <i className="fas fa-map-marker-alt me-1"></i>
            {hostel.location}
          </span>
        </div>
      </div>

      {/* ===== Card Body ===== */}
      <div className="card-body">
        <h5 className="card-title fw-bold mb-2">{hostel.name}</h5>

        {/* Description */}
        <p
          className="card-text text-muted small mb-2"
          style={{
            minHeight: '44px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {hostel.description || 'A comfortable place for students and professionals.'}
        </p>

        {/* Amenities */}
        <div className="d-flex flex-wrap gap-1 mb-2">
          {(hostel.amenities || []).slice(0, 3).map((amenity, index) => (
            <span key={index} className="badge bg-light text-dark border">
              {amenity}
            </span>
          ))}
          {(hostel.amenities || []).length > 3 && (
            <span className="badge bg-light text-dark border">
              +{hostel.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="d-flex align-items-center mb-2">
          <div className="me-2">{renderStars(hostel.rating)}</div>
          <span className="text-muted small">
            {hostel.rating ?? 'No rating'} ({hostel.totalReviews ?? 0} reviews)
          </span>
        </div>

        {/* ===== Footer: Price + Button ===== */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            <span className="h5 text-primary fw-bold mb-0">
              PKR {Number(hostel.price).toLocaleString()}
            </span>
            <small className="text-muted d-block">per month</small>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
