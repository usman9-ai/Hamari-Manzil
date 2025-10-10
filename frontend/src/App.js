import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/student/Dashboard';
import HostelSearch from './pages/student/HostelSearch';
import HostelDetails from './pages/student/HostelDetails';
import Notifications from './pages/student/Notifications';
import Reviews from './pages/student/Reviews';
import Profile from './pages/student/Profile';
import HostelDetailPage from './pages/HostelDetailPage';
import Wishlist from './pages/student/Wishlist';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';



function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<Dashboard />} />
        <Route path="/student/search" element={<HostelSearch />} />
        <Route path="/student/hostel-detail" element={<HostelDetails />} />
        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/student/reviews" element={<Reviews />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/wishlist" element={<Wishlist />} />
        <Route path="/hostel/:id" element={<HostelDetailPage />} />

        {/* Owner Routes */}

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;