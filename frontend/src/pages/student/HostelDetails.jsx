import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import RoomSelector from '../../components/RoomSelector';
import ReviewCard from '../../components/ReviewCard';
import ChatBox from '../../components/ChatBox';
import MapComponent from '../../components/MapComponent';
import { hostels, reviews, chatMessages, userProfile } from '../../data/hostels';

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useState(userProfile);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hostel, setHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hostelReviews, setHostelReviews] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const foundHostel = hostels.find(h => h.id === parseInt(id));
    if (foundHostel) {
      setHostel(foundHostel);
      setHostelReviews(reviews.filter(r => r.hostelId === foundHostel.id));
    }
  }, [id]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleBookRoom = (room) => {
    if (room) {
      navigate(`/student/booking-confirmation/${hostel.id}/${room.id}`);
    }
  };

  const handleAddToWishlist = () => {
    if (!wishlist.includes(hostel.id)) {
      setWishlist([...wishlist, hostel.id]);
    }
  };

  const handleRemoveFromWishlist = () => {
    setWishlist(wishlist.filter(id => id !== hostel.id));
  };

  const handleSendMessage = (message) => {
    // In a real app, this would send the message to the server
    console.log('Sending message:', message);
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

  if (!hostel) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading hostel details...</p>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.includes(hostel.id);

  return (
    <div className="hostel-details-page d-flex">
      <Sidebar user={user} />
      
      <div className="main-content flex-grow-1">
        <TopHeader user={user} onToggleSidebar={() => setMobileSidebarOpen(true)} />
        
        <div className="content p-4">
          {/* Back Button */}
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Back to Search
          </button>

          {/* Hostel Header */}
          <div className="row mb-4">
            <div className="col-lg-8">
              <h1 className="fw-bold mb-2">{hostel.name}</h1>
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-map-marker-alt text-muted me-2"></i>
                <span className="text-muted">{hostel.location}</span>
                <span className="mx-3 text-muted">•</span>
                <div className="me-2">
                  {renderStars(hostel.rating)}
                </div>
                <span className="text-muted">
                  {hostel.rating} ({hostel.totalReviews} reviews)
                </span>
              </div>
              <p className="text-muted">{hostel.description}</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="d-flex flex-column gap-2">
                <button
                  className={`btn ${isInWishlist ? 'btn-danger' : 'btn-outline-primary'}`}
                  onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
                >
                  <i className={`fas fa-heart ${isInWishlist ? '' : 'me-2'}`}></i>
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowChat(!showChat)}
                >
                  <i className="fas fa-comments me-2"></i>
                  Chat with Owner
                </button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body p-0">
                  <div className="position-relative">
                    <img
                      src={hostel.images[currentImageIndex]}
                      className="img-fluid w-100"
                      alt={hostel.name}
                      style={{ height: '400px', objectFit: 'cover' }}
                    />
                    {hostel.images.length > 1 && (
                      <>
                        <button
                          className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3"
                          onClick={() => setCurrentImageIndex(
                            currentImageIndex === 0 ? hostel.images.length - 1 : currentImageIndex - 1
                          )}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                          className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3"
                          onClick={() => setCurrentImageIndex(
                            currentImageIndex === hostel.images.length - 1 ? 0 : currentImageIndex + 1
                          )}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                        <div className="position-absolute bottom-0 start-0 end-0 p-3">
                          <div className="d-flex justify-content-center gap-2">
                            {hostel.images.map((_, index) => (
                              <button
                                key={index}
                                className={`btn btn-sm rounded-circle ${
                                  index === currentImageIndex ? 'btn-primary' : 'btn-light'
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                                style={{ width: '12px', height: '12px' }}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Amenities */}
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0 fw-bold">Amenities</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    {hostel.amenities.map((amenity, index) => (
                      <div key={index} className="col-md-4 col-sm-6 mb-2">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-check text-success me-2"></i>
                          <span>{amenity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Room Selection */}
              <div className="card mb-4">
                <div className="card-body">
                  <RoomSelector
                    rooms={hostel.rooms}
                    selectedRoom={selectedRoom}
                    onRoomSelect={handleRoomSelect}
                    onBookRoom={handleBookRoom}
                  />
                </div>
              </div>

              {/* Reviews */}
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0 fw-bold">Reviews ({hostelReviews.length})</h6>
                </div>
                <div className="card-body">
                  {hostelReviews.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="fas fa-star fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No reviews yet</p>
                    </div>
                  ) : (
                    <div className="row">
                      {hostelReviews.map(review => (
                        <ReviewCard
                          key={review.id}
                          review={review}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Map */}
              <div className="card mb-4">
                <MapComponent
                  hostels={[hostel]}
                  selectedHostelId={hostel.id}
                />
              </div>

              {/* Contact Info */}
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0 fw-bold">Contact Information</h6>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={hostel.owner.avatar}
                      alt={hostel.owner.name}
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <div>
                      <h6 className="mb-0">{hostel.owner.name}</h6>
                      <small className="text-muted">Hostel Owner</small>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-envelope text-muted me-2"></i>
                      <span>{hostel.owner.email}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-phone text-muted me-2"></i>
                      <span>{hostel.owner.phone}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-map-marker-alt text-muted me-2"></i>
                      <span>{hostel.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Box */}
      {showChat && (
        <ChatBox
          hostelId={hostel.id}
          hostelName={hostel.name}
          ownerName={hostel.owner.name}
          messages={chatMessages.filter(m => m.hostelId === hostel.id)}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default HostelDetails;
