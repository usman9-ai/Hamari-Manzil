import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import HostelSearch from '../pages/HostelSearch';
import HostelDetails from '../pages/HostelDetails';
import BookingConfirmation from '../pages/BookingConfirmation';
import MyBookings from '../pages/MyBookings';
import Profile from '../pages/Profile';
import Payments from '../pages/Payments';
import Notifications from '../pages/Notifications';
import Reviews from '../pages/Reviews';
import Wishlist from '../pages/Wishlist';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="search" element={<HostelSearch />} />
      <Route path="hostel-details/:id" element={<HostelDetails />} />
      <Route path="booking-confirmation/:hostelId/:roomId" element={<BookingConfirmation />} />
      <Route path="bookings" element={<MyBookings />} />
      <Route path="profile" element={<Profile />} />
      <Route path="payments" element={<Payments />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="reviews" element={<Reviews />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="" element={<Navigate to="dashboard" replace />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default StudentRoutes;


