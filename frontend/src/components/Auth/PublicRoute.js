import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRoleBasedPath } from '../../utils/auth';

/**
 * PublicRoute Component
 * Wrapper component for public routes (login, signup, etc.)
 * Redirects authenticated users to their dashboard
 * 
 * @param {React.ReactNode} children - Child components to render
 */
const PublicRoute = ({ children }) => {
  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated()) {
    return <Navigate to={getRoleBasedPath()} replace />;
  }

  return children;
};

export default PublicRoute;

