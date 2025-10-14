import api from "./index";

// Dashboard API endpoints
export const getOwnerDashboard = () => api.get('/engagement/owner-dashboard/');
export const getHostelAnalytics = (hostelId) => api.get(`/engagement/hostel-analytics/${hostelId}/`);

