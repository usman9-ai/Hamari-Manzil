import React from 'react';

const ReviewCard = ({ review, onHelpful, onReport }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star text-warning"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-warning"></i>);
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="col-lg-6 col-md-12 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=007bff&color=fff&size=40`}
                alt={review.userName}
                className="rounded-circle me-3"
                width="40"
                height="40"
              />
              <div>
                <h6 className="mb-0 fw-bold">{review.userName}</h6>
                <small className="text-muted">
                  {formatDate(review.date)}
                  {review.verified && (
                    <span className="ms-2">
                      <i className="fas fa-check-circle text-success"></i>
                      <span className="ms-1 text-success">Verified</span>
                    </span>
                  )}
                </small>
              </div>
            </div>
            <div className="text-end">
              <div className="mb-1">
                {renderStars(review.rating)}
              </div>
              <small className="text-muted">{review.rating}/5</small>
            </div>
          </div>

          <h6 className="fw-bold mb-2">{review.title}</h6>
          <p className="text-muted mb-3">{review.comment}</p>

          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onHelpful?.(review.id)}
              >
                <i className="fas fa-thumbs-up me-1"></i>
                Helpful ({review.helpful})
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onReport?.(review.id)}
              >
                <i className="fas fa-flag me-1"></i>
                Report
              </button>
            </div>
            <small className="text-muted">
              {review.hostelName}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
