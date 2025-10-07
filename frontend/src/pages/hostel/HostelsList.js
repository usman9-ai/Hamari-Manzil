import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHostels, deleteHostel, createHostel, updateHostel, toggleHostelStatus } from '../../actions/hostelActions';
import { hostelFacilitiesOptions } from '../../services/hostelDummyData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import HostelForm from './HostelForm';

const HostelsList = () => {
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingHostel, setEditingHostel] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadHostels();
    }, []);

    const loadHostels = async () => {
        setLoading(true);
        const result = await getHostels();
        if (result.success) {
            setHostels(result.data);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hostel?')) {
            const result = await deleteHostel(id);
            if (result.success) {
                alert(result.message);
                loadHostels();
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        setSubmitting(true);
        try {
            const result = editingHostel
                ? await updateHostel(editingHostel.id, formData)
                : await createHostel(formData);

            if (result.success) {
                alert(result.message);
                setShowModal(false);
                setEditingHostel(null);
                loadHostels();
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

    const handleEdit = (hostel) => {
        setEditingHostel(hostel);
        setShowModal(true);
    };

    const handleToggleStatus = async (id) => {
        const result = await toggleHostelStatus(id);
        if (result.success) {
            alert(result.message);
            loadHostels();
        }
    };

    const filteredHostels = hostels.filter(hostel => {
        const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hostel.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = !filterCity || hostel.city === filterCity;
        const matchesGender = !filterGender || hostel.gender === filterGender;
        return matchesSearch && matchesCity && matchesGender;
    });

    const cities = [...new Set(hostels.map(h => h.city))];

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-3">Loading hostels...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold mb-1">Manage Hostels</h1>
                    <p className="text-muted">View and manage all your hostel properties</p>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => { setEditingHostel(null); setShowModal(true); }}
                >
                    <i className="fas fa-plus me-2"></i>
                    Add New Hostel
                </button>
            </div>

            {/* Filters */}
            <Card className="mb-4">
                <CardContent className="p-4">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name or address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                            >
                                <option value="">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filterGender}
                                onChange={(e) => setFilterGender(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterCity('');
                                    setFilterGender('');
                                }}
                            >
                                <i className="fas fa-redo me-2"></i>
                                Reset
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Hostels Grid */}
            {filteredHostels.length === 0 ? (
                <Card>
                    <CardContent className="p-5">
                        <div className="text-center">
                            <i className="fas fa-hotel fa-4x text-muted mb-3"></i>
                            <h4>No hostels found</h4>
                            <p className="text-muted">
                                {searchTerm || filterCity || filterGender
                                    ? 'Try adjusting your filters'
                                    : 'Add your first hostel to get started'}
                            </p>
                            <button
                                type="button"
                                className="btn btn-primary mt-3"
                                onClick={() => { setEditingHostel(null); setShowModal(true); }}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Add New Hostel
                            </button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="row g-4">
                    {filteredHostels.map((hostel) => (
                        <div key={hostel.id} className="col-lg-4 col-md-6">
                            <Card className="h-100 overflow-hidden hover-shadow" style={{ transition: 'box-shadow 0.3s' }}>
                                {/* Image Gallery */}
                                {hostel.images && hostel.images.length > 0 && (
                                    <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                        <img
                                            src={hostel.images[0]}
                                            alt={hostel.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        {hostel.images.length > 1 && (
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
                                                {hostel.images.length} photos
                                            </div>
                                        )}
                                        {hostel.verified && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    left: '10px'
                                                }}
                                            >
                                                <Badge variant="success">
                                                    <i className="fas fa-check-circle me-1"></i>
                                                    Verified
                                                </Badge>
                                            </div>
                                        )}
                                        {hostel.disabled && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px'
                                                }}
                                            >
                                                <Badge variant="danger">Disabled</Badge>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <CardContent className="p-3">
                                    {/* Header */}
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className="flex-grow-1">
                                            <h5 className="mb-1 fw-bold">{hostel.name}</h5>
                                            <p className="text-muted small mb-0">
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                {hostel.city}
                                            </p>
                                        </div>
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-sm btn-link text-dark p-0"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                            >
                                                <i className="fas fa-ellipsis-v"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <button className="dropdown-item" onClick={() => handleEdit(hostel)}>
                                                        <i className="fas fa-edit me-2"></i>
                                                        Edit
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => handleToggleStatus(hostel.id)}>
                                                        <i className={`fas ${hostel.disabled ? 'fa-check' : 'fa-ban'} me-2`}></i>
                                                        {hostel.disabled ? 'Enable' : 'Disable'}
                                                    </button>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    <button className="dropdown-item text-danger" onClick={() => handleDelete(hostel.id)}>
                                                        <i className="fas fa-trash me-2"></i>
                                                        Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {hostel.description && (
                                        <p className="text-muted small mb-3" style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {hostel.description}
                                        </p>
                                    )}

                                    {/* Stats */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-4">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold text-primary">{hostel.totalRooms}</div>
                                                <small className="text-muted">Rooms</small>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold text-success">{hostel.availableRooms}</div>
                                                <small className="text-muted">Available</small>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold text-warning">
                                                    <i className="fas fa-star"></i> {hostel.rating}
                                                </div>
                                                <small className="text-muted">{hostel.reviewCount} reviews</small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    <div className="mb-3">
                                        <div className="d-flex flex-wrap gap-1">
                                            {hostel.facilities.slice(0, 3).map((facility, index) => (
                                                <span key={index} className="badge bg-light text-dark border" style={{ fontSize: '11px' }}>
                                                    {facility}
                                                </span>
                                            ))}
                                            {hostel.facilities.length > 3 && (
                                                <span className="badge bg-secondary" style={{ fontSize: '11px' }}>
                                                    +{hostel.facilities.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary flex-grow-1"
                                            onClick={() => handleEdit(hostel)}
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-secondary flex-grow-1"
                                            onClick={() => navigate(`/hostel/rooms?hostelId=${hostel.id}`)}
                                        >
                                            <i className="fas fa-bed me-1"></i>
                                            Rooms
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            {/* Hostel Form Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingHostel ? 'Edit Hostel' : 'Add New Hostel'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingHostel(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <HostelForm
                                    hostel={editingHostel}
                                    onSubmit={handleFormSubmit}
                                    onCancel={() => {
                                        setShowModal(false);
                                        setEditingHostel(null);
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

export default HostelsList;
