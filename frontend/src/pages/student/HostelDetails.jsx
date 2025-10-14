import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import RoomSelector from '../../components/RoomSelector';
import ReviewCard from '../../components/ReviewCard';
import ChatBox from '../../components/ChatBox';
import MapComponent from '../../components/MapComponent';
import { hostels, reviews, chatMessages, userProfile, notifications } from '../../data/hostels';

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
    const foundHostel = hostels.find((h) => h.id === parseInt(id));
    if (foundHostel) {
      setHostel(foundHostel);
      setHostelReviews(reviews.filter((r) => r.hostelId === foundHostel.id));
    }
  }, [id]);

  const getUnreadNotifications = () =>
    notifications.filter((n) => !n.read).length;

  const userWithStats = {
    ...user,
    unreadNotifications: getUnreadNotifications(),
  };

  const handleRoomSelect = (room) => setSelectedRoom(room);


  const handleAddToWishlist = () => {
    if (!wishlist.includes(hostel.id)) setWishlist([...wishlist, hostel.id]);
  };

  const handleRemoveFromWishlist = () => {
    setWishlist(wishlist.filter((id) => id !== hostel.id));
  };

  const handleSendMessage = (message) => {
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
    <div className="d-flex flex-column flex-lg-row min-vh-100">
      {/* Sidebar */}
      <Sidebar
        user={userWithStats}
        isMobileOpen={mobileSidebarOpen}
        toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main content */}
      <main className="flex-grow-1" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Top Header */}
        <TopHeader
          user={userWithStats}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <div className="container-fluid p-3 p-md-4">
          {/* Back Button */}
          <button
            className="btn btn-outline-secondary mb-3 rounded-pill shadow-sm"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left me-2"></i>Back to Search
          </button>

          {/* Hostel Header */}
          <div className="row mb-4">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-2 text-primary">{hostel.name}</h2>
              <div className="d-flex align-items-center mb-3 flex-wrap">
                <i className="fas fa-map-marker-alt text-muted me-2"></i>
                <span className="text-muted">{hostel.location}</span>
                <span className="mx-3 text-muted">•</span>
                <div className="me-2">{renderStars(hostel.rating)}</div>
                <span className="text-muted">
                  {hostel.rating} ({hostel.totalReviews} reviews)
                </span>
              </div>
              <p className="text-muted">{hostel.description}</p>
            </div>

            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <div className="d-flex flex-column gap-2">
                <button
                  className={`btn ${isInWishlist ? 'btn-danger' : 'btn-outline-primary'}`}
                  onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
                >
                  <i className={`fas fa-heart me-2`}></i>
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowChat(!showChat)}
                >
                  <i className="fas fa-comments me-2"></i>Chat with Owner
                </button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="position-relative">
              <img
                src={hostel.images[currentImageIndex]}
                className="img-fluid w-100 rounded-top"
                alt={hostel.name}
                style={{ height: '400px', objectFit: 'cover' }}
              />
              {hostel.images.length > 1 && (
                <>
                  <button
                    className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3"
                    onClick={() =>
                      setCurrentImageIndex(
                        currentImageIndex === 0
                          ? hostel.images.length - 1
                          : currentImageIndex - 1
                      )
                    }
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3"
                    onClick={() =>
                      setCurrentImageIndex(
                        currentImageIndex === hostel.images.length - 1
                          ? 0
                          : currentImageIndex + 1
                      )
                    }
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Amenities */}
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="fw-bold mb-0">Amenities</h6>
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

              {/* Rooms */}
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                  <RoomSelector
                    rooms={hostel.rooms}
                    selectedRoom={selectedRoom}
                    onRoomSelect={handleRoomSelect}
                  />
                </div>
              </div>

              {/* Reviews */}
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="fw-bold mb-0">
                    Reviews ({hostelReviews.length})
                  </h6>
                </div>
                <div className="card-body">
                  {hostelReviews.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="fas fa-star fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No reviews yet</p>
                    </div>
                  ) : (
                    <div className="row">
                      {hostelReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Content (Right Column) */}
            <div className="col-lg-4">
              {/* Map */}
              <div className="card mb-4 border-0 shadow-sm">
                <MapComponent hostels={[hostel]} selectedHostelId={hostel.id} />
              </div>

              {/* Contact Info */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="fw-bold mb-0">Contact Information</h6>
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
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-envelope text-muted me-2"></i>
                      <span>{hostel.owner.email}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
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
      </main>

      {/* Chat Box */}
      {showChat && (
        <ChatBox
          hostelId={hostel.id}
          hostelName={hostel.name}
          ownerName={hostel.owner.name}
          messages={chatMessages.filter((m) => m.hostelId === hostel.id)}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default HostelDetails;
