import api from "./index";

// Reviews API endpoints
export const getReviews = (hostelId = null) => {
    const params = hostelId ? { hostel_id: hostelId } : {};
    return api.get("/engagement/reviews/", { params });
};

export const createReview = (data) => api.post("/engagement/reviews/", data);

export const updateReview = (id, data) => api.patch(`/engagement/reviews/${id}/`, data);

export const deleteReview = (id) => api.delete(`/engagement/reviews/${id}/`);

export const getHostelReviews = (hostelId) => api.get(`/engagement/hostels/${hostelId}/reviews/`);

export const respondToReview = (reviewId, response) => api.post(`/engagement/reviews/${reviewId}/respond/`, { response });

// Favorites API endpoints
export const getFavorites = () => api.get("/engagement/favorites/");

export const addToFavorites = (data) => api.post("/engagement/favorites/", data);

export const removeFromFavorites = (id) => api.delete(`/engagement/favorites/${id}/`);

export const checkFavorite = (hostelId) => api.get(`/engagement/hostels/${hostelId}/favorite/`);

// Interaction API endpoints
export const logInteraction = (data) => api.post("/engagement/interactions/", data);

// Search API endpoints
export const searchHostels = (data) => api.post("/engagement/search/", data);
