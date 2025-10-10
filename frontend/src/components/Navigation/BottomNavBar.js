import React from 'react';

const BottomNavBar = ({ activeTab = 'dashboard', onTabChange }) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'fas fa-home',
      href: '/'
    },
    {
      id: 'search',
      label: 'Search',
      icon: 'fas fa-search',
      href: '/hostels'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'fas fa-calendar-alt',
      href: '/bookings'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: 'fas fa-heart',
      href: '/favorites'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'fas fa-user',
      href: '/profile'
    }
  ];

  const handleTabClick = (tabId, href) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      window.location.href = href;
    }
  };

  return (
    <nav className="bottom-nav-bar fixed-bottom bg-white border-top shadow-lg d-md-none">
      <div className="container-fluid">
        <div className="row g-0">
          {navItems.map((item) => (
            <div key={item.id} className="col">
              <button
                className={`nav-item w-100 border-0 bg-transparent py-2 px-1 text-center ${
                  activeTab === item.id ? 'active text-primary' : 'text-muted'
                }`}
                onClick={() => handleTabClick(item.id, item.href)}
              >
                <div className="nav-icon mb-1">
                  <i className={`${item.icon} ${activeTab === item.id ? 'fa-lg' : ''}`}></i>
                </div>
                <div className="nav-label small fw-medium">
                  {item.label}
                </div>
                {activeTab === item.id && (
                  <div className="nav-indicator position-absolute top-0 start-50 translate-middle-x bg-primary rounded-bottom" 
                       style={{ width: '24px', height: '3px' }}></div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavBar;