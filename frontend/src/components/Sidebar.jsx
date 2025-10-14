import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Avatar from 'boring-avatars';

const Sidebar = ({ user, toggleSidebar, collapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = user?.unreadNotifications || 0;
  const notifications = user?.notifications || [];

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home', path: '/student/dashboard' },
    { id: 'search', label: 'Find Hostels', icon: 'fas fa-search', path: '/student/search' },
    { id: 'wishlist', label: 'Wishlist', icon: 'fas fa-heart', path: '/student/wishlist' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell', path: '/student/notifications', badge: unreadCount },
    { id: 'reviews', label: 'Reviews', icon: 'fas fa-star', path: '/student/reviews' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user', path: '/student/profile' },
  ];

  const bottomNavItems = [
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog', path: '/student/settings' },
    { id: 'help', label: 'Help & Support', icon: 'fas fa-question-circle', path: '/student/help' },
    { id: 'logout', label: 'Logout', icon: 'fas fa-sign-out-alt', action: 'logout' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="d-flex d-md-none justify-content-between align-items-center px-3 py-2 bg-white shadow-sm border-bottom">

        {/* Hamburger */}
        <button
          className="btn btn-primary border-0"
          onClick={toggleMobileSidebar}
          style={{ fontSize: '1.2rem' }}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Notification + Profile */}
        <div className="d-flex align-items-center gap-3 position-relative">
          {/* Notification Button */}
          <div className="position-relative">
            <button
              className="btn bg-transparent border-0 p-0"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ fontSize: '1.3rem', color: '#F59E0B' }}
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span
                  className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.6rem', transform: 'translate(-45%,20%)' }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                className="bg-white shadow-sm border rounded p-2 mt-2"
                style={{
                  position: 'absolute',
                  right: 0,
                  width: '260px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1050,
                }}
              >
                {notifications.length > 0 ? (
                  <>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="d-flex justify-content-between align-items-center p-2 border-bottom"
                      >
                        <span className={n.unread ? 'fw-bold' : ''}>{n.title}</span>
                        {n.unread && (
                          <span className="badge bg-warning text-dark rounded-pill">New</span>
                        )}
                      </div>
                    ))}
                    <div className="text-center mt-2">
                      <button
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={() => {
                          navigate('/student/notifications');
                          setShowNotifications(false);
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

          {/* Profile Avatar */}
          <button
            className="btn bg-transparent border-0 p-0"
            onClick={() => navigate('/student/profile')}
          >
            <Avatar
              size={30}
              name={user?.firstName || 'User'}
              variant="bauhaus"
              colors={['#4F46E5', '#6366F1', '#A5B4FC', '#EEF2FF', '#312E81']}
            />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <nav
        className={`sidebar-nav bg-white border-end shadow-sm flex-column transition-all ${
          isCollapsed ? 'collapsed' : ''
        } ${isMobileOpen ? 'open' : ''}`}
        style={{
          width: isCollapsed ? '90px' : '280px',
          minHeight: '100vh',
          transition: 'width 0.3s ease-in-out',
        }}
      >
        {/* Header */}
        <div className="sidebar-header p-3 border-bottom d-flex justify-content-between align-items-center flex-wrap">
          {!isCollapsed && <h4 className="text-primary fw-bold mb-0">Hamari Manzil</h4>}
          <div>
            <button
              className="btn btn-outline-secondary btn-sm me-2 d-none d-md-inline"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <i className={`fas fa-${isCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
            </button>
            <button className="btn btn-outline-danger btn-sm d-md-none" onClick={toggleMobileSidebar}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* User Profile */}
        {!isCollapsed && user && (
          <div className="user-profile p-3 border-bottom text-center text-md-start d-md-flex">
            <Avatar
              size={32}
              name={user?.firstName || 'User'}
              variant="bauhaus"
              colors={['#4F46E5', '#6366F1', '#A5B4FC', '#EEF2FF', '#312E81']}
            />
            <div>
              <h6 className="mb-0 fw-medium">
                {user.firstName} {user.lastName}
              </h6>
              <small className="text-muted">{user.email}</small>
            </div>
          </div>
        )}

        {/* Main Nav */}
        <div className="sidebar-nav-items flex-grow-1 py-3 overflow-auto">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`nav-item d-flex align-items-center text-decoration-none ${
                isActive(item.path)
                  ? 'bg-primary bg-opacity-10 text-light border-end border-3 border-primary'
                  : 'text-dark'
              }`}
              title={isCollapsed ? item.label : ''}
              style={{
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                padding: isCollapsed ? '0.75rem 0' : '1rem',
                gap: isCollapsed ? '0' : '0.75rem',
                transition: 'all 0.3s ease',
              }}
            >
              <i
                className={`${item.icon}`}
                style={{
                  fontSize: isCollapsed ? '1.25rem' : '1rem',
                  marginRight: isCollapsed ? '0' : '0.75rem',
                  minWidth: isCollapsed ? 'auto' : '20px',
                  textAlign: 'center',
                }}
              ></i>
              {!isCollapsed && (
                <>
                  <span className="flex-grow-1">{item.label}</span>
                  {item.badge > 0 && <span className="badge bg-danger rounded-pill">{item.badge}</span>}
                </>
              )}
            </Link>
          ))}
        </div>

        {/* Bottom Nav */}
        <div className="sidebar-bottom-nav border-top py-3">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item w-100 border-0 bg-transparent d-flex align-items-center ${
                item.action === 'logout' ? 'text-danger' : 'text-muted'
              }`}
              onClick={() => (item.action === 'logout' ? handleLogout() : setIsMobileOpen(false))}
              title={isCollapsed ? item.label : ''}
              style={{
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                padding: isCollapsed ? '0.75rem 0' : '0.75rem 1rem',
                gap: isCollapsed ? '0' : '0.75rem',
                transition: 'all 0.3s ease',
              }}
            >
              <i
                className={`${item.icon}`}
                style={{
                  fontSize: isCollapsed ? '1.25rem' : '1rem',
                  marginRight: isCollapsed ? '0' : '0.75rem',
                  minWidth: isCollapsed ? 'auto' : '20px',
                  textAlign: 'center',
                }}
              ></i>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>

        {isCollapsed && user && (
          <div className="collapsed-user p-3 border-top text-center">
            <Avatar
              size={32}
              name={user?.firstName || 'User'}
              variant="bauhaus"
              colors={['#4F46E5', '#6366F1', '#A5B4FC', '#EEF2FF', '#312E81']}
            />
          </div>
        )}
      </nav>

      {/* Backdrop */}
      {isMobileOpen && (
        <div className="sidebar-backdrop d-md-none" onClick={toggleMobileSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;