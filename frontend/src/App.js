import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Student components (from maha branch)
import Dashboard from './pages/student/Dashboard';
import HostelSearch from './pages/student/HostelSearch';
import HostelDetails from './pages/student/HostelDetails';
import Notifications from './pages/student/Notifications';
import Reviews from './pages/student/Reviews';
import Profile from './pages/student/Profile';
import Wishlist from './pages/student/Wishlist';

// Owner components (keep your existing)
import OwnerDashboard from './pages/owner/OwnerDashboard';
import ManageHostels from './pages/owner/ManageHostels';

// Import Hostel Portal
import HostelLayout from './layouts/hostel/HostelLayout';
import HostelDashboard from './pages/hostel/Dashboard';
import HostelsList from './pages/hostel/HostelsList';
import RoomsList from './pages/hostel/RoomsList';
import ReviewsReports from './pages/hostel/ReviewsReports';
import Verification from './pages/hostel/Verification';
import UserVerification from './pages/hostel/UserVerification';
import RoomVerification from './pages/hostel/RoomVerification';
import VerificationDashboard from './pages/hostel/VerificationDashboard';
import HostelProfile from './pages/hostel/Profile';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';

// Auth guard component
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return !token ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/verify-email/:uidb64/:token" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordPage />} />

        {/* Student routes (from maha branch) */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/search"
          element={
            <ProtectedRoute requiredRole="student">
              <HostelSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/hostel-details/:id"
          element={
            <ProtectedRoute requiredRole="student">
              <HostelDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute requiredRole="student">
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/reviews"
          element={
            <ProtectedRoute requiredRole="student">
              <Reviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute requiredRole="student">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/wishlist"
          element={
            <ProtectedRoute requiredRole="student">
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* Owner routes (keep your existing) */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/hostels"
          element={
            <ProtectedRoute requiredRole="owner">
              <ManageHostels />
            </ProtectedRoute>
          }
        />

        {/* Hostel Portal routes */}
        <Route
          path="/hostel/*"
          element={
            <ProtectedRoute>
              <HostelLayout>
                <Routes>
                  <Route path="dashboard" element={<HostelDashboard />} />
                  <Route path="hostels" element={<HostelsList />} />
                  <Route path="rooms" element={<RoomsList />} />
                  <Route path="reviews" element={<ReviewsReports />} />
                  <Route path="verification" element={<VerificationDashboard />} />
                  <Route path="hostel-verification" element={<Verification />} />
                  <Route path="user-verification" element={<UserVerification />} />
                  <Route path="room-verification" element={<RoomVerification />} />
                  <Route path="profile" element={<HostelProfile />} />
                  <Route path="*" element={<Navigate to="/hostel/dashboard" replace />} />
                </Routes>
              </HostelLayout>
            </ProtectedRoute>
          }
        />

        {/* Dashboard redirect based on role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Helper component to redirect to the appropriate dashboard
const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user.role === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  } else if (user.role === 'owner') {
    return <Navigate to="/owner/dashboard" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default App;