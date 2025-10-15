import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRooms, deleteRoom, updateRoom, createRoom, getHostels } from '../../actions/hostelActions';
import { roomFacilitiesOptions } from '../../services/hostelDummyData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
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
        const [roomsResult, hostelsResult] = await Promise.all([
            getRooms(),
            getHostels()
        ]);
        if (roomsResult.success) {
            setRooms(roomsResult.data);
        }
        if (hostelsResult.success) {
            setHostels(hostelsResult.data);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            const result = await deleteRoom(id);
            if (result.success) {
                alert(result.message);
                loadData();
            }
        }
    };

    const toggleAvailability = async (room) => {
        const newStatus = room.status === 'available' ? 'occupied' : 'available';
        const result = await updateRoom(room.id, { status: newStatus });
        if (result.success) {
            loadData();
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
                ? await updateRoom(editingRoom.id, formData)
                : await createRoom(formData);

            if (result.success) {
                alert(result.message);
                setShowModal(false);
                setEditingRoom(null);
                loadData();
            } else {
                alert(result.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.hostelName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filterType || room.type === filterType;
        const matchesStatus = !filterStatus || room.status === filterStatus;
        const matchesHostel = !filterHostelId || room.hostelId === parseInt(filterHostelId);
        return matchesSearch && matchesType && matchesStatus && matchesHostel;
    });

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
            <Card className="mb-4 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                <CardContent className="p-4">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="fas fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search rooms..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ borderLeft: 'none' }}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="fas fa-home text-muted"></i>
                                </span>
                                <select
                                    className="form-select border-start-0"
                                    value={filterHostelId}
                                    onChange={(e) => setFilterHostelId(e.target.value)}
                                    style={{ borderLeft: 'none' }}
                                >
                                    <option value="">All Hostels</option>
                                    {hostels.map((hostel) => (
                                        <option key={hostel.id} value={hostel.id}>
                                            {hostel.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="fas fa-bed text-muted"></i>
                                </span>
                                <select
                                    className="form-select border-start-0"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    style={{ borderLeft: 'none' }}
                                >
                                    <option value="">All Types</option>
                                    <option value="shared">Shared</option>
                                    <option value="single">Single</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="fas fa-info-circle text-muted"></i>
                                </span>
                                <select
                                    className="form-select border-start-0"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    style={{ borderLeft: 'none' }}
                                >
                                    <option value="">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-primary w-100"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterType('');
                                    setFilterStatus('');
                                    setFilterHostelId('');
                                    navigate('/hostel/rooms');
                                }}
                                style={{ borderRadius: '8px', fontWeight: '600' }}
                            >
                                <i className="fas fa-redo me-2"></i>
                                Reset
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                            <button
                                type="button"
                                className="btn btn-primary mt-3"
                                onClick={() => { setEditingRoom(null); setShowModal(true); }}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Add New Room
                            </button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="row g-4">
                    {filteredRooms.map((room) => (
                        <div key={room.id} className="col-lg-4 col-md-6">
                            <Card className="h-100 overflow-hidden hover-shadow" style={{ transition: 'box-shadow 0.3s' }}>
                                {/* Room Image */}
                                {room.images && room.images.length > 0 && (
                                    <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                                        <img
                                            src={room.images[0]}
                                            alt={`Room ${room.roomNumber}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        {/* Status Badge */}
                                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                                            {getStatusBadge(room.status)}
                                        </div>
                                        {/* Photo Count */}
                                        {room.images.length > 1 && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '10px',
                                                    right: '10px',
                                                    background: 'rgba(0,0,0,0.7)',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                <i className="fas fa-camera me-1"></i>
                                                {room.images.length}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <CardContent className="p-3">
                                    {/* Header */}
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 className="mb-1 fw-bold">Room {room.roomNumber}</h6>
                                            <p className="text-muted small mb-0">{room.hostelName}</p>
                                        </div>
                                        <Badge variant="info" className="small">{room.type}</Badge>
                                    </div>

                                    {/* Stats */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-4">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold">{room.capacity}</div>
                                                <small className="text-muted" style={{ fontSize: '10px' }}>Capacity</small>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold text-success">{room.availableBeds}</div>
                                                <small className="text-muted" style={{ fontSize: '10px' }}>Available</small>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold" style={{ fontSize: '12px' }}>₨{(room.rent / 1000).toFixed(0)}k</div>
                                                <small className="text-muted" style={{ fontSize: '10px' }}>Rent</small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    <div className="mb-3">
                                        <div className="d-flex flex-wrap gap-1">
                                            {room.facilities.slice(0, 3).map((facility, index) => (
                                                <span key={index} className="badge bg-light text-dark border" style={{ fontSize: '10px' }}>
                                                    {facility}
                                                </span>
                                            ))}
                                            {room.facilities.length > 3 && (
                                                <span className="badge bg-secondary" style={{ fontSize: '10px' }}>
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
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(room.id)}
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
                                    hostels={hostels}
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
