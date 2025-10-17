import React from 'react';
import BoringAvatar from 'boring-avatars';

const ReviewCard = ({ review, onHelpful, onReport }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<i key={i} className="fas fa-star text-warning me-1"></i>);
      else stars.push(<i key={i} className="far fa-star text-warning me-1"></i>);
    }
    return stars;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="card h-100 shadow-sm border-0 d-flex flex-column">
      <div className="card-body d-flex flex-column">
        {/* Avatar and Student Info */}
        <div className="d-flex align-items-center mb-3">
          <BoringAvatar
            size={40}
            name={review.userName}
            variant="bauhaus"
            colors={['#4F46E5', '#6366F1', '#A5B4FC', '#EEF2FF', '#312E81']}
            className="me-3"
          />
          <div>
            <h6 className="mb-0 fw-bold">{review.userName}</h6>
            <small className="text-muted">
              {formatDate(review.date)}
            </small>
          </div>
        </div>

        {/* Review Title & Comment */}
        <h6 className="fw-bold mb-2">{review.title}</h6>
        <p className="text-muted mb-2 flex-grow-1">{review.comment}</p>

        {/* Stars */}
        <div className="mb-2">{renderStars(review.rating)}</div>

        {/* Buttons + Hostel Name */}
        <div className="mt-auto">
          <div className="d-flex gap-2 flex-wrap mb-2">
            <button
              className="btn btn-outline-primary btn-sm flex-grow-1"
              onClick={() => onHelpful?.(review.id)}
              style={{ minHeight: '36px' }}
            >
              <i className="fas fa-thumbs-up me-1"></i>Helpful ({review.helpful})
            </button>
            <button
              className="btn btn-outline-secondary btn-sm flex-grow-1"
              onClick={() => onReport?.(review.id)}
              style={{ minHeight: '36px' }}
            >
              <i className="fas fa-flag me-1"></i>Report
            </button>
          </div>
          <small className="text-muted">{review.hostelName}</small>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
