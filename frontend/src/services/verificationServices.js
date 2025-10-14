import { 
    submitUserVerification,
    submitHostelVerification,
    submitRoomVerification,
    getVerificationStatus,
    getVerificationRequirements,
    getMyVerificationRequests,
    getVerificationRequest
} from "../api/verification";

// User Verification Services
export const handleUserVerification = async (cnicFront, cnicBack, passportPhoto, profileImage = null) => {
    try {
        const response = await submitUserVerification({
            cnic_front: cnicFront,
            cnic_back: cnicBack,
            passport_photo: passportPhoto,
            profile_image: profileImage
        });
        return { success: true, data: response.data, message: 'User verification request submitted successfully' };
    } catch (error) {
        console.error('Failed to submit user verification:', error);
        return { 
            success: false, 
            message: error.response?.data?.error || 'Failed to submit user verification' 
        };
    }
};

// Hostel Verification Services
export const handleHostelVerification = async (hostelId, utilityBill, location = null) => {
    try {
        const response = await submitHostelVerification({
            hostel_id: hostelId,
            utility_bill: utilityBill,
            latitude: location?.lat,
            longitude: location?.lng
        });
        return { success: true, data: response.data, message: 'Hostel verification request submitted successfully' };
    } catch (error) {
        console.error('Failed to submit hostel verification:', error);
        return { 
            success: false, 
            message: error.response?.data?.error || 'Failed to submit hostel verification' 
        };
    }
};

// Room Verification Services
export const handleRoomVerification = async (roomId, images) => {
    try {
        const response = await submitRoomVerification({
            room_id: roomId,
            images: images
        });
        return { success: true, data: response.data, message: 'Room verification request submitted successfully' };
    } catch (error) {
        console.error('Failed to submit room verification:', error);
        return { 
            success: false, 
            message: error.response?.data?.error || 'Failed to submit room verification' 
        };
    }
};

// Status and Requirements Services
export const fetchVerificationStatus = async () => {
    try {
        const response = await getVerificationStatus();
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch verification status:', error);
        return { 
            success: false, 
            data: {
                user_verification: { status: 'not_submitted' },
                hostel_verifications: {},
                room_verifications: {}
            },
            message: 'Failed to fetch verification status' 
        };
    }
};

export const fetchVerificationRequirements = async () => {
    try {
        const response = await getVerificationRequirements();
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch verification requirements:', error);
        return { 
            success: false, 
            data: {},
            message: 'Failed to fetch verification requirements' 
        };
    }
};

export const fetchMyVerificationRequests = async () => {
    try {
        const response = await getMyVerificationRequests();
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch verification requests:', error);
        return { 
            success: false, 
            data: [],
            message: 'Failed to fetch verification requests' 
        };
    }
};

export const fetchVerificationRequest = async (id) => {
    try {
        const response = await getVerificationRequest(id);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to fetch verification request:', error);
        return { 
            success: false, 
            data: null,
            message: 'Failed to fetch verification request' 
        };
    }
};

// Helper functions
export const getVerificationStatusBadge = (status) => {
    const statusConfig = {
        'not_submitted': { variant: 'secondary', text: 'Not Submitted', icon: 'fas fa-circle' },
        'pending': { variant: 'warning', text: 'Pending Review', icon: 'fas fa-clock' },
        'approved': { variant: 'success', text: 'Approved', icon: 'fas fa-check-circle' },
        'rejected': { variant: 'danger', text: 'Rejected', icon: 'fas fa-times-circle' }
    };
    
    return statusConfig[status] || statusConfig['not_submitted'];
};

export const canSubmitVerification = (type, status) => {
    if (type === 'user') {
        return status !== 'pending' && status !== 'approved';
    } else if (type === 'hostel') {
        return status !== 'pending' && status !== 'approved';
    } else if (type === 'room') {
        return status !== 'pending' && status !== 'approved';
    }
    return false;
};

export const getNextVerificationStep = (userStatus, hostelStatuses, roomStatuses) => {
    if (userStatus !== 'approved') {
        return { type: 'user', message: 'Complete user verification first' };
    }
    
    const hasUnverifiedHostels = Object.values(hostelStatuses).some(status => 
        status.status !== 'approved'
    );
    
    if (hasUnverifiedHostels) {
        return { type: 'hostel', message: 'Complete hostel verification' };
    }
    
    const hasUnverifiedRooms = Object.values(roomStatuses).some(status => 
        status.status !== 'approved'
    );
    
    if (hasUnverifiedRooms) {
        return { type: 'room', message: 'Complete room verification' };
    }
    
    return { type: 'complete', message: 'All verifications completed' };
};
