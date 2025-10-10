import React, { useState, useEffect } from 'react';
import FilterBar from '../components/HostelListing/FilterBar';
import HostelGrid from '../components/HostelListing/HostelGrid';
import BottomNavBar from '../components/Navigation/BottomNavBar';
import SidebarNav from '../components/Navigation/SidebarNav';

const HostelListingPage = () => {
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({});
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchHostels();
  }, []);

  const fetchHostels = async (filterParams = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filterParams);
      const response = await fetch(`/api/hostels/?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setHostels(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchHostels(newFilters);
  };

  return (
    <div className="hostel-listing-page d-flex">
      <SidebarNav activeTab="search" user={user} />
      
      <div className="main-content flex-grow-1">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        
        <HostelGrid 
          filters={filters} 
          hostels={loading ? null : hostels}
        />
        
        {/* Add bottom padding for mobile navigation */}
        <div className="pb-5 d-md-none"></div>
      </div>
      
      <BottomNavBar activeTab="search" />
    </div>
  );
};

export default HostelListingPage;
