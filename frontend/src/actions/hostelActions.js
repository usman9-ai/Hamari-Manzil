import {
    dummyHostels,
    dummyRooms,
    dummyBookings,
    dummyStats,
    dummyReviews,
    dummyReports,
    dummyVerificationRequests,
    bookingTrends,
    revenueTrends,
    interactionTrends,
} from '../services/hostelDummyData';

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Local storage keys
const HOSTELS_KEY = 'hostelPortal_hostels';
const ROOMS_KEY = 'hostelPortal_rooms';
const BOOKINGS_KEY = 'hostelPortal_bookings';
const REVIEWS_KEY = 'hostelPortal_reviews';
const REPORTS_KEY = 'hostelPortal_reports';
const VERIFICATION_KEY = 'hostelPortal_verifications';

// Initialize local storage with dummy data
const initializeStorage = () => {
    if (!localStorage.getItem(HOSTELS_KEY)) {
        localStorage.setItem(HOSTELS_KEY, JSON.stringify(dummyHostels));
    }
    if (!localStorage.getItem(ROOMS_KEY)) {
        localStorage.setItem(ROOMS_KEY, JSON.stringify(dummyRooms));
    }
    if (!localStorage.getItem(BOOKINGS_KEY)) {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(dummyBookings));
    }
    if (!localStorage.getItem(REVIEWS_KEY)) {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(dummyReviews));
    }
    if (!localStorage.getItem(REPORTS_KEY)) {
        localStorage.setItem(REPORTS_KEY, JSON.stringify(dummyReports));
    }
    if (!localStorage.getItem(VERIFICATION_KEY)) {
        localStorage.setItem(VERIFICATION_KEY, JSON.stringify(dummyVerificationRequests));
    }
};

// Get data from localStorage
const getFromStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
};

// Save data to localStorage
const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// ========== HOSTEL ACTIONS ==========

export const getHostels = async (filters = {}) => {
    await delay(500);
    initializeStorage();

    let hostels = getFromStorage(HOSTELS_KEY);

    // Apply filters
    if (filters.city) {
        hostels = hostels.filter(h => h.city.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.gender) {
        hostels = hostels.filter(h => h.gender === filters.gender);
    }
    if (filters.verified !== undefined) {
        hostels = hostels.filter(h => h.verified === filters.verified);
    }
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        hostels = hostels.filter(h =>
            h.name.toLowerCase().includes(searchLower) ||
            h.address.toLowerCase().includes(searchLower)
        );
    }

    return { success: true, data: hostels };
};

export const getHostelById = async (id) => {
    await delay(300);
    initializeStorage();

    const hostels = getFromStorage(HOSTELS_KEY);
    const hostel = hostels.find((h) => h.id === parseInt(id));

    if (!hostel) {
        return { success: false, message: 'Hostel not found' };
    }

    return { success: true, data: hostel };
};

export const createHostel = async (data) => {
    await delay(800);
    initializeStorage();

    const hostels = getFromStorage(HOSTELS_KEY);
    const newHostel = {
        id: Date.now(),
        ...data,
        occupiedRooms: 0,
        rating: 0,
        reviews: 0,
        verified: false,
        createdAt: new Date().toISOString().split('T')[0],
    };

    hostels.push(newHostel);
    saveToStorage(HOSTELS_KEY, hostels);

    return {
        success: true,
        message: 'Hostel created successfully',
        data: newHostel,
    };
};

export const updateHostel = async (id, data) => {
    await delay(800);
    initializeStorage();

    const hostels = getFromStorage(HOSTELS_KEY);
    const index = hostels.findIndex((h) => h.id === parseInt(id));

    if (index === -1) {
        return { success: false, message: 'Hostel not found' };
    }

    hostels[index] = { ...hostels[index], ...data };
    saveToStorage(HOSTELS_KEY, hostels);

    return { success: true, message: 'Hostel updated successfully', data: hostels[index] };
};

export const deleteHostel = async (id) => {
    await delay(500);
    initializeStorage();

    const hostels = getFromStorage(HOSTELS_KEY);
    const filteredHostels = hostels.filter((h) => h.id !== parseInt(id));

    if (hostels.length === filteredHostels.length) {
        return { success: false, message: 'Hostel not found' };
    }

    saveToStorage(HOSTELS_KEY, filteredHostels);

    // Also delete associated rooms
    const rooms = getFromStorage(ROOMS_KEY);
    const filteredRooms = rooms.filter((r) => r.hostelId !== parseInt(id));
    saveToStorage(ROOMS_KEY, filteredRooms);

    return { success: true, message: 'Hostel deleted successfully' };
};

// ========== ROOM ACTIONS ==========

export const getRooms = async (hostelId = null, filters = {}) => {
    await delay(500);
    initializeStorage();

    let rooms = getFromStorage(ROOMS_KEY);

    // Filter by hostel
    if (hostelId) {
        rooms = rooms.filter((r) => r.hostelId === parseInt(hostelId));
    }

    // Apply additional filters
    if (filters.type) {
        rooms = rooms.filter(r => r.type === filters.type);
    }
    if (filters.status) {
        rooms = rooms.filter(r => r.status === filters.status);
    }
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        rooms = rooms.filter(r =>
            r.roomNumber.toLowerCase().includes(searchLower) ||
            r.hostelName.toLowerCase().includes(searchLower)
        );
    }

    return { success: true, data: rooms };
};

export const getRoomById = async (id) => {
    await delay(300);
    initializeStorage();

    const rooms = getFromStorage(ROOMS_KEY);
    const room = rooms.find((r) => r.id === parseInt(id));

    if (!room) {
        return { success: false, message: 'Room not found' };
    }

    return { success: true, data: room };
};

export const createRoom = async (data) => {
    await delay(800);
    initializeStorage();

    const rooms = getFromStorage(ROOMS_KEY);
    const hostels = getFromStorage(HOSTELS_KEY);

    // Get hostel name
    const hostel = hostels.find(h => h.id === parseInt(data.hostelId));
    if (!hostel) {
        return { success: false, message: 'Hostel not found' };
    }

    const newRoom = {
        id: Date.now(),
        ...data,
        hostelName: hostel.name,
        occupiedBeds: 0,
        images: data.images || [],
        status: 'available',
        createdAt: new Date().toISOString().split('T')[0],
    };

    rooms.push(newRoom);
    saveToStorage(ROOMS_KEY, rooms);

    return {
        success: true,
        message: 'Room created successfully',
        data: newRoom,
    };
};

export const updateRoom = async (id, data) => {
    await delay(800);
    initializeStorage();

    const rooms = getFromStorage(ROOMS_KEY);
    const index = rooms.findIndex((r) => r.id === parseInt(id));

    if (index === -1) {
        return { success: false, message: 'Room not found' };
    }

    rooms[index] = { ...rooms[index], ...data };
    saveToStorage(ROOMS_KEY, rooms);

    return { success: true, message: 'Room updated successfully', data: rooms[index] };
};

export const deleteRoom = async (id) => {
    await delay(500);
    initializeStorage();

    const rooms = getFromStorage(ROOMS_KEY);
    const filteredRooms = rooms.filter((r) => r.id !== parseInt(id));

    if (rooms.length === filteredRooms.length) {
        return { success: false, message: 'Room not found' };
    }

    saveToStorage(ROOMS_KEY, filteredRooms);

    return { success: true, message: 'Room deleted successfully' };
};

// ========== BOOKING ACTIONS ==========

export const getBookings = async (filters = {}) => {
    await delay(500);
    initializeStorage();

    let bookings = getFromStorage(BOOKINGS_KEY);

    // Apply filters
    if (filters.status) {
        bookings = bookings.filter(b => b.status === filters.status);
    }
    if (filters.hostelId) {
        bookings = bookings.filter(b => b.hostelId === parseInt(filters.hostelId));
    }
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        bookings = bookings.filter(b =>
            b.studentName.toLowerCase().includes(searchLower) ||
            b.email.toLowerCase().includes(searchLower) ||
            b.hostelName.toLowerCase().includes(searchLower)
        );
    }

    return { success: true, data: bookings };
};

export const getBookingById = async (id) => {
    await delay(300);
    initializeStorage();

    const bookings = getFromStorage(BOOKINGS_KEY);
    const booking = bookings.find((b) => b.id === parseInt(id));

    if (!booking) {
        return { success: false, message: 'Booking not found' };
    }

    return { success: true, data: booking };
};

export const updateBookingStatus = async (id, status) => {
    await delay(500);
    initializeStorage();

    const bookings = getFromStorage(BOOKINGS_KEY);
    const index = bookings.findIndex((b) => b.id === parseInt(id));

    if (index === -1) {
        return { success: false, message: 'Booking not found' };
    }

    bookings[index].status = status;
    saveToStorage(BOOKINGS_KEY, bookings);

    return {
        success: true,
        message: `Booking ${status} successfully`,
        data: bookings[index],
    };
};

// ========== REVIEW ACTIONS ==========

export const getReviews = async (hostelId = null) => {
    await delay(500);
    initializeStorage();

    let reviews = getFromStorage(REVIEWS_KEY);

    if (hostelId) {
        reviews = reviews.filter(r => r.hostelId === parseInt(hostelId));
    }

    return { success: true, data: reviews };
};

