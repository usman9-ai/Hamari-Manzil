import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import './App.css';

// Import Common Pages (Public)
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import BrowseHostels from './pages/student/BrowseHostels';
import HostelDetails from './pages/student/HostelDetails';

// Import Student Pages (Protected)
import Dashboard from './pages/student/Dashboard';

import Wishlist from './pages/student/Wishlist';
import Notifications from './pages/student/Notifications';
import Reviews from './pages/student/Reviews';
import Profile from './pages/student/Profile';


// Import Hostel Portal (For Owners)
import HostelLayout from './layouts/hostel/HostelLayout';
import HostelDashboard from './pages/hostel/Dashboard';
import HostelsList from './pages/hostel/HostelsList';
import RoomsList from './pages/hostel/RoomsList';
import ReviewsReports from './pages/hostel/ReviewsReports';
import Verification from './pages/hostel/Verification';
import OwnerProfile from './pages/hostel/OwnerProfile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
 return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return !token ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/privacy-policy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
        <Route path="/terms-conditions" element={<PublicRoute><TermsConditions /></PublicRoute>} />
        <Route path="/student/search" element={<PublicRoute><BrowseHostels /></PublicRoute>} />
        <Route path="/hostel-details/:id" element={<PublicRoute><HostelDetails /></PublicRoute>} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/student/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/student/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

        {/* Owner Routes */}

        {/* Default Route */}
        <Route path="" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="student/dashboard" replace />} />
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
                <Route path="profile" element={<OwnerProfile />} />
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
