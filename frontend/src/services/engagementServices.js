import { 
    getReviews, 
    createReview, 
    updateReview, 
    deleteReview, 
    getHostelReviews,
    respondToReview,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    checkFavorite,
    logInteraction,
    searchHostels
} from "../api/engagement";

// Reviews Services
export const fetchReviews = async (hostelId = null) => {
    try {
        const response = await getReviews(hostelId);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return { success: false, data: [], message: 'Failed to fetch reviews' };
    }
};

export const fetchHostelReviews = async (hostelId) => {
    try {
        const response = await getHostelReviews(hostelId);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch hostel reviews:', error);
        return { success: false, data: [], message: 'Failed to fetch hostel reviews' };
    }
};

export const handleCreateReview = async (reviewData) => {
    try {
        const response = await createReview(reviewData);
        return { success: true, data: response.data, message: 'Review created successfully' };
    } catch (error) {
        console.error('Failed to create review:', error);
        return { 
            success: false, 
            message: error.response?.data?.detail || 'Failed to create review' 
        };
    }
};

export const handleUpdateReview = async (reviewId, reviewData) => {
    try {
        const response = await updateReview(reviewId, reviewData);
        return { success: true, data: response.data, message: 'Review updated successfully' };
    } catch (error) {
        console.error('Failed to update review:', error);
        return { 
            success: false, 
            message: error.response?.data?.detail || 'Failed to update review' 
        };
    }
};

export const handleDeleteReview = async (reviewId) => {
    try {
        await deleteReview(reviewId);
        return { success: true, message: 'Review deleted successfully' };
    } catch (error) {
        console.error('Failed to delete review:', error);
        return { 
            success: false, 
            message: error.response?.data?.detail || 'Failed to delete review' 
        };
    }
};

export const handleRespondToReview = async (reviewId, response) => {
    try {
        const response_data = await respondToReview(reviewId, response);
        return { success: true, data: response_data.data, message: 'Response added successfully' };
    } catch (error) {
        console.error('Failed to respond to review:', error);
        return { 
            success: false, 
            message: error.response?.data?.detail || 'Failed to respond to review' 
        };
    }
};

// Favorites Services
export const fetchFavorites = async () => {
    try {
        const response = await getFavorites();
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch favorites:', error);
        return { success: false, data: [], message: 'Failed to fetch favorites' };
    }
};

export const handleAddToFavorites = async (hostelId) => {
    try {
        const response = await addToFavorites({ hostel: hostelId });
        return { success: true, data: response.data, message: 'Added to favorites' };
    } catch (error) {
        console.error('Failed to add to favorites:', error);
        return { 
            success: false, 
            message: error.response?.data?.detail || 'Failed to add to favorites' 
        };
    }
};

export const handleRemoveFromFavorites = async (favoriteId) => {
    try {
        await removeFromFavorites(favoriteId);
        return { success: true, message: 'Removed from favorites' };
    } catch (error) {
        console.error('Failed to remove from favorites:', error);
        return { 
            success: false, 
            message: error.response?.data?.detail || 'Failed to remove from favorites' 
        };
    }
};

export const handleCheckFavorite = async (hostelId) => {
    try {
        const response = await checkFavorite(hostelId);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to check favorite status:', error);
        return { success: false, data: { is_favorite: false } };
    }
};

// Interaction Services
export const handleLogInteraction = async (interactionData) => {
    try {
        const response = await logInteraction(interactionData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to log interaction:', error);
        return { 
            success: false, 
            message: error.response?.data?.detail || 'Failed to log interaction' 
        };
    }
};

// Search Services
export const handleSearchHostels = async (searchData) => {
    try {
        const response = await searchHostels(searchData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to search hostels:', error);
        return { 
            success: false, 
            data: { count: 0, results: [] }, 
            message: error.response?.data?.detail || 'Failed to search hostels' 
        };
    }
};
