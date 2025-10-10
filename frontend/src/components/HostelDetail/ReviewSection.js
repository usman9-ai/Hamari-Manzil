import React, { useState, useEffect } from 'react';

const ReviewSection = ({ hostelId, reviews }) => {
  const [reviewData, setReviewData] = useState(reviews || []);
  const [loading, setLoading] = useState(!reviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    if (!reviews) {
      fetchReviews();
    }
  }, [hostelId, reviews]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/hostels/${hostelId}/reviews/`);
      if (response.ok) {
        const data = await response.json();
        setReviewData(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/hostels/${hostelId}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newReview)
      });
      
      if (response.ok) {
        const review = await response.json();
        setReviewData(prev => [review, ...prev]);
        setNewReview({ rating: 5, title: '', comment: '' });
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`${i <= rating ? 'fas' : 'far'} fa-star text-warning ${
            interactive ? 'cursor-pointer' : ''
          }`}
          onClick={interactive && onRatingChange ? () => onRatingChange(i) : undefined}
        ></i>
      );
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

  const calculateRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewData.forEach(review => {
      breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
    });
    return breakdown;
  };

  const ratingBreakdown = calculateRatingBreakdown();
  const totalReviews = reviewData.length;
  const averageRating = totalReviews > 0 
    ? (reviewData.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="card review-section mb-4">
        <div className="card-body">
          <div className="placeholder-glow">
            <h5 className="placeholder col-4"></h5>
            <div className="placeholder col-8"></div>
            <div className="placeholder col-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card review-section mb-4 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-semibold mb-0">
            Reviews ({totalReviews})
          </h5>
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            <i className="fas fa-plus me-1"></i>
            Write Review
          </button>
        </div>

        {totalReviews > 0 && (
          <div className="rating-summary mb-4 p-3 bg-light rounded">
            <div className="row align-items-center">
              <div className="col-md-4 text-center">
                <div className="display-4 fw-bold text-primary">{averageRating}</div>
                <div className="mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-muted">Based on {totalReviews} reviews</div>
              </div>
              <div className="col-md-8">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="d-flex align-items-center mb-1">
                    <span className="me-2">{rating}</span>
                    <i className="fas fa-star text-warning me-2"></i>
                    <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-warning"
                        style={{
                          width: `${totalReviews > 0 ? (ratingBreakdown[rating] / totalReviews) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-muted small">{ratingBreakdown[rating]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showReviewForm && (
          <div className="review-form mb-4 p-3 border rounded">
            <h6 className="fw-semibold mb-3">Write a Review</h6>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Rating</label>
                <div className="rating-input">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="reviewTitle" className="form-label fw-medium">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="reviewTitle"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summarize your experience"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="reviewComment" className="form-label fw-medium">Review</label>
                <textarea
                  className="form-control"
                  id="reviewComment"
                  rows="4"
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with other travelers"
                  required
                ></textarea>
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="reviews-list">
          {reviewData.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-comments fa-3x text-muted mb-3"></i>
              <h6 className="text-muted">No reviews yet</h6>
              <p className="text-muted">Be the first to share your experience!</p>
            </div>
          ) : (
            reviewData.map((review) => (
              <div key={review.id} className="review-item border-bottom pb-3 mb-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center">
                    <img
                      src={review.user?.avatar || '/default-avatar.png'}
                      alt={review.user?.name}
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <div>
                      <h6 className="mb-0 fw-medium">{review.user?.name}</h6>
                      <small className="text-muted">{formatDate(review.createdAt)}</small>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="mb-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                
                <h6 className="fw-medium mb-2">{review.title}</h6>
                <p className="text-muted mb-0">{review.comment}</p>
                
                {review.helpful > 0 && (
                  <div className="mt-2">
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="fas fa-thumbs-up me-1"></i>
                      Helpful ({review.helpful})
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {reviewData.length > 5 && (
          <div className="text-center">
            <button className="btn btn-outline-primary">
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
