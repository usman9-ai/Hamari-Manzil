import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHostels, getRooms, deleteHostel, createHostel, updateHostel, toggleHostelStatus, getVerificationRequests, submitVerificationRequest } from '../../actions/hostelActions';
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
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [selectedHostelForVerification, setSelectedHostelForVerification] = useState(null);
    const [verificationDocuments, setVerificationDocuments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadHostels();
    }, []);

    const loadHostels = async () => {
        setLoading(true);
        const [hostelsResult, verificationsResult] = await Promise.all([
            getHostels(),
            getVerificationRequests()
        ]);

        if (hostelsResult.success) {
            setHostels(hostelsResult.data);
        }
        if (verificationsResult.success) {
            setVerificationRequests(verificationsResult.data);
        }
        setLoading(false);
    };

    const hasVerificationRequest = (hostelId) => {
        return verificationRequests.some(req =>
            req.hostelId === hostelId && req.status === 'pending'
        );
    };

    const handleRequestVerification = (hostel) => {
        setSelectedHostelForVerification(hostel);
        setShowVerificationModal(true);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setVerificationDocuments(prev => [...prev, ...files]);
    };

    const removeDocument = (index) => {
        setVerificationDocuments(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleSubmitVerification = async () => {
        if (!selectedHostelForVerification || verificationDocuments.length === 0) {
            alert('Please select documents to upload');
            return;
        }

        setSubmitting(true);
        try {
            const result = await submitVerificationRequest(
                selectedHostelForVerification.id,
                verificationDocuments
            );

            if (result.success) {
                alert('Verification request submitted successfully! We will review it within 3-5 business days.');
                setShowVerificationModal(false);
                setSelectedHostelForVerification(null);
                setVerificationDocuments([]);
                loadHostels(); // Reload to update verification requests
            } else {
                alert('Failed to submit verification request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting verification:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        // First check if hostel has rooms
        const roomsResult = await getRooms();
        if (roomsResult.success) {
            const hostelRooms = roomsResult.data.filter(room => room.hostelId === id);
            if (hostelRooms.length > 0) {
                alert(`⚠️ Cannot delete this hostel!\n\nThis hostel has ${hostelRooms.length} room(s). Please delete all rooms first before deleting the hostel.`);
                return;
            }
        }

        if (window.confirm('Are you sure you want to delete this hostel? This action cannot be undone.')) {
            const result = await deleteHostel(id);
            if (result.success) {
                alert('✅ Hostel deleted successfully!');
                loadHostels();
            } else {
                alert('❌ Failed to delete hostel. Please try again.');
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
            <Card className="mb-4 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                <CardContent className="p-4">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="fas fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search by name or address..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ borderLeft: 'none' }}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="fas fa-map-marker-alt text-muted"></i>
                                </span>
                                <select
                                    className="form-select border-start-0"
                                    value={filterCity}
                                    onChange={(e) => setFilterCity(e.target.value)}
                                    style={{ borderLeft: 'none' }}
                                >
                                    <option value="">All Cities</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="fas fa-venus-mars text-muted"></i>
                                </span>
                                <select
                                    className="form-select border-start-0"
                                    value={filterGender}
                                    onChange={(e) => setFilterGender(e.target.value)}
                                    style={{ borderLeft: 'none' }}
                                >
                                    <option value="">All Types</option>
                                    <option value="boys">Boys</option>
                                    <option value="girls">Girls</option>
                                    <option value="coed">Co-ed</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-primary w-100"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterCity('');
                                    setFilterGender('');
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

            {/* Hostels Grid */}
            {filteredHostels.length === 0 ? (
                <Card>
                    <CardContent className="p-5">
                        <div className="text-center">
                            <i className="fas fa-home fa-4x text-muted mb-3"></i>
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
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(hostel.id)}
                                            title="Delete Hostel"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
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

                                    {/* Verification Button */}
                                    {!hostel.verified && !hasVerificationRequest(hostel.id) && (
                                        <div className="mb-2">
                                            <button
                                                className="btn btn-sm btn-success w-100"
                                                onClick={() => handleRequestVerification(hostel)}
                                            >
                                                <i className="fas fa-certificate me-1"></i>
                                                Request Verification
                                            </button>
                                        </div>
                                    )}

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

            {/* Verification Modal */}
            {showVerificationModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Submit Verification Request</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowVerificationModal(false);
                                        setSelectedHostelForVerification(null);
                                        setVerificationDocuments([]);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Hostel Info */}
                                {selectedHostelForVerification && (
                                    <div className="mb-4 p-3 bg-light rounded">
                                        <h6 className="fw-bold mb-2">
                                            <i className="fas fa-building me-2 text-primary"></i>
                                            {selectedHostelForVerification.name}
                                        </h6>
                                        <p className="text-muted mb-0 small">
                                            <i className="fas fa-map-marker-alt me-2"></i>
                                            {selectedHostelForVerification.city}
                                        </p>
                                    </div>
                                )}

                                {/* Upload Documents */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Upload Documents
                                        <span className="text-danger ms-1">*</span>
                                    </label>
                                    <p className="text-muted small mb-2">
                                        Required: CNIC, Business License, Utility Bills, Property Documents
                                    </p>
                                    <input
                                        type="file"
                                        className="form-control"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileUpload}
                                    />
                                </div>

                                {/* Document List */}
                                {verificationDocuments.length > 0 && (
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Uploaded Documents ({verificationDocuments.length})</label>
                                        <div className="list-group">
                                            {verificationDocuments.map((doc, idx) => (
                                                <div key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <i className="fas fa-file me-2 text-primary"></i>
                                                        {doc.name}
                                                        <small className="text-muted ms-2">
                                                            ({(doc.size / 1024).toFixed(2)} KB)
                                                        </small>
                                                    </div>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removeDocument(idx)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Info Alert */}
                                <div className="alert alert-info mb-0">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Verification requests are typically reviewed within 3-5 business days. You'll receive notifications about status updates.
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className='d-flex justify-content-end gap-2 mt-4'>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowVerificationModal(false);
                                            setSelectedHostelForVerification(null);
                                            setVerificationDocuments([]);
                                        }}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSubmitVerification}
                                        disabled={submitting || !selectedHostelForVerification || verificationDocuments.length === 0}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-2"></i>
                                                Submit Request
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostelsList;
