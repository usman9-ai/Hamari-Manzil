import api from "./index";

// Room API endpoints
export const createRoom = (data) => api.post("/hostels/create-room/", data);
export const fetchMyRooms = () => api.get("/hostels/my-rooms/");
export const updateRoom = (id, data) => api.patch(`/hostels/rooms/${id}/edit/`, data);
export const deleteRoom = (id) => api.delete(`/hostels/delete-room/${id}/`);
export const updateRoomAvailability = (id, isAvailable) => api.patch(`/hostels/rooms/${id}/availability/`, { is_available: isAvailable });
export const uploadRoomImages = (roomId, images) => api.post(`/hostels/rooms/${roomId}/upload-images/`, images);
export const fetchRoomFacilities = () => api.get("/hostels/room-facilities/");
