import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import HostelCard from '../components/HostelCard';
import { hostels, bookings, notifications, userProfile } from '../data/hostels';

const Dashboard = () => {
  const [user, setUser] = useState(userProfile);
  const [wishlist, setWishlist] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [recommendedHostels, setRecommendedHostels] = useState([]);

  useEffect(() => {
    setRecentBookings(bookings.slice(0, 3));
    setRecentNotifications(notifications.slice(0, 3));
    setRecommendedHostels(hostels.slice(0, 6));
  }, []);

  const handleAddToWishlist = (hostelId) => {
    if (!wishlist.includes(hostelId)) {
      setWishlist([...wishlist, hostelId]);
    }
  };

  const handleRemoveFromWishlist = (hostelId) => {
    setWishlist(wishlist.filter(id => id !== hostelId));
  };

  const getActiveBookings = () => {
    return bookings.filter(booking => 
      booking.status === 'confirmed' || booking.status === 'pending'
    ).length;
  };

  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const userWithStats = {
    ...user,
    pendingBookings: getActiveBookings(),
    unreadNotifications: getUnreadNotifications()
  };

  return (
    <div className="dashboard-page d-flex">
      <Sidebar user={userWithStats} />
      <div className="main-content flex-grow-1">
        <TopHeader user={user} />
        <div className="content p-4">
          <div className="welcome-section mb-4">
            <div className="row">
              <div className="col-lg-8">
                <h2 className="fw-bold mb-2">Welcome back, {user.firstName}!</h2>
                <p className="text-muted mb-4">Ready for your next adventure? Here's what's happening with your bookings and recommendations.</p>
              </div>
              <div className="col-lg-4">
                <div className="d-flex gap-2 justify-content-lg-end">
                  <Link to="/student/search" className="btn btn-primary">
                    <i className="fas fa-search me-2"></i>
                    Find Hostels
                  </Link>
                  <Link to="/student/bookings" className="btn btn-outline-primary">
                    <i className="fas fa-calendar-alt me-2"></i>
                    My Bookings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="card-title">Active Bookings</h6>
                      <h3 className="mb-0">{getActiveBookings()}</h3>
                    </div>
                    <i className="fas fa-calendar-check fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="card-title">Total Reviews</h6>
                      <h3 className="mb-0">{user.totalReviews}</h3>
                    </div>
                    <i className="fas fa-star fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="card-title">Wishlist Items</h6>
                      <h3 className="mb-0">{wishlist.length}</h3>
                    </div>
                    <i className="fas fa-heart fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="card-title">Notifications</h6>
                      <h3 className="mb-0">{getUnreadNotifications()}</h3>
                    </div>
                    <i className="fas fa-bell fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">Recent Bookings</h6>
                  <Link to="/student/bookings" className="btn btn-sm btn-outline-primary">View All</Link>
                </div>
                <div className="card-body">
                  {recentBookings.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No recent bookings</p>
                      <Link to="/student/search" className="btn btn-primary">Find Hostels</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentBookings.map(booking => (
                        <div key={booking.id} className="d-flex justify-content-between align-items-center p-2 border rounded">
                          <div>
                            <h6 className="mb-1 small fw-bold">{booking.hostelName}</h6>
                            <small className="text-muted">{booking.checkIn} - {booking.checkOut}</small>
                          </div>
                          <div className="text-end">
                            <span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : booking.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>{booking.status}</span>
                            <div className="small text-muted">PKR {booking.totalAmount.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">Recent Notifications</h6>
                  <Link to="/student/notifications" className="btn btn-sm btn-outline-primary">View All</Link>
                </div>
                <div className="card-body">
                  {recentNotifications.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentNotifications.map(notification => (
                        <div key={notification.id} className={`p-2 border rounded ${!notification.read ? 'bg-light' : ''}`}>
                          <h6 className="mb-1 small fw-bold">{notification.title}</h6>
                          <p className="mb-1 small text-muted">{notification.message}</p>
                          <small className="text-muted">{new Date(notification.timestamp).toLocaleDateString()}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Recommended Hostels</h5>
                <Link to="/student/search" className="btn btn-outline-primary">View All Hostels</Link>
              </div>
              <div className="row">
                {recommendedHostels.map(hostel => (
                  <HostelCard
                    key={hostel.id}
                    hostel={hostel}
                    isInWishlist={wishlist.includes(hostel.id)}
                    onAddToWishlist={handleAddToWishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


