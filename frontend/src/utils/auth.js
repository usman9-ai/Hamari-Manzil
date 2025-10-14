/**
 * Authentication Utility Functions
 * Helper functions for managing authentication state
 */

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Get current user from storage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Check if user is student
export const isStudent = () => {
  return hasRole('student');
};

// Check if user is owner
export const isOwner = () => {
  return hasRole('owner');
};

// Clear all auth data
export const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Store auth data
export const setAuthData = (access, refresh, user) => {
  if (access) localStorage.setItem('accessToken', access);
  if (refresh) localStorage.setItem('refreshToken', refresh);
  if (user) localStorage.setItem('user', JSON.stringify(user));
};

// Update stored user data
export const updateStoredUser = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

// Get user's full name
export const getUserFullName = () => {
  const user = getCurrentUser();
  if (!user) return '';
  return `${user.first_name || ''} ${user.last_name || ''}`.trim();
};

// Get user's initials for avatar
export const getUserInitials = () => {
  const user = getCurrentUser();
  if (!user) return '?';
  const firstInitial = user.first_name?.charAt(0) || '';
  const lastInitial = user.last_name?.charAt(0) || '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

// Check if user is verified
export const isVerified = () => {
  const user = getCurrentUser();
  return user && user.verification_status === true;
};

// Get redirect path based on user role
export const getRoleBasedPath = (defaultPath = '/') => {
  const user = getCurrentUser();
  if (!user || !user.role) return defaultPath;
  
  switch (user.role) {
    case 'student':
      return '/student/dashboard';
    case 'owner':
      return '/owner/dashboard';
    default:
      return defaultPath;
  }
};

