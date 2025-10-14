import api from "./index";

// User Verification API endpoints
export const submitUserVerification = (data) => api.post("/moderation/verification-requests/request_user_verification/", data);

// Hostel Verification API endpoints
export const submitHostelVerification = (data) => api.post("/moderation/verification-requests/request_hostel_verification/", data);

// Room Verification API endpoints
export const submitRoomVerification = (data) => api.post("/moderation/verification-requests/request_room_verification/", data);

// Status and Requirements API endpoints
export const getVerificationStatus = () => api.get("/moderation/verification-requests/my_verification_status/");

export const getVerificationRequirements = () => api.get("/moderation/verification-requests/verification_requirements/");

// General verification requests
export const getMyVerificationRequests = () => api.get("/moderation/verification-requests/");

export const getVerificationRequest = (id) => api.get(`/moderation/verification-requests/${id}/`);

// Admin endpoints (for future admin panel)
export const approveVerification = (id, data) => api.post(`/moderation/verification-requests/${id}/approve/`, data);

export const rejectVerification = (id, data) => api.post(`/moderation/verification-requests/${id}/reject/`, data);
