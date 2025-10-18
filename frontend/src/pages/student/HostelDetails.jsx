import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHostels, getRooms, getReviews, submitReview } from '../../actions/hostelActions';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Badge } from '../../components/ui/Badge';

const HostelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hostel, setHostel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        loadHostelDetails();
        checkIfReviewed();
    }, [id]);

    const checkIfReviewed = () => {
        const reviewedHostels = JSON.parse(localStorage.getItem('reviewedHostels') || '{}');
        setHasReviewed(!!reviewedHostels[id]);
    };

    const loadHostelDetails = async () => {
        setLoading(true);
        try {
            const [hostelsResult, roomsResult, reviewsResult] = await Promise.all([
                getHostels(),
                getRooms(),
                getReviews(),
            ]);

            if (hostelsResult.success) {
                const hostelData = hostelsResult.data.find(h => h.id === parseInt(id));
                setHostel(hostelData);
                if (hostelData?.images?.length > 0) {
                    setSelectedImage(0);
                }
            }

            if (roomsResult.success) {
                const hostelRooms = roomsResult.data.filter(r => r.hostelId === parseInt(id) && r.isAvailable);
                setRooms(hostelRooms);
            }

            if (reviewsResult.success) {
                const hostelReviews = reviewsResult.data.filter(r => r.hostelId === parseInt(id));
                setReviews(hostelReviews);
            }
        } catch (error) {
            console.error('Error loading hostel details:', error);
        }
        setLoading(false);
    };

    const handleBooking = (room) => {
        setSelectedRoom(room);
        setShowBookingModal(true);
    };

    const handleSubmitReview = async () => {
        if (reviewData.comment.trim().length < 10) {
            alert('Please write at least 10 characters in your review');
            return;
        }

        setSubmittingReview(true);
        try {
            const result = await submitReview({
                hostelId: parseInt(id),
                rating: reviewData.rating,
                comment: reviewData.comment,
                studentName: 'Anonymous User' // In real app, get from auth
            });

            if (result.success) {
                // Mark as reviewed in localStorage
                const reviewedHostels = JSON.parse(localStorage.getItem('reviewedHostels') || '{}');
                reviewedHostels[id] = true;
                localStorage.setItem('reviewedHostels', JSON.stringify(reviewedHostels));

                setHasReviewed(true);
                setShowReviewForm(false);
                setReviewData({ rating: 5, comment: '' });
                loadHostelDetails(); // Reload to show new review
                alert('Thank you for your review!');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmittingReview(false);
        }
    };

    // Calculate stats
    const priceRange = rooms.length > 0
        ? {
            min: Math.min(...rooms.map(r => r.price || 0)),
            max: Math.max(...rooms.map(r => r.price || 0))
        }
        : { min: 0, max: 0 };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 'N/A';

    const totalCapacity = rooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const availableCapacity = rooms.reduce((sum, r) => sum + (r.availableCapacity || 0), 0);

    if (loading) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading hostel details...</p>
                </div>
            </div>
        );
    }

    if (!hostel) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-circle fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">Hostel not found</h5>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
                        Back to Browse
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Header/Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container-fluid px-4">
                    <button className="btn btn-link text-dark" onClick={() => navigate('/')}>
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Browse
                    </button>

                    
                </div>
            </nav>

            <div className="container py-4">
                {/* Hero Section - Images */}
                <div className="row g-3 mb-4">
                    <div className="col-lg-8">
                        <div
                            className="rounded-3 overflow-hidden shadow"
                            style={{
                                height: '500px',
                                backgroundImage: `url(${hostel.images?.[selectedImage] || '/placeholder-hostel.jpg'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                    </div>
                    <div className="col-lg-4">
                        <div className="row g-2" style={{ height: '500px', overflowY: 'auto' }}>
                            {hostel.images && hostel.images.length > 1 ? (
                                hostel.images.map((img, idx) => (
                                    <div key={idx} className="col-12">
                                        <div
                                            className="rounded-3 overflow-hidden shadow-sm"
                                            style={{
                                                height: '160px',
                                                backgroundImage: `url(${img})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                cursor: 'pointer',
                                                border: selectedImage === idx ? '3px solid #4f46e5' : 'none',
                                            }}
                                            onClick={() => setSelectedImage(idx)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div
                                        className="rounded-3 overflow-hidden shadow-sm"
                                        style={{
                                            height: '500px',
                                            backgroundImage: `url(/placeholder-hostel.jpg)`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Main Content */}
                    <div className="col-lg-8">
                        {/* Header Info */}
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h1 className="fw-bold mb-2">{hostel.name}</h1>
                                        <p className="text-muted mb-0">
                                            <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                            {hostel.address || hostel.city}
                                        </p>
                                    </div>
                                    <div className="text-end">
                                        {hostel.verified && (
                                            <Badge variant="success" className="mb-2">
                                                <i className="fas fa-check-circle me-1"></i>
                                                Verified
                                            </Badge>
                                        )}
                                        <br />
                                        <Badge variant={hostel.genderType === 'boys' ? 'primary' : hostel.genderType === 'girls' ? 'danger' : 'info'}>
                                            {hostel.genderType}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="d-flex align-items-center mb-3">
                                    <div className="d-flex align-items-center me-4">
                                        <i className="fas fa-star text-warning me-2"></i>
                                        <strong className="me-2">{averageRating}</strong>
                                        <span className="text-muted">({reviews.length} reviews)</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <h5 className="fw-bold mb-2">About</h5>
                                    <p className="text-muted mb-0">
                                        {hostel.description || 'No description available.'}
                                    </p>
                                </div>

                                {/* Facilities */}
                                {hostel.facilities && hostel.facilities.length > 0 && (
                                    <div>
                                        <h5 className="fw-bold mb-3">Facilities</h5>
                                        <div className="row g-3">
                                            {hostel.facilities.map((facility, idx) => {
                                                const facilityIcons = {
                                                    'WiFi': 'fa-wifi',
                                                    'AC': 'fa-snowflake',
                                                    'Laundry': 'fa-tshirt',
                                                    'Kitchen': 'fa-utensils',
                                                    'Parking': 'fa-parking',
                                                    'Security': 'fa-shield-alt',
                                                    'Gym': 'fa-dumbbell',
                                                    'Study Room': 'fa-book',
                                                    'CCTV': 'fa-video',
                                                    'Generator': 'fa-bolt',
                                                    'Mess': 'fa-utensils',
                                                    'Common Room': 'fa-couch'
                                                };
                                                const icon = facilityIcons[facility] || 'fa-check';
                                                return (
                                                    <div key={idx} className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center me-3"
                                                                style={{ width: '40px', height: '40px' }}
                                                            >
                                                                <i className={`fas ${icon} text-light`}></i>
                                                            </div>
                                                            <span>{facility}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Map */}
                        {hostel.latitude && hostel.longitude && (
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold mb-0">Location</h5>
                                        {hostel.mapLocation && (
                                            <a
                                                href={hostel.mapLocation}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <i className="fas fa-external-link-alt me-2"></i>
                                                Open in Google Maps
                                            </a>
                                        )}
                                    </div>
                                    <div style={{ borderRadius: '12px', overflow: 'hidden', height: '400px' }}>
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            style={{ border: 0 }}
                                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCuBiJQfHnlToa-89WM24tZW9AiSiWMX_o&q=${hostel.latitude},${hostel.longitude}&zoom=15`}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rooms Section */}
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Available Rooms ({rooms.length})</h5>

                                {rooms.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="fas fa-bed fa-3x text-muted mb-3"></i>
                                        <p className="text-muted mb-0">No rooms available at the moment</p>
                                    </div>
                                ) : (
                                    <div className="row g-4">
                                        {rooms.map((room, idx) => (
                                            <div key={idx} className="col-md-6">
                                                <div className="card border h-100" style={{ borderRadius: '12px' }}>
                                                    {room.images && room.images[0] && (
                                                        <div
                                                            style={{
                                                                height: '200px',
                                                                backgroundImage: `url(${room.images[0]})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center',
                                                                borderRadius: '12px 12px 0 0'
                                                            }}
                                                        ></div>
                                                    )}
                                                    <div className="card-body p-3">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div>
                                                                <h6 className="fw-bold mb-1">
                                                                    {room.roomType === 'single' ? 'Single Room' : `Shared Room (${room.bedsCount} Beds)`}
                                                                </h6>
                                                                <Badge variant={room.status === 'available' ? 'success' : 'warning'}>
                                                                    {room.status}
                                                                </Badge>
                                                            </div>
                                                            <div className="text-end">
                                                                <div className="fw-bold text-primary" style={{ fontSize: '18px' }}>
                                                                    Rs. {room.price?.toLocaleString()}
                                                                </div>
                                                                <small className="text-muted">per month</small>
                                                            </div>
                                                        </div>

                                                        {room.facilities && room.facilities.length > 0 && (
                                                            <div className="mb-3">
                                                                <small className="text-muted d-block mb-1">Room Facilities:</small>
                                                                <div className="d-flex flex-wrap gap-1">
                                                                    {room.facilities.slice(0, 4).map((f, i) => (
                                                                        <span key={i} className="badge bg-light text-dark" style={{ fontSize: '10px' }}>
                                                                            {f}
                                                                        </span>
                                                                    ))}
                                                                    {room.facilities.length > 4 && (
                                                                        <span className="badge bg-light text-dark" style={{ fontSize: '10px' }}>
                                                                            +{room.facilities.length - 4}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <button
                                                            className="btn btn-primary btn-sm w-100 mt-2"
                                                            onClick={() => handleBooking(room)}
                                                            disabled={room.status !== 'available'}
                                                            style={{ borderRadius: '8px', fontWeight: '600' }}
                                                        >
                                                            <i className="fas fa-calendar-check me-2"></i>
                                                            Book Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0">Reviews ({reviews.length})</h5>
                                    {!hasReviewed && (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => setShowReviewForm(!showReviewForm)}
                                        >
                                            <i className="fas fa-plus me-2"></i>
                                            Write Review
                                        </button>
                                    )}
                                </div>

                                {/* Review Form */}
                                {showReviewForm && !hasReviewed && (
                                    <div className="bg-light p-4 rounded-3 mb-4">
                                        <h6 className="fw-bold mb-3">Share Your Experience</h6>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Rating</label>
                                            <div className="d-flex gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        className="btn btn-link p-0"
                                                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                        style={{ fontSize: '28px', textDecoration: 'none' }}
                                                    >
                                                        <i className={`fas fa-star ${star <= reviewData.rating ? 'text-warning' : 'text-muted'}`}></i>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Your Review</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                placeholder="Share your experience with this hostel..."
                                                value={reviewData.comment}
                                                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                            ></textarea>
                                            <small className="text-muted">Minimum 10 characters</small>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setShowReviewForm(false);
                                                    setReviewData({ rating: 5, comment: '' });
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleSubmitReview}
                                                disabled={submittingReview || reviewData.comment.length < 10}
                                            >
                                                {submittingReview ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-paper-plane me-2"></i>
                                                        Submit Review
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {hasReviewed && (
                                    <div className="alert alert-info mb-4">
                                        <i className="fas fa-info-circle me-2"></i>
                                        You have already submitted a review for this hostel.
                                    </div>
                                )}

                                {/* Reviews List */}
                                {reviews.length === 0 ? (
                                    <div className="text-center py-4">
                                        <i className="fas fa-comments fa-2x text-muted mb-2"></i>
                                        <p className="text-muted mb-0">No reviews yet. Be the first to review!</p>
                                    </div>
                                ) : (
                                    reviews.map((review, idx) => (
                                        <div key={idx} className={`pb-3 ${idx < reviews.length - 1 ? 'border-bottom mb-3' : ''}`}>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <strong>{review.studentName}</strong>
                                                    <div className="text-warning small">
                                                        {'★'.repeat(review.rating)}
                                                        {'☆'.repeat(5 - review.rating)}
                                                    </div>
                                                </div>
                                                <small className="text-muted">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <p className="text-muted mb-0">{review.comment}</p>
                                            {review.ownerResponse && (
                                                <div className="mt-2 p-3 bg-light rounded">
                                                    <strong className="small text-primary">Owner Response:</strong>
                                                    <p className="text-muted small mb-0 mt-1">{review.ownerResponse}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Stats */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px', borderRadius: '16px' }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Hostel Information</h5>

                                {/* Price Range */}
                                {priceRange.min > 0 && (
                                    <div className="mb-4 p-3 bg-primary bg-opacity-10 rounded-3">
                                        <div className="text-center">
                                            <small className="text-muted d-block mb-1">Price Range</small>
                                            <h3 className="fw-bold mb-0 text-primary">
                                                Rs. {priceRange.min.toLocaleString()}
                                                {priceRange.min !== priceRange.max && ` - ${priceRange.max.toLocaleString()}`}
                                            </h3>
                                            <small className="text-muted">per month</small>
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-star text-warning me-3"></i>
                                            <span>Average Rating</span>
                                        </div>
                                        <strong>{averageRating}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-bed text-primary me-3"></i>
                                            <span>Total Rooms</span>
                                        </div>
                                        <strong>{rooms.length}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-users text-info me-3"></i>
                                            <span>Total Capacity</span>
                                        </div>
                                        <strong>{totalCapacity} Students</strong>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-check-circle text-success me-3"></i>
                                            <span>Available Spots</span>
                                        </div>
                                        <strong>{availableCapacity}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center py-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-comments text-warning me-3"></i>
                                            <span>Total Reviews</span>
                                        </div>
                                        <strong>{reviews.length}</strong>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="mt-4 p-3 bg-light rounded-3">
                                    <strong className="d-block mb-3">
                                        <i className="fas fa-phone text-primary me-2"></i>
                                        Contact Hostel
                                    </strong>
                                    {hostel.phone && (
                                        <div className="mb-2">
                                            <a href={`tel:${hostel.phone}`} className="text-decoration-none text-dark">
                                                <i className="fas fa-phone-alt me-2 text-primary"></i>
                                                {hostel.phone}
                                            </a>
                                        </div>
                                    )}
                                    {hostel.email && (
                                        <div className="mb-3">
                                            <a href={`mailto:${hostel.email}`} className="text-decoration-none text-dark">
                                                <i className="fas fa-envelope me-2 text-primary"></i>
                                                {hostel.email}
                                            </a>
                                        </div>
                                    )}
                                    {hostel.phone && (
                                        <a
                                            href={`https://wa.me/${hostel.phone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-success w-100"
                                            style={{ borderRadius: '8px', fontWeight: '600' }}
                                        >
                                            <i className="fab fa-whatsapp me-2"></i>
                                            Chat on WhatsApp
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedRoom && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '16px' }}>
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Book Your Room</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowBookingModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="text-center mb-4">
                                    <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                                    <h5 className="fw-bold">Contact Us to Complete Booking</h5>
                                    <p className="text-muted">
                                        Please contact us via WhatsApp to finalize your booking for:
                                    </p>
                                    <div className="bg-light rounded-3 p-3 mb-3">
                                        <strong>{hostel.name}</strong>
                                        <br />
                                        <span className="text-muted">
                                            {selectedRoom.roomType === 'single' ? 'Single Room' : `Shared Room (${selectedRoom.bedsCount} Beds)`}
                                        </span>
                                        <br />
                                        <strong className="text-primary">Rs. {selectedRoom.price?.toLocaleString()}/month</strong>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/${hostel.phone?.replace(/[^0-9]/g, '') || '923004334270'}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success w-100 py-3"
                                    style={{ borderRadius: '12px', fontWeight: '600' }}
                                >
                                    <i className="fab fa-whatsapp me-2"></i>
                                    Contact on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Footer */}
            <footer className="bg-white border-top py-4 mt-5">
                <div className="container">
                    <div className="text-center text-muted">
                        <p className="mb-0">© 2024 Hamari Manzil. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HostelDetails;