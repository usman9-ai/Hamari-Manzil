import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchMyRooms, handleDeleteRoom, handleUpdateRoom, handleCreateRoom, handleToggleAvailability } from '../../services/roomServices';
import { fetchMyHostels } from '../../services/hostelServices';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import ToastContainer from '../../components/ui/ToastContainer';
import useToast from '../../hooks/useToast';
import RoomForm from './RoomForm';

const RoomsList = () => {
    const [rooms, setRooms] = useState([]);
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterHostelId, setFilterHostelId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { toasts, showSuccess, showError, removeToast } = useToast();

    // Helper function to construct Cloudinary URL
    const getCloudinaryUrl = (media) => {
        if (!media) return null;
        
        let url;
        // If it already contains the full Cloudinary URL, return as is
        if (media.startsWith('http')) {
            url = media;
        } else if (media.includes('image/upload/')) {
            // If it's a partial path that already contains image/upload/, construct URL without adding another image/upload/
            // Extract the part after image/upload/ and use it as the public_id
            const publicId = media.split('image/upload/')[1];
            url = `https://res.cloudinary.com/musa-bukhari/image/upload/w_400,h_200,c_fill,q_auto,f_auto/${publicId}`;
        } else {
            // Otherwise construct the URL with the media as public_id
            url = `https://res.cloudinary.com/musa-bukhari/image/upload/w_400,h_200,c_fill,q_auto,f_auto/${media}`;
        }
        
        // Add cache-busting parameter with a more stable approach
        const cacheBuster = Math.floor(Date.now() / 1000); // Changes every second instead of every millisecond
        return `${url}?t=${cacheBuster}`;
    };

    useEffect(() => {
        loadData();

        // Check for hostelId in URL params or location state
        const params = new URLSearchParams(location.search);
        const hostelIdFromUrl = params.get('hostelId');
        const hostelIdFromState = location.state?.hostelId;

        if (hostelIdFromUrl) {
            setFilterHostelId(hostelIdFromUrl);
        } else if (hostelIdFromState) {
            setFilterHostelId(hostelIdFromState.toString());
        }
    }, [location]);

    const loadData = async () => {
        setLoading(true);
        try {
        const [roomsResult, hostelsResult] = await Promise.all([
                fetchMyRooms(),
                fetchMyHostels()
        ]);
            if (roomsResult.success) {
                console.log('Loaded rooms:', roomsResult.data);
                setRooms(roomsResult.data);
                
                // Debug: Log media and hostel information for each room
                roomsResult.data.forEach((room, index) => {
                    console.log(`Room ${index + 1} (ID: ${room.id}):`, {
                        media: room.media,
                        images: room.images,
                        hostel: room.hostel,
                        hostel_type: typeof room.hostel,
                        hostel_name: room.hostel_name,
                        constructedUrl: getCloudinaryUrl(room.media)
                    });
                });
            }
        if (hostelsResult.success) {
                console.log('Loaded hostels for filter:', hostelsResult.data);
            setHostels(hostelsResult.data);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            showError('Error', 'Failed to load rooms and hostels');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                const result = await handleDeleteRoom(id);
            if (result.success) {
                    showSuccess('Success!', 'Room deleted successfully');
                loadData();
                } else {
                    showError('Error', result.message);
                }
            } catch (error) {
                console.error('Failed to delete room:', error);
                showError('Error', 'Failed to delete room');
            }
        }
    };

    const toggleAvailability = async (room) => {
        try {
            const result = await handleToggleAvailability(room.id, !room.is_available);
        if (result.success) {
                showSuccess('Success!', `Room ${room.is_available ? 'marked as unavailable' : 'marked as available'}`);
            loadData();
            } else {
                showError('Error', result.message);
            }
        } catch (error) {
            console.error('Failed to toggle room availability:', error);
            showError('Error', 'Failed to update room availability');
        }
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setShowModal(true);
    };

    const handleFormSubmit = async (formData) => {
        setSubmitting(true);
        try {
            const result = editingRoom
                ? await handleUpdateRoom(editingRoom.id, formData)
                : await handleCreateRoom(formData);

            if (result.success) {
                showSuccess('Success!', editingRoom ? 'Room updated successfully' : 'Room created successfully');
                setShowModal(false);
                setEditingRoom(null);
                loadData();
            } else {
                showError('Error', result.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showError('Error', 'An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = searchTerm === '' || 
            room.id.toString().includes(searchTerm) ||
            room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.hostel_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filterType || room.room_type === filterType;
        const matchesStatus = !filterStatus || 
            (filterStatus === 'available' && room.is_available) ||
            (filterStatus === 'unavailable' && !room.is_available);
        const matchesHostel = !filterHostelId || 
            room.hostel === parseInt(filterHostelId) || 
            room.hostel === filterHostelId ||
            String(room.hostel) === String(filterHostelId);
        
        // Debug logging
        if (searchTerm || filterType || filterStatus || filterHostelId) {
                console.log(`Room ${room.id} filter check:`, {
                room_id: room.id,
                room_type: room.room_type,
                is_available: room.is_available,
                hostel: room.hostel,
                hostel_type: typeof room.hostel,
                searchTerm,
                filterType,
                filterStatus,
                filterHostelId,
                filterHostelId_type: typeof filterHostelId,
                parseInt_filterHostelId: parseInt(filterHostelId),
                matchesSearch,
                matchesType,
                matchesStatus,
                matchesHostel,
                finalMatch: matchesSearch && matchesType && matchesStatus && matchesHostel
            });
        }
        
        return matchesSearch && matchesType && matchesStatus && matchesHostel;
    });

    // Debug: Log filtered results when hostel filter is active
    if (filterHostelId) {
        console.log('=== HOSTEL FILTER DEBUG ===');
        console.log('Selected hostel ID:', filterHostelId, 'Type:', typeof filterHostelId);
        console.log('Total rooms:', rooms.length);
        console.log('Filtered rooms:', filteredRooms.length);
        
        // Test different comparison methods
        const roomsByHostelId = rooms.filter(room => room.hostel === parseInt(filterHostelId));
        const roomsByHostelIdString = rooms.filter(room => String(room.hostel) === String(filterHostelId));
        const roomsByHostelIdDirect = rooms.filter(room => room.hostel === filterHostelId);
        
        console.log('Rooms by parseInt:', roomsByHostelId.length);
        console.log('Rooms by String conversion:', roomsByHostelIdString.length);
        console.log('Rooms by direct comparison:', roomsByHostelIdDirect.length);
        
        // Show all room hostel IDs
        console.log('All room hostel IDs:', rooms.map(room => ({ id: room.id, hostel: room.hostel, hostel_name: room.hostel_name })));
        console.log('========================');
    }

    // Get the filtered hostel name if filtering by hostel
    const filteredHostel = filterHostelId ? hostels.find(h => h.id === parseInt(filterHostelId)) : null;

    const getStatusBadge = (status) => {
        const config = {
            available: {
                variant: 'success',
                icon: 'fa-check-circle',
                text: 'Available'
            },
            occupied: {
                variant: 'warning',
                icon: 'fa-users',
                text: 'Occupied'
            },
            maintenance: {
                variant: 'danger',
                icon: 'fa-tools',
                text: 'Maintenance'
            },
        };

        const statusConfig = config[status] || { variant: 'default', icon: 'fa-circle', text: status };

        return (
            <Badge variant={statusConfig.variant}>
                <i className={`fas ${statusConfig.icon} me-1`}></i>
                {statusConfig.text}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-3">Loading rooms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold mb-1">
                        {filteredHostel ? `Rooms - ${filteredHostel.name}` : 'Manage Rooms'}
                    </h1>
                    <p className="text-muted">
                        {filteredHostel
                            ? `${filteredHostel.city} • View and manage rooms for this hostel`
                            : 'View and manage all your room listings'
                        }
                    </p>
                    {filteredHostel && (
                        <button
                            className="btn btn-sm btn-outline-secondary mt-2"
                            onClick={() => {
                                setFilterHostelId('');
                                navigate('/hostel/rooms');
                            }}
                        >
                            <i className="fas fa-times me-2"></i>
                            Clear Filter
                        </button>
                    )}
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => { setEditingRoom(null); setShowModal(true); }}
                >
                    <i className="fas fa-plus me-2"></i>
                    Add New Room
                </button>
            </div>

            {/* Filters */}
            <Card className="mb-4">
                <CardContent className="p-4">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by room ID, description, or hostel..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filterHostelId}
                                onChange={(e) => {
                                    console.log('Hostel filter changed to:', e.target.value);
                                    setFilterHostelId(e.target.value);
                                }}
                            >
                                <option value="">All Hostels</option>
                                {hostels.map((hostel) => (
                                    <option key={hostel.id} value={hostel.id}>
                                        {hostel.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="shared">Shared</option>
                                <option value="ind">Independent</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterType('');
                                    setFilterStatus('');
                                    setFilterHostelId('');
                                    navigate('/hostel/rooms');
                                }}
                            >
                                <i className="fas fa-redo me-2"></i>
                                Reset
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filter Summary */}
            {(searchTerm || filterType || filterStatus || filterHostelId) && (
                <div className="mb-3">
                    <div className="alert alert-info">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Filtered Results:</strong> {filteredRooms.length} of {rooms.length} rooms
                                {filterHostelId && (
                                    <span className="ms-2">
                                        <i className="fas fa-building me-1"></i>
                                        Hostel: {hostels.find(h => h.id === parseInt(filterHostelId))?.name || 'Unknown'}
                                    </span>
                                )}
                            </div>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterType('');
                                    setFilterStatus('');
                                    setFilterHostelId('');
                                }}
                            >
                                <i className="fas fa-times me-1"></i>
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rooms Grid */}
            {filteredRooms.length === 0 ? (
                <Card>
                    <CardContent className="p-5">
                        <div className="text-center">
                            <i className="fas fa-bed fa-4x text-muted mb-3"></i>
                            <h4>No rooms found</h4>
                            <p className="text-muted">
                                {searchTerm || filterType || filterStatus
                                    ? 'Try adjusting your filters'
                                    : 'Add your first room to get started'}
                            </p>
                            <div className="d-flex gap-2 mt-3">
                            <button
                                type="button"
                                    className="btn btn-primary"
                                onClick={() => { setEditingRoom(null); setShowModal(true); }}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Add New Room
                            </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        console.log('Refreshing room data...');
                                        loadData();
                                    }}
                                >
                                    <i className="fas fa-sync-alt me-2"></i>
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="row g-4">
                    {filteredRooms.map((room) => (
                        <div key={room.id} className="col-lg-4 col-md-6">
                            <Card className="h-100 overflow-hidden hover-shadow" style={{ transition: 'box-shadow 0.3s' }}>
                                {/* Room Image */}
                                {(room.media || (room.images && room.images.length > 0)) ? (
                                    <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                        <img
                                            src={(() => {
                                                const mediaUrl = getCloudinaryUrl(room.media);
                                                const fallbackUrl = room.images && room.images.length > 0 ? room.images[0].secure_url : null;
                                                const finalUrl = mediaUrl || fallbackUrl;
                                                
                                                console.log(`Room ${room.id} image debug:`, {
                                                    roomMedia: room.media,
                                                    mediaUrl: mediaUrl,
                                                    fallbackUrl: fallbackUrl,
                                                    finalUrl: finalUrl,
                                                    roomImages: room.images
                                                });
                                                
                                                return finalUrl;
                                            })()}
                                            alt={`Room ${room.id}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                console.error(`Image failed to load for room ${room.id}:`, e.target.src);
                                                // Don't show fallback image, just hide the image container
                                                e.target.style.display = 'none';
                                            }}
                                            onLoad={(e) => {
                                                console.log(`Image loaded successfully for room ${room.id}:`, e.target.src);
                                            }}
                                        />
                                    
                                    {/* Available Status Badge - Top Left */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px'
                                    }}>
                                        <span style={{
                                            background: room.is_available ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <i className={`fas fa-${room.is_available ? 'check-circle' : 'times-circle'}`}></i>
                                            {room.is_available ? 'Available' : 'Unavailable'}
                                        </span>
                                        </div>
                                    
                                    {/* Photo Count Badge - Bottom Right */}
                                    <div style={{
                                                    position: 'absolute',
                                                    bottom: '10px',
                                        right: '10px'
                                    }}>
                                        <span style={{
                                            background: 'rgba(0, 0, 0, 0.7)',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <i className="fas fa-camera"></i>
                                            {room.images ? room.images.length + (room.media ? 1 : 0) : (room.media ? 1 : 0)}
                                        </span>
                                    </div>
                                </div>
                                ) : (
                                    // No image placeholder
                                    <div style={{ 
                                        position: 'relative', 
                                        height: '200px', 
                                        background: '#f8f9fa',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#6c757d'
                                    }}>
                                        <div className="text-center">
                                            <i className="fas fa-image fa-3x mb-2"></i>
                                            <p className="mb-0">No Image</p>
                                            </div>
                                    </div>
                                )}

                                <CardContent className="p-3">
                                    {/* Header */}
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 className="mb-1 fw-bold">Room {room.id}</h6>
                                            <p className="text-muted small mb-0">
                                                {room.hostel_name || 'Unknown Hostel'}
                                                {console.log('Room hostel data:', room.hostel, 'hostel_name:', room.hostel_name)}
                                            </p>
                                        </div>
                                        <span style={{
                                            background: '#007bff',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}>
                                            {room.room_type?.charAt(0).toUpperCase() + room.room_type?.slice(1) || 'Shared'}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-4">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold text-dark fs-5">{room.total_capacity || 0}</div>
                                                <small className="text-muted" style={{ fontSize: '11px' }}>Capacity</small>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold text-success fs-5">{room.available_capacity || 0}</div>
                                                <small className="text-muted" style={{ fontSize: '11px' }}>Available</small>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold text-dark fs-5">Rs{Math.round((room.rent || 0) / 1000)}k</div>
                                                <small className="text-muted" style={{ fontSize: '11px' }}>Rent</small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    <div className="mb-3">
                                        <div className="d-flex flex-wrap gap-1">
                                            {room.facilities && room.facilities.slice(0, 3).map((facility, index) => (
                                                <span key={index} style={{
                                                    background: '#f8f9fa',
                                                    color: '#495057',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                    border: '1px solid #dee2e6'
                                                }}>
                                                    {facility.charAt(0).toUpperCase() + facility.slice(1)}
                                                </span>
                                            ))}
                                            {room.facilities && room.facilities.length > 3 && (
                                                <span style={{
                                                    background: '#6c757d',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: '500'
                                                }}>
                                                    +{room.facilities.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary flex-grow-1"
                                            onClick={() => handleEdit(room)}
                                            style={{
                                                borderColor: '#6f42c1',
                                                color: '#6f42c1',
                                                fontWeight: '500'
                                            }}
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(room.id)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            {/* Room Form Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingRoom ? 'Edit Room' : 'Add New Room'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingRoom(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <RoomForm
                                    room={editingRoom}
                                    onSubmit={handleFormSubmit}
                                    onCancel={() => {
                                        setShowModal(false);
                                        setEditingRoom(null);
                                    }}
                                    submitting={submitting}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomsList;
