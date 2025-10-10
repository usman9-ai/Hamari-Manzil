import React, { useState } from 'react';

const SidebarNav = ({ activeTab = 'dashboard', onTabChange, user, collapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'fas fa-home',
      href: '/'
    },
    {
      id: 'search',
      label: 'Find Hostels',
      icon: 'fas fa-search',
      href: '/hostels'
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: 'fas fa-calendar-alt',
      href: '/bookings',
      badge: user?.pendingBookings || 0
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: 'fas fa-heart',
      href: '/favorites'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: 'fas fa-envelope',
      href: '/messages',
      badge: user?.unreadMessages || 0
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'fas fa-user',
      href: '/profile'
    }
  ];

  const bottomNavItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: 'fas fa-cog',
      href: '/settings'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'fas fa-question-circle',
      href: '/help'
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: 'fas fa-sign-out-alt',
      href: '/logout',
      action: 'logout'
    }
  ];

  const handleTabClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
      return;
    }

    if (onTabChange) {
      onTabChange(item.id);
    } else {
      window.location.href = item.href;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`sidebar-nav bg-white border-end shadow-sm d-none d-md-flex flex-column ${
      isCollapsed ? 'collapsed' : ''
    }`} style={{ width: isCollapsed ? '80px' : '280px', minHeight: '100vh' }}>
      
      {/* Header */}
      <div className="sidebar-header p-3 border-bottom">
        <div className="d-flex align-items-center justify-content-between">
          {!isCollapsed && (
            <div className="d-flex align-items-center">
              <h4 className="text-primary fw-bold mb-0">HostelFinder</h4>
            </div>
          )}
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={toggleSidebar}
          >
            <i className={`fas fa-${isCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && user && (
        <div className="user-profile p-3 border-bottom">
          <div className="d-flex align-items-center">
            <img
              src={user.avatar || '/default-avatar.png'}
              alt="Profile"
              className="rounded-circle me-3"
              width="40"
              height="40"
            />
            <div className="flex-grow-1">
              <h6 className="mb-0 fw-medium">{user.firstName} {user.lastName}</h6>
              <small className="text-muted">{user.email}</small>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="sidebar-nav-items flex-grow-1 py-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item w-100 border-0 bg-transparent text-start px-3 py-2 d-flex align-items-center ${
              activeTab === item.id ? 'active bg-primary bg-opacity-10 text-primary border-end border-primary border-3' : 'text-dark'
            }`}
            onClick={() => handleTabClick(item)}
            title={isCollapsed ? item.label : ''}
          >
            <i className={`${item.icon} ${isCollapsed ? 'fa-lg' : 'me-3'}`}></i>
            {!isCollapsed && (
              <>
                <span className="flex-grow-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="badge bg-danger rounded-pill">{item.badge}</span>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="sidebar-bottom-nav border-top py-3">
        {bottomNavItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item w-100 border-0 bg-transparent text-start px-3 py-2 d-flex align-items-center text-muted hover-bg-light ${
              item.action === 'logout' ? 'text-danger' : ''
            }`}
            onClick={() => handleTabClick(item)}
            title={isCollapsed ? item.label : ''}
          >
            <i className={`${item.icon} ${isCollapsed ? 'fa-lg' : 'me-3'}`}></i>
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Collapsed User Avatar */}
      {isCollapsed && user && (
        <div className="collapsed-user p-2 border-top text-center">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt="Profile"
            className="rounded-circle"
            width="32"
            height="32"
            title={`${user.firstName} ${user.lastName}`}
          />
        </div>
      )}
    </nav>
  );
};

export default SidebarNav;