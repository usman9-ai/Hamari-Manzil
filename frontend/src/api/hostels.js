import api from "./index";

// ✅ Create new hostel
export const createHostel = (data) => api.post("/hostels/create-hostels/", data);

// ✅ Get my hostels (owner)
export const getMyHostels = () => api.get("/hostels/my-hostels/");

// ✅ Update hostel
export const updateHostel = (id, data) => api.patch(`/hostels/edit-hostel/${id}/`, data);

// ✅ Delete hostel
export const deleteHostel = (id) => api.delete(`/hostels/delete-hostel/${id}/`);

// ✅ Get hostel facilities list
export const getHostelFacilities = () => api.get("/hostels/hostel-facilities/");

