import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'boring-avatars';

const TopHeader = ({ user, onSearch, toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const unreadCount = user?.unreadNotifications || 0;
  const notifications = user?.notifications || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() && !selectedFilter) return;

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedFilter) params.append('filter', selectedFilter);

    navigate(`/student/search?${params.toString()}`);
    onSearch?.({ query: searchQuery, filter: selectedFilter });
  };

  const toggleNotifications = () => setShowNotifications(!showNotifications);

  return (
    <header className="top-header bg-white border-bottom shadow-sm py-2 px-3 w-100">
      {/* Desktop Header */}
      <div className="d-none d-md-flex justify-content-between align-items-center gap-2 py-3 px-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-grow-1 me-3" style={{ minWidth: '300px', maxWidth: '500px' }}>
          <div className="input-group">
            <select
              className="form-select flex-shrink-0"
              style={{ maxWidth: '100px', minWidth: '80px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="city">City</option>
              <option value="price">Price Range</option>
              <option value="hostel">Hostel Type</option>
            </select>

            <input
              type="text"
              className="form-control flex-grow-1"
              placeholder="Search hostels, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button className="btn btn-primary flex-shrink-0" type="submit">
              <i className="fas fa-search me-1"></i>Search
            </button>
          </div>
        </form>

        {/* Right Icons */}
        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <div className="position-relative">
            <button
              className="btn bg-transparent border-0"
              onClick={toggleNotifications}
              style={{ fontSize: '1.5rem', color: '#F59E0B' }}
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span
                  className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.65rem', transform: 'translate(-45%,15%)' }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="bg-white shadow-sm border rounded p-2 mt-2"
                style={{ position: 'absolute', right: 0, width: '300px', maxHeight: '250px', overflowY: 'auto', zIndex: 1000 }}
              >
                <div className="d-flex justify-content-end mb-2">
                  <button
                    className="btn btn-sm btn-outline-secondary p-1"
                    onClick={() => setShowNotifications(false)}
                    style={{ fontSize: '1.5rem', lineHeight: 1, border: 'none', background: 'transparent', cursor: 'pointer', color: '#6c757d' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'red'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6c757d'}
                  >
                    ×
                  </button>
                </div>

                {notifications.length > 0 ? (
                  <>
                    {notifications.map(n => (
                      <div key={n.id} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                        <span className={`${n.unread ? 'fw-bold' : ''}`}>{n.title}</span>
                        {n.unread && <span className="badge bg-warning text-dark rounded-pill">New</span>}
                      </div>
                    ))}
                    <div className="text-center mt-2">
                      <button
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={() => {
                          navigate('/student/notifications');
                          setShowNotifications(false);
                          toggleSidebar?.();
                        }}
                      >
                        View All
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-2 text-muted">No notifications</div>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <button className="btn bg-transparent border-0 p-0" onClick={() => navigate('/student/profile')}>
            <Avatar
              size={32}
              name={user?.firstName || 'User'}
              variant="bauhaus"
              colors={['#4F46E5', '#6366F1', '#A5B4FC', '#EEF2FF', '#312E81']}
            />
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="d-flex d-md-none flex-column gap-2">
        {showNotifications && (
          <div className="bg-white shadow-sm border rounded p-2 mb-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              <>
                {notifications.map(n => (
                  <div key={n.id} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                    <span className={`${n.unread ? 'fw-bold' : ''}`}>{n.title}</span>
                    {n.unread && <span className="badge bg-warning text-dark rounded-pill">New</span>}
                  </div>
                ))}
                <div className="text-center mt-2">
                  <button
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => {
                      navigate('/student/notifications');
                      setShowNotifications(false);
                      toggleSidebar?.();
                    }}
                  >
                    View All
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-2 text-muted">No notifications</div>
            )}
          </div>
        )}

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="d-flex gap-1 w-100">
          <select
            className="form-select p-1"
            style={{ width: '40px', textAlign: 'center' }}
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="" dangerouslySetInnerHTML={{ __html: '&dtrif;' }} />
            <option value="city">City</option>
            <option value="price">Price</option>
            <option value="hostel">Hostel</option>
          </select>

          <input
            type="text"
            className="form-control flex-grow-1"
            placeholder="Search hostels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button className="btn btn-primary flex-shrink-0" type="submit">
            <i className="fas fa-search me-1"></i>
          </button>
        </form>
      </div>
    </header>
  );
};

export default TopHeader;