export const submitReview = async (reviewData) => {
    await delay(500);
    initializeStorage();

    const reviews = getFromStorage(REVIEWS_KEY);
    const newReview = {
        id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
        hostelId: reviewData.hostelId,
        studentName: reviewData.studentName || 'Anonymous User',
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
        ownerResponse: null
    };

    reviews.push(newReview);
    saveToStorage(REVIEWS_KEY, reviews);

    return { success: true, data: newReview };
};

export const respondToReview = async (reviewId, response) => {
    await delay(500);
    initializeStorage();

    const reviews = getFromStorage(REVIEWS_KEY);
    const index = reviews.findIndex(r => r.id === parseInt(reviewId));

    if (index === -1) {
        return { success: false, message: 'Review not found' };
    }

    reviews[index].ownerResponse = response;
    reviews[index].respondedAt = new Date().toISOString().split('T')[0];
    saveToStorage(REVIEWS_KEY, reviews);

    return { success: true, message: 'Response added successfully', data: reviews[index] };
};

// ========== REPORT ACTIONS ==========

export const getReports = async (hostelId = null) => {
    await delay(500);
    initializeStorage();

    let reports = getFromStorage(REPORTS_KEY);

    if (hostelId) {
        reports = reports.filter(r => r.hostelId === parseInt(hostelId));
    }

    return { success: true, data: reports };
};

// ========== VERIFICATION ACTIONS ==========

export const getVerificationRequests = async () => {
    await delay(500);
    initializeStorage();

    const requests = getFromStorage(VERIFICATION_KEY);
    return { success: true, data: requests };
};

export const submitVerificationRequest = async (hostelId, documents) => {
    await delay(800);
    initializeStorage();

    const hostels = getFromStorage(HOSTELS_KEY);
    const hostel = hostels.find(h => h.id === parseInt(hostelId));

    if (!hostel) {
        return { success: false, message: 'Hostel not found' };
    }

    const requests = getFromStorage(VERIFICATION_KEY);

    // Check if already submitted
    const existingRequest = requests.find(r => r.hostelId === parseInt(hostelId));
    if (existingRequest) {
        return { success: false, message: 'Verification request already submitted' };
    }

    const newRequest = {
        id: Date.now(),
        hostelId: parseInt(hostelId),
        hostelName: hostel.name,
        status: 'pending',
        documents,
        submittedAt: new Date().toISOString().split('T')[0],
        reviewedAt: null,
        adminNotes: '',
    };

    requests.push(newRequest);
    saveToStorage(VERIFICATION_KEY, requests);

    return { success: true, message: 'Verification request submitted successfully', data: newRequest };
};

// ========== SOFT DELETE/DISABLE HOSTEL ==========

export const toggleHostelStatus = async (id) => {
    await delay(500);
    initializeStorage();

    const hostels = getFromStorage(HOSTELS_KEY);
    const index = hostels.findIndex(h => h.id === parseInt(id));

    if (index === -1) {
        return { success: false, message: 'Hostel not found' };
    }

    hostels[index].disabled = !hostels[index].disabled;
    saveToStorage(HOSTELS_KEY, hostels);

    const status = hostels[index].disabled ? 'disabled' : 'enabled';
    return { success: true, message: `Hostel ${status} successfully`, data: hostels[index] };
};

// ========== DASHBOARD STATS ==========

export const getDashboardStats = async () => {
    await delay(500);
    initializeStorage();

    const hostels = getFromStorage(HOSTELS_KEY);
    const rooms = getFromStorage(ROOMS_KEY);
    const bookings = getFromStorage(BOOKINGS_KEY);
    const reviews = getFromStorage(REVIEWS_KEY);
    const reports = getFromStorage(REPORTS_KEY);

    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const approvedBookings = bookings.filter(b => b.status === 'approved').length;
    const rejectedBookings = bookings.filter(b => b.status === 'rejected').length;

    const totalRevenue = bookings
        .filter(b => b.status === 'approved')
        .reduce((sum, b) => sum + (b.rent + b.deposit), 0);

    const monthlyRevenue = bookings
        .filter(b => {
            const bookingMonth = new Date(b.bookingDate).getMonth();
            const currentMonth = new Date().getMonth();
            return b.status === 'approved' && bookingMonth === currentMonth;
        })
        .reduce((sum, b) => sum + b.rent, 0);

    // Calculate total interactions
    const totalInteractions = hostels.reduce((sum, h) => sum + (h.interactions || 0), 0);

    // Calculate average rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    return {
        success: true,
        data: {
            totalHostels: hostels.filter(h => !h.disabled).length,
            totalRooms,
            availableRooms,
            occupiedRooms,
            totalBookings: bookings.length,
            pendingBookings,
            approvedBookings,
            rejectedBookings,
            occupancyRate,
            totalRevenue,
            monthlyRevenue,
            totalInteractions,
            avgRating,
            totalReviews: reviews.length,
            totalReports: reports.length,
            bookingTrends,
            revenueTrends,
            interactionTrends,
        },
    };
};
