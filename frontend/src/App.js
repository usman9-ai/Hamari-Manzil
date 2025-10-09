import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentDashboard from './pages/student/StudentDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import ManageHostels from './pages/owner/ManageHostels';
import Bookings from './pages/student/Bookings';

// Import Hostel Portal
import HostelLayout from './layouts/hostel/HostelLayout';
import HostelDashboard from './pages/hostel/Dashboard';
import HostelsList from './pages/hostel/HostelsList';
import RoomsList from './pages/hostel/RoomsList';
import ReviewsReports from './pages/hostel/ReviewsReports';
import Verification from './pages/hostel/Verification';
import Profile from './pages/hostel/Profile';

// Auth guard component
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Student routes */}
        <Route
          path="/student/dashboard"
          element={
            // <ProtectedRoute requiredRole="student">
            <StudentDashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/student/bookings"
          element={
            // <ProtectedRoute requiredRole="student">
            <Bookings />
            // </ProtectedRoute>
          }
        />

        {/* Owner routes */}
        <Route
          path="/owner/dashboard"
          element={
            // <ProtectedRoute requiredRole="owner">
            <OwnerDashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/owner/hostels"
          element={
            // <ProtectedRoute requiredRole="owner">
            <ManageHostels />
            // </ProtectedRoute>
          }
        />

        {/* Hostel Portal routes */}
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

        {/* Dashboard redirect based on role */}
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
            <DashboardRedirect />
            // </ProtectedRoute>
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