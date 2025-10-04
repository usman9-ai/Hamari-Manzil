import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/Home/HomeHeader';
import HeroSection from '../components/Home/HeroSection';
import FeaturedHostelsGrid from '../components/Home/FeaturedHostelsGrid';
import Testimonials from '../components/Home/Testimonials'
import CallToActionCard from '../components/Home/CallToActionCard';
import HomeFooter from '../components/Home/HomeFooter'
import AuthLayout from '../components/Common/AuthLayout';



const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    // Handle settings click
    console.log('Settings clicked');
  };

  const handleGetStarted = () => {
    navigate('/hostels');
  };

  return (
    <>
    <AuthLayout
      pageClassName="home-page"
    >
      <HomeHeader 
        user={user}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />
      <HeroSection onSearchClick={() => navigate('/hostels')} />
      <FeaturedHostelsGrid />
      <Testimonials />
      <CallToActionCard onGetStarted={handleGetStarted} />
      <HomeFooter />
    </AuthLayout>
    
    </>
  );
};

export default HomePage;
