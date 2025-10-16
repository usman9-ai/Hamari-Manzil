import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/student/Dashboard';
import HostelSearch from './pages/student/HostelSearch';
import HostelDetails from './pages/student/HostelDetails';
import Notifications from './pages/student/Notifications';
import Reviews from './pages/student/Reviews';
import Profile from './pages/student/Profile';
import Wishlist from './pages/student/Wishlist';
import ForgotPassword from './pages/ForgotPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import './App.css';

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

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/student/search" element={<ProtectedRoute><HostelSearch /></ProtectedRoute>} />
        <Route path="/student/hostel-details/:id" element={<ProtectedRoute><HostelDetails /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/student/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/student/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

        {/* Owner Routes */}

        {/* Default Route */}
        <Route path="" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="student/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;