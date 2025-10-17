import React, { useMemo, useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import WishlistCard from '../../components/WishlistCard';
import {
  wishlist as initialWishlist,
  hostels,
  userProfile,
  notifications,
} from '../../data/hostels';

const Wishlist = () => {
  const [user, setUser] = useState(userProfile);
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ---------- Unread Notifications ----------
  useEffect(() => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    setUser((prev) => ({ ...prev, unreadNotifications: unreadCount }));
  }, []);

  // ---------- Wishlist Hostels ----------
  const wishlistHostels = useMemo(() => {
    return wishlist
      .map((w) => {
        const hostel = hostels.find((h) => h.id === w.hostelId);
        if (!hostel) return null;
        return { ...hostel, addedDate: w.addedDate };
      })
      .filter(Boolean);
  }, [wishlist]);

  // ---------- Remove Hostel ----------
  const handleRemove = (hostelId) =>
    setWishlist((prev) => prev.filter((w) => w.hostelId !== hostelId));

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      {/* Sidebar */}
      <Sidebar
        user={user}
        collapsed={isSidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Content */}
      <main
        className="flex-grow-1"
        style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
      >
        <TopHeader
          user={user}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Page Content */}
        <div className="container-fluid px-2 px-md-4 py-4">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 px-2">
            <div>
              <h2 className="fw-bold mb-2">Wishlist</h2>
              <p className="text-muted mb-0">Your favorite hostels in one place</p>
            </div>
          </div>

          {/* Wishlist Cards */}
          {wishlistHostels.length === 0 ? (
            <div className="text-center py-5 px-2">
              <i className="fas fa-heart fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No items in your wishlist</h5>
              <p className="text-muted">Browse hostels and add your favorites</p>
            </div>
          ) : (
            <div className="d-flex flex-wrap justify-content-start gap-3">
              {wishlistHostels.map((h) => (
                <div
                  key={h.id}
                  className="col-12 col-sm-6 col-lg-4 d-flex"
                >
                  <div classname="card h-100 w-100">
                  <WishlistCard
                    hostel={h}
                    addedDate={h.addedDate}
                    onRemoveFromWishlist={handleRemove}
                    style={{ width: '100%', height: 'auto'}}
                  />
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Bottom spacing for mobile scroll */}
          <div className="d-block d-md-none" style={{ height: '70px' }}></div>
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

export default Wishlist;
