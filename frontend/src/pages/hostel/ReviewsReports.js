import React, { useState, useEffect } from 'react';
import { getReviews, respondToReview } from '../../actions/hostelActions';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const ReviewsReports = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseText, setResponseText] = useState({});
    const [respondingTo, setRespondingTo] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const reviewsRes = await getReviews();
            if (reviewsRes.success) setReviews(reviewsRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespondToReview = async (reviewId) => {
        const response = responseText[reviewId];
        if (!response || !response.trim()) {
            alert('Please enter a response');
            return;
        }

        try {
            const result = await respondToReview(reviewId, response);
            if (result.success) {
                alert('Response added successfully');
                setRespondingTo(null);
                setResponseText(prev => ({ ...prev, [reviewId]: '' }));
                loadData(); // Reload data
            } else {
                alert(result.message || 'Failed to add response');
            }
        } catch (error) {
            console.error('Error responding to review:', error);
            alert('An error occurred');
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="d-inline-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <i
                        key={star}
                        className={`fas fa-star ${star <= rating ? 'text-warning' : 'text-muted'}`}
                    ></i>
                ))}
            </div>
        );
    };


    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Page Header */}
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Reviews</h1>
                <p className="text-muted">View and respond to student reviews</p>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Total Reviews</p>
                                    <h2 className="h3 fw-bold mb-0">{reviews.length}</h2>
                                </div>
                                <div className="bg-warning bg-opacity-10 rounded p-2">
                                    <i className="fas fa-star text-warning fs-4"></i>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Average Rating</p>
                                    <h2 className="h3 fw-bold mb-0">
                                        {reviews.length > 0
                                            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                            : '0.0'}
                                    </h2>
                                </div>
                                <div className="bg-success bg-opacity-10 rounded p-2">
                                    <i className="fas fa-chart-line text-success fs-4"></i>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Pending Responses</p>
                                    <h2 className="h3 fw-bold mb-0">
                                        {reviews.filter(r => !r.ownerResponse).length}
                                    </h2>
                                </div>
                                <div className="bg-info bg-opacity-10 rounded p-2">
                                    <i className="fas fa-reply text-info fs-4"></i>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Reviews List */}
            <div>
                {reviews.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-5">
                            <i className="fas fa-star fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">No reviews yet</h5>
                            <p className="text-muted mb-0">Student reviews will appear here</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="row g-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="col-12">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="row">
                                            <div className="col-md-8">
                                                {/* Review Header */}
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <h5 className="mb-1">{review.studentName}</h5>
                                                        <div className="text-muted small">
                                                            {renderStars(review.rating)}
                                                            <span className="ms-2">• {review.createdAt}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Hostel Name */}
                                                <div className="mb-2">
                                                    <Badge variant="primary">{review.hostelName}</Badge>
                                                </div>

                                                {/* Review Comment */}
                                                <p className="text-dark mb-3">{review.comment}</p>

                                                {/* Owner Response */}
                                                {review.ownerResponse && (
                                                    <div className="bg-light rounded p-3 mb-3">
                                                        <div className="d-flex align-items-start">
                                                            <div className="bg-primary rounded-circle p-2 me-2">
                                                                <i className="fas fa-user text-white"></i>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="fw-semibold mb-1">Your Response</div>
                                                                <p className="mb-1">{review.ownerResponse}</p>
                                                                <small className="text-muted">{review.respondedAt}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Response Form */}
                                                {!review.ownerResponse && respondingTo === review.id && (
                                                    <div className="mt-3">
                                                        <textarea
                                                            className="form-control mb-2"
                                                            rows="3"
                                                            placeholder="Write your response..."
                                                            value={responseText[review.id] || ''}
                                                            onChange={(e) =>
                                                                setResponseText(prev => ({
                                                                    ...prev,
                                                                    [review.id]: e.target.value
                                                                }))
                                                            }
                                                        ></textarea>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleRespondToReview(review.id)}
                                                            >
                                                                <i className="fas fa-paper-plane me-2"></i>
                                                                Submit Response
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={() => {
                                                                    setRespondingTo(null);
                                                                    setResponseText(prev => ({ ...prev, [review.id]: '' }));
                                                                }}
                                                            >
                                                                <i className="fas fa-times me-2"></i>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Respond Button */}
                                                {!review.ownerResponse && respondingTo !== review.id && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => setRespondingTo(review.id)}
                                                    >
                                                        <i className="fas fa-reply me-2"></i>
                                                        Respond
                                                    </button>
                                                )}
                                            </div>

                                            {/* Rating Circle */}
                                            <div className="col-md-4 d-flex justify-content-center align-items-center">
                                                <div className="text-center">
                                                    <div
                                                        className="rounded-circle bg-warning bg-opacity-10 d-flex justify-content-center align-items-center"
                                                        style={{ width: '100px', height: '100px' }}
                                                    >
                                                        <div>
                                                            <div className="h1 fw-bold mb-0 text-warning">{review.rating}.0</div>
                                                            <div className="small text-muted">out of 5</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsReports;

