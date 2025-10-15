import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import Student Pages (Public)
import BrowseHostels from './pages/student/BrowseHostels';
import HostelDetails from './pages/student/HostelDetails';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

// Import Hostel Portal (For Owners)
import HostelLayout from './layouts/hostel/HostelLayout';
import HostelDashboard from './pages/hostel/Dashboard';
import HostelsList from './pages/hostel/HostelsList';
import RoomsList from './pages/hostel/RoomsList';
import ReviewsReports from './pages/hostel/ReviewsReports';
import Verification from './pages/hostel/Verification';
import Profile from './pages/hostel/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Student Pages */}
        <Route path="/" element={<BrowseHostels />} />
        <Route path="/hostel-details/:id" element={<HostelDetails />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />

        {/* Hostel Owner Auth Pages (No Layout) */}
        <Route path="/hostel/login" element={<LoginPage />} />
        <Route path="/hostel/signup" element={<SignupPage />} />
        <Route path="/hostel/forgot-password" element={<ForgotPassword />} />

        {/* Hostel Owner Portal (With Layout) */}
        <Route
          path="/hostel/*"
          element={
            <HostelLayout>
              <Routes>
                <Route path="dashboard" element={<HostelDashboard />} />
                <Route path="hostels" element={<HostelsList />} />
                <Route path="rooms" element={<RoomsList />} />
                <Route path="reviews" element={<ReviewsReports />} />
                <Route path="verification" element={<Verification />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/hostel/dashboard" replace />} />
              </Routes>
            </HostelLayout>
          }
        />

        {/* Legacy routes - redirect to new structure */}
        <Route path="/login" element={<Navigate to="/hostel/login" replace />} />
        <Route path="/signup" element={<Navigate to="/hostel/signup" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
