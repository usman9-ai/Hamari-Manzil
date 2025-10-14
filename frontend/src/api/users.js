import api from "./index"; // your axios base instance

// ✅ Register new user
export const registerUser = (data) => api.post("/users/register/", data);

// ✅ Login user and get JWT tokens
export const loginUser = (data) => api.post("/users/login/", data);

// ✅ Refresh JWT token
export const refreshToken = (data) => api.post("/users/refresh/", data);

// ✅ Verify user email (called from frontend VerifyEmailPage)
export const verifyEmail = (uidb64, token) =>
  api.get(`/users/verify/${uidb64}/${token}/`);

// ✅ Get logged-in user profile
export const getUserProfile = () => api.get("/users/profile/");

// ✅ Update logged-in user profile
export const updateUserProfile = (data) => api.put("/users/profile/", data);

// ✅ Change password (requires old + new password)
export const changePassword = (data) =>
  api.put("/users/change-password/", data);

// ✅ Request password reset email
export const requestPasswordReset = (data) =>
  api.post("/users/reset-password/", data);

// ✅ Confirm new password using reset link
export const confirmPasswordReset = (uidb64, token, data) =>
  api.post(`/users/reset-password/${uidb64}/${token}/`, data);
