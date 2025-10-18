import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import HostelCard from '../../components/HostelCard';
import { dummyHostels } from '../../services/hostelDummyData';
import { userProfile, notifications } from '../../data/hostels';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

const Dashboard = () => {
  const [user, setUser] = useState(userProfile);
  const [wishlist, setWishlist] = useState([]);
  const [recommendedHostels, setRecommendedHostels] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setRecommendedHostels(dummyHostels.slice(0, 6));
  }, []);

  useEffect(() => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel) => {
      new bootstrap.Carousel(carousel, {
        interval: 3000,
        ride: 'carousel',
      });
    });
  }, [recommendedHostels]);

  // Wishlist Management
 const handleAddToWishlist = (hostelId) => { 
  if (!wishlist.includes(hostelId)) setWishlist([...wishlist, hostelId]); 
}; 
  const handleRemoveFromWishlist = (hostelId) => { 
    setWishlist(wishlist.filter((id) => id !== hostelId)); 
  };

  // Calculate unread notifications
  const getUnreadNotifications = () =>
    notifications.filter((notification) => !notification.read).length;

  const userWithStats = {
    ...user,
    unreadNotifications: getUnreadNotifications(),
  };

  // Stat Card Component
  const StatCard = ({ stat }) => {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    useEffect(() => {
      const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <div className="col-6 col-md-4">
        <div
          className={`card bg-gradient-${stat.bg} text-white shadow-sm`}
          style={{
            height: isLargeScreen ? '180px' : '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
          }}
        >
          <div className="card-body d-flex justify-content-between align-items-center w-100 h-100">
            <div>
              <h6 className="mb-1">{stat.title}</h6>
              <h2 className="mb-0 fw-bold">{stat.value}</h2>
            </div>
            <i className={`fas fa-${stat.icon} fa-2x opacity-75`}></i>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100">
      {/* Sidebar */}
      <Sidebar
        user={userWithStats}
        isMobileOpen={mobileSidebarOpen}
        toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Content */}
      <main
        className="flex-grow-1"
        style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}
      >
        <TopHeader
          user={userWithStats}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <div className="container-fluid p-3 p-md-4">
          {/* Welcome Section */}
          <div className="mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
              <div className="mb-2 mb-md-0">
                <h1 className="fw-bold text-primary h4">
                  Welcome back,{' '}
                  <span className="text-gradient">{user.firstName}!</span>
                </h1>
                <p className="text-muted mb-0">
                  Ready for your next adventure? Here's what's happening with
                  your bookings and recommendations.
                </p>
              </div>
              <Link
                to="/student/search"
                className="btn btn-primary px-4 py-2 rounded-pill shadow-sm"
                style={{ whiteSpace: 'nowrap', minWidth: '160px' }}
              >
                <i className="fas fa-search me-2"></i>Find Hostels
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            {[
              {
                title: 'Total Reviews',
                value: user.totalReviews,
                icon: 'star',
                bg: 'success',
              },
              {
                title: 'Wishlist Items',
                value: wishlist.length,
                icon: 'heart',
                bg: 'warning',
              },
              {
                title: 'Notifications',
                value: userWithStats.unreadNotifications,
                icon: 'bell',
                bg: 'info',
              },
            ].map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
            ))}
          </div>

          {/* Recommended Hostels */}
          <div className="mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
              <h5 className="fw-bold mb-2 mb-md-0">Recommended Hostels</h5>
              <Link
                to="/student/search"
                className="btn btn-outline-primary px-4 py-2 rounded-pill shadow-sm"
                style={{ whiteSpace: 'nowrap', minWidth: '160px' }}
              >
                View All Hostels
              </Link>
            </div>

            <div className="row g-3">
              {recommendedHostels.map((hostel) => (
                <div key={hostel.id} className="col-12 col-sm-6 col-lg-4">
                  <HostelCard
                    hostel={hostel}
                    isInWishlist={wishlist.includes(hostel.id)}
                    onAddToWishlist={handleAddToWishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Footer */}
            <footer className="bg-white border-top py-4 mt-5">
                <div className="container">
                    <div className="text-center text-muted">
                        <p className="mb-0">© 2024 Hamari Manzil. All rights reserved.</p>
                    </div>
                </div>
            </footer>
      </main>
    </div>
  );
};

export default Dashboard;
