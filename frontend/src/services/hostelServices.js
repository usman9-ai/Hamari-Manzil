import {
  createHostel,
  getMyHostels,
  updateHostel,
  deleteHostel,
  getHostelFacilities,
} from "../api/hostels";

// Create new hostel
export const handleCreateHostel = async (hostelData) => {
  try {
    const res = await createHostel(hostelData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get all my hostels
export const fetchMyHostels = async () => {
  try {
    const res = await getMyHostels();
    return { success: true, data: res.data };
  } catch (error) {
    console.error('Failed to fetch hostels:', error);
    return { success: false, data: [], message: 'Failed to fetch hostels' };
  }
};

// Update hostel
export const handleUpdateHostel = async (id, hostelData) => {
  try {
    const res = await updateHostel(id, hostelData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Delete hostel
export const handleDeleteHostel = async (id) => {
  try {
    await deleteHostel(id);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Get facilities options
export const fetchHostelFacilities = async () => {
  try {
    const res = await getHostelFacilities();
    return res.data;
  } catch (error) {
    throw error;
  }
};

