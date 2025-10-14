import { 
    createRoom, 
    fetchMyRooms as apiFetchMyRooms, 
    updateRoom, 
    deleteRoom, 
    updateRoomAvailability,
    uploadRoomImages,
    fetchRoomFacilities as apiFetchRoomFacilities 
} from "../api/rooms";

// Create room
export const handleCreateRoom = async (formData) => {
    try {
        console.log('Creating room with data:', formData);
        const response = await createRoom(formData);
        console.log('Room created successfully:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to create room:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.detail || 
                            error.response?.data?.errors ||
                            error.message || 
                            'Failed to create room';
        return { success: false, message: errorMessage };
    }
};

// Fetch my rooms
export const fetchMyRooms = async () => {
    try {
        const response = await apiFetchMyRooms();
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch rooms:', error);
        return { success: false, data: [], message: 'Failed to fetch rooms' };
    }
};

// Update room
export const handleUpdateRoom = async (id, formData) => {
    try {
        console.log('Updating room with data:', formData);
        const response = await updateRoom(id, formData);
        console.log('Room updated successfully:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to update room:', error);
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.detail || 
                            error.message || 
                            'Failed to update room';
        return { success: false, message: errorMessage };
    }
};

// Delete room
export const handleDeleteRoom = async (id) => {
    try {
        await deleteRoom(id);
        return { success: true, message: 'Room deleted successfully' };
    } catch (error) {
        console.error('Failed to delete room:', error);
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.detail || 
                            error.message || 
                            'Failed to delete room';
        return { success: false, message: errorMessage };
    }
};

// Toggle room availability
export const handleToggleAvailability = async (id, isAvailable) => {
    try {
        const response = await updateRoomAvailability(id, isAvailable);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to update room availability:', error);
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.detail || 
                            error.message || 
                            'Failed to update room availability';
        return { success: false, message: errorMessage };
    }
};

// Upload room images
export const handleUploadRoomImages = async (roomId, images) => {
    try {
        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append('images', image);
        });
        
        const response = await uploadRoomImages(roomId, formData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to upload room images:', error);
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.detail || 
                            error.message || 
                            'Failed to upload room images';
        return { success: false, message: errorMessage };
    }
};

// Fetch room facilities
export const fetchRoomFacilities = async () => {
    try {
        const response = await apiFetchRoomFacilities();
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch room facilities:', error);
        return { success: false, data: [], message: 'Failed to fetch room facilities' };
    }
};
