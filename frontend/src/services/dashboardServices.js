import { getOwnerDashboard, getHostelAnalytics } from "../api/dashboard";

// Dashboard Services
export const fetchOwnerDashboard = async () => {
    try {
        const response = await getOwnerDashboard();
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        return { 
            success: false, 
            data: null,
            message: error.response?.data?.error || 'Failed to fetch dashboard data' 
        };
    }
};

export const fetchHostelAnalytics = async (hostelId) => {
    try {
        const response = await getHostelAnalytics(hostelId);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch hostel analytics:', error);
        return { 
            success: false, 
            data: null,
            message: error.response?.data?.error || 'Failed to fetch hostel analytics' 
        };
    }
};

