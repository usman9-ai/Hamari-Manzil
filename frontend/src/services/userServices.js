import {
  registerUser,
  loginUser,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  changePassword,
  requestPasswordReset,
  confirmPasswordReset,
} from "../api/users";

// ======================================
// Authentication
// ======================================

// Register new user
export const handleRegister = async (formData) => {
  try {
    const res = await registerUser(formData);
    return res.data;
  } catch (error) {
    throw error.response ? error : { response: { data: { general: "Network error" } } };
  }
};

// Login user and store tokens
export const handleLogin = async (credentials) => {
  try {
    const res = await loginUser(credentials);
    const { access, refresh } = res.data;
    
    // Store tokens
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    
    // Fetch and store user profile
    const userProfile = await fetchUserProfile();
    localStorage.setItem("user", JSON.stringify(userProfile));
    
    return { ...res.data, user: userProfile };
  } catch (error) {
    throw error;
  }
};

// Logout user
export const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// Refresh access token
export const handleRefreshToken = async () => {
  try {
    const token = localStorage.getItem("refreshToken");
    if (!token) {
      throw new Error("No refresh token available");
    }
    const res = await refreshToken({ refresh: token });
    localStorage.setItem("accessToken", res.data.access);
    return res.data;
  } catch (error) {
    handleLogout();
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

// Get current user from storage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

// ======================================
// Profile Management
// ======================================

// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const res = await getUserProfile();
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateProfile = async (formData) => {
  try {
    const res = await updateUserProfile(formData);
    
    // Update stored user data
    localStorage.setItem("user", JSON.stringify(res.data));
    
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append("profile_picture", file);
    
    const res = await updateUserProfile(formData);
    localStorage.setItem("user", JSON.stringify(res.data));
    
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ======================================
// Password Management
// ======================================

// Change password
export const handleChangePassword = async (data) => {
  try {
    const res = await changePassword(data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Request password reset
export const handlePasswordResetRequest = async (email) => {
  try {
    const res = await requestPasswordReset({ email });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Confirm password reset
export const handlePasswordResetConfirm = async (uidb64, token, newPassword, confirmPassword) => {
  try {
    const res = await confirmPasswordReset(uidb64, token, {
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
