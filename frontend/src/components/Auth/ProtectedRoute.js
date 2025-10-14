import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../../utils/auth';

/**
 * ProtectedRoute Component
 * Wrapper component for protecting routes that require authentication
 * 
 * @param {React.ReactNode} children - Child components to render if authorized
 * @param {string} requiredRole - Optional role required to access the route
 * @param {string} redirectTo - Path to redirect if not authorized (default: '/login')
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if specific role is required
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

