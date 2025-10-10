import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HostelDetailCard from '../components/HostelDetail/HostelDetailCard';
import ImageGallery from '../components/HostelDetail/ImageGallery';
import ReviewSection from '../components/HostelDetail/ReviewSection';
import BottomNavBar from '../components/Navigation/BottomNavBar';
import SidebarNav from '../components/Navigation/SidebarNav';

const HostelDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchHostelDetails();
  }, [id]);

  const fetchHostelDetails = async () => {
    try {
      const response = await fetch(`/api/hostels/${id}/`);
      
      if (response.ok) {
        const data = await response.json();
        setHostel(data);
      } else {
        setError('Hostel not found');
      }
    } catch (error) {
      console.error('Error fetching hostel details:', error);
      setError('Failed to load hostel details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = (booking) => {
    // Redirect to booking confirmation or payment page
    window.location.href = `/booking/${booking.id}`;
  };

  if (loading) {
    return (
      <div className="hostel-detail-page d-flex">
        <SidebarNav user={user} />
        <div className="main-content flex-grow-1 p-4">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading hostel details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hostel-detail-page d-flex">
        <SidebarNav user={user} />
        <div className="main-content flex-grow-1 p-4">
          <div className="container">
            <div className="alert alert-danger text-center" role="alert">
              <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
              <h4>{error}</h4>
              <button 
                className="btn btn-primary mt-3"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hostel-detail-page d-flex">
      <SidebarNav user={user} />
      
      <div className="main-content flex-grow-1">
        <div className="container-fluid px-4 py-4">
          <div className="row">
            <div className="col-12 mb-4">
              <ImageGallery 
                images={hostel?.images} 
                hostelName={hostel?.name} 
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-8 mb-4">
              <HostelDetailCard hostel={hostel} />
              <ReviewSection hostelId={id} />
            </div>
            
            <div className="col-lg-4 mb-4">
              
            </div>
          </div>
        </div>
        
        {/* Add bottom padding for mobile navigation */}
        <div className="pb-5 d-md-none"></div>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default HostelDetailPage;
