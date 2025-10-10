import React from 'react';

const FooterNav = ({ activeTab = 'home', onTabChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home', href: '/' },
    { id: 'search', label: 'Search', icon: 'fas fa-search', href: '/hostels' },
    { id: 'bookings', label: 'Bookings', icon: 'fas fa-calendar-alt', href: '/bookings' },
    { id: 'favorites', label: 'Favorites', icon: 'fas fa-heart', href: '/favorites' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user', href: '/profile' }
  ];

  const handleTabClick = (tabId, href) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      window.location.href = href;
    }
  };

  return (
    <nav className="d-none d-md-block fixed-bottom" style={{ background: 'transparent', zIndex: 1030 }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6">
            <div className="bg-white border rounded shadow-sm px-3 py-2">
              <div className="row g-0 text-center">
                {navItems.map((item) => (
                  <div key={item.id} className="col">
                    <button
                      className={`nav-item position-relative w-100 border-0 bg-transparent py-2 px-1 ${
                        activeTab === item.id ? 'active text-primary' : 'text-dark'
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FooterNav;


