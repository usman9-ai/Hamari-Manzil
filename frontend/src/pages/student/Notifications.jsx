import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import NotificationCard from '../../components/NotificationCard';
import { notifications, userProfile } from '../../data/hostels';

const Notifications = () => {
  const [user, setUser] = useState(userProfile);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ---------- Load Notifications ----------
  useEffect(() => {
    setAllNotifications(notifications);
    setFilteredNotifications(notifications);
    const unreadCount = notifications.filter((n) => !n.read).length;
    setUser((prev) => ({ ...prev, unreadNotifications: unreadCount }));
  }, []);

  // ---------- Apply Filters ----------
  useEffect(() => {
    let filtered = [...allNotifications];
    if (filter !== 'all') filtered = filtered.filter((n) => n.type === filter);
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredNotifications(filtered);
  }, [filter, searchQuery, allNotifications]);

  // ---------- Handlers ----------
  const handleMarkAsRead = (id) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDeleteNotification = (id) => {
    setAllNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setAllNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setAllNotifications([]);
    setFilteredNotifications([]);
  };

  // ---------- Notification Counts ----------
  const typeCounts = {
    all: allNotifications.length,
    unread: allNotifications.filter((n) => !n.read).length,
    hostel_message: allNotifications.filter((n) => n.type === 'hostel_message').length,
    review_request: allNotifications.filter((n) => n.type === 'review_request').length,
  };

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
      <main className="flex-grow-1" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Top Header */}
        <TopHeader
          user={user}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Page Content */}
        <div className="container-fluid px-2 px-md-4 py-4">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold mb-1">Notifications</h2>
              <p className="text-muted mb-0">Stay updated with your hostel activities</p>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto">
              <button
                className="btn btn-outline-primary w-100"
                onClick={handleMarkAllAsRead}
                disabled={typeCounts.unread === 0}
              >
                <i className="fas fa-check-double me-2"></i> Mark All as Read
              </button>
              <button
                className="btn btn-outline-danger w-100"
                onClick={handleClearAll}
                disabled={allNotifications.length === 0}
              >
                <i className="fas fa-trash me-2"></i> Clear All
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Total', count: typeCounts.all, color: 'text-primary' },
              { label: 'Unread', count: typeCounts.unread, color: 'text-warning' },
              { label: 'Messages', count: typeCounts.hostel_message, color: 'text-secondary' },
              { label: 'Reviews', count: typeCounts.review_request, color: 'text-success' },
            ].map((stat, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className={`${stat.color} fw-bold mb-1`}>{stat.count}</h5>
                    <small className="text-muted">{stat.label}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-5">
                  <label className="form-label fw-medium">Filter by Type</label>
                  <select
                    className="form-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Notifications</option>
                    <option value="hostel_message">Hostel Messages</option>
                    <option value="review_request">Review Requests</option>
                  </select>
                </div>
                <div className="col-12 col-md-5">
                  <label className="form-label fw-medium">Search Notifications</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-2">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setFilter('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification List */}
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">
                {searchQuery || filter !== 'all'
                  ? 'No notifications found'
                  : 'No notifications yet'}
              </h5>
              <p className="text-muted">
                {searchQuery || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'You’ll receive notifications about your hostel activities here'}
              </p>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0 fw-bold">
                  {filteredNotifications.length} Notification
                  {filteredNotifications.length !== 1 ? 's' : ''} Found
                </h6>
              </div>
              <div className="card-body p-0">
                <div className="notification-list overflow-auto px-2">
                  {filteredNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDeleteNotification}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom spacing for mobile scroll */}
          <div className="d-block d-md-none" style={{ height: '70px' }}></div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
