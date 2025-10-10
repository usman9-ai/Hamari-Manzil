import React from 'react';
import { Link } from 'react-router-dom';

const WishlistCard = ({ hostel, onRemoveFromWishlist, addedDate }) => {
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveFromWishlist?.(hostel.id);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card shadow-sm border-0 wishlist-card w-100 h-100" style={{ height: 'auto', cursor: 'pointer' }}>
      <div className="position-relative">
        <img
          src={hostel.images[0] || '/hostel1.jpeg'}
          className="card-img-top"
          alt={hostel.name}
          style={{ height: '180px', objectFit: 'cover' }}
        />

        {/* Wishlist / Favorite Icon (like HostelCard) */}
        <button
          onClick={handleRemove}
          className="position-absolute top-0 end-0 m-2 btn btn-sm btn-light rounded-circle shadow-sm"
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Remove from wishlist"
        >
          <i className="fas fa-heart text-danger" />
        </button>

        {/* Location Badge like HostelCard */}
        <div className="position-absolute bottom-0 start-0 m-2">
          <span className="badge bg-primary">
            <i className="fas fa-map-marker-alt me-1"></i>
            {hostel.location}
          </span>
        </div>
      </div>

      <div className="card-body">
        <h5 className="card-title fw-bold mb-2">{hostel.name}</h5>
        <p className="card-text text-muted small mb-2">
          {hostel.description || 'A comfortable stay with modern amenities.'}
        </p>

        {/* Amenities like WishlistCard */}
        <div className="d-flex flex-wrap gap-1 mb-2">
          {hostel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="badge bg-light text-dark border">
              {amenity}
            </span>
          ))}
          {hostel.amenities.length > 3 && (
            <span className="badge bg-light text-dark border">
              +{hostel.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="d-flex align-items-center mb-2">
          <div className="me-2">{renderStars(hostel.rating)}</div>
          <span className="text-muted small">
            {hostel.rating} ({hostel.totalReviews} reviews)
          </span>
        </div>

        {/* Added Date */}
        <small className="text-muted d-block mb-2">
          <i className="fas fa-heart me-1"></i>
          Added on {formatDate(addedDate)}
        </small>

        {/* Price and Action */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            <span className="h5 text-primary fw-bold mb-0">
              PKR {hostel.price.toLocaleString()}
            </span>
            <small className="text-muted d-block">per month</small>
          </div>
          <Link to={`/student/hostel-details/${hostel.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
