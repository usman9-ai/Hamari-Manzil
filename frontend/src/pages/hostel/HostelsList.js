// Update frontend/src/pages/hostel/HostelsList.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyHostels, handleDeleteHostel, handleCreateHostel, handleUpdateHostel } from '../../services/hostelServices';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import ToastContainer from '../../components/ui/ToastContainer';
import useToast from '../../hooks/useToast';
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
    const { toasts, showSuccess, showError, removeToast } = useToast();

    // Helper function to construct correct Cloudinary URL
    const getCloudinaryUrl = (media, transformations = 'w_400,h_200,c_fill,q_auto,f_auto') => {
        if (!media) return null;
        
        let url;
        // If it already contains the full Cloudinary URL, return as is
        if (media.startsWith('http')) {
            url = media;
        } else if (media.includes('image/upload/')) {
            // If it's a partial path that already contains image/upload/, extract the public_id
            const publicId = media.split('image/upload/')[1];
            url = `https://res.cloudinary.com/musa-bukhari/image/upload/${transformations}/${publicId}`;
        } else {
            // Otherwise construct the URL with the media as public_id
            url = `https://res.cloudinary.com/musa-bukhari/image/upload/${transformations}/${media}`;
        }
        
        return url;
    };

    // Calculate total available beds from all rooms in a hostel
    const calculateAvailableBeds = (hostel) => {
        if (!hostel.rooms || !Array.isArray(hostel.rooms)) {
            return 0;
        }
        
        return hostel.rooms.reduce((total, room) => {
            const availableCapacity = parseInt(room.available_capacity) || 0;
            return total + availableCapacity;
        }, 0);
    };

    useEffect(() => {
        loadHostels();
    }, []);

    const loadHostels = async () => {
        setLoading(true);
        try {
            const result = await fetchMyHostels();
            console.log('Loaded hostels data:', result);
            
            if (result.success && Array.isArray(result.data)) {
                // Debug: Log media field for each hostel
                result.data.forEach((hostel, index) => {
                    console.log(`Hostel ${index + 1} (${hostel.name}):`, {
                        id: hostel.id,
                        name: hostel.name,
                        media: hostel.media,
                        verification_status: hostel.verification_status,
                        gender: hostel.gender,
                        city: hostel.city,
                        total_rooms: hostel.total_rooms,
                        description: hostel.description,
                        mediaUrl: hostel.media ? `https://res.cloudinary.com/musa-bukhari/image/upload/${hostel.media}` : 'No media'
                    });
                });
                setHostels(result.data);
            } else {
                console.error('Failed to load hostels:', result.message || 'Invalid data format');
                setHostels([]);
            }
        } catch (error) {
            console.error('Failed to load hostels:', error);
            setHostels([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hostel?')) {
            try {
                await handleDeleteHostel(id);
                showSuccess('Success!', 'Hostel deleted successfully');
                loadHostels();
            } catch (error) {
                console.error('Failed to delete hostel:', error);
                showError('Error', 'Failed to delete hostel');
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        setSubmitting(true);
        try {
            // Debug: Log the form data being sent
            console.log('=== FORM SUBMISSION DEBUG ===');
            console.log('Form data being sent:', formData);
            console.log('Media field value:', formData.media);
            console.log('=============================');
            
            if (editingHostel) {
                await handleUpdateHostel(editingHostel.id, formData);
                showSuccess('Success!', 'Hostel updated successfully');
            } else {
                await handleCreateHostel(formData);
                showSuccess('Success!', 'Hostel created successfully');
            }
            setShowModal(false);
            setEditingHostel(null);
            loadHostels();
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.detail || 
                                error.message || 
                                'An unexpected error occurred';
            showError('Error', `Failed to save hostel: ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (hostel) => {
        setEditingHostel(hostel);
        setShowModal(true);
    };

    const filteredHostels = hostels.filter(hostel => {
        const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase());
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
            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
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
                        <div className="col-md-5">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name..."
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
                                    <option key={city} value={city}>
                                        {city.charAt(0).toUpperCase() + city.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filterGender}
                                onChange={(e) => setFilterGender(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
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
                                {/* Hostel Thumbnail */}
                                <div style={{ position: 'relative', height: '200px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                                    {hostel.media ? (
                                        <img
                                            src={(() => {
                                                const imageUrl = getCloudinaryUrl(hostel.media, 'w_400,h_200,c_fill,q_auto,f_auto');
                                                const finalUrl = `${imageUrl}?t=${Date.now()}`;
                                                console.log(`Hostel ${hostel.id} (${hostel.name}) image:`, {
                                                    media: hostel.media,
                                                    imageUrl: imageUrl,
                                                    finalUrl: finalUrl
                                                });
                                                return finalUrl;
                                            })()}
                                            alt={hostel.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease'
                                            }}
                                            onError={(e) => {
                                                console.error(`Image failed to load for hostel ${hostel.id} (${hostel.name}):`, e.target.src);
                                                // Try without transformations as fallback
                                                const fallbackUrl = getCloudinaryUrl(hostel.media, '');
                                                if (fallbackUrl) {
                                                    e.target.src = `${fallbackUrl}?t=${Date.now()}`;
                                                } else {
                                                    e.target.style.display = 'none';
                                                }
                                            }}
                                            onLoad={() => {
                                                console.log(`Image loaded successfully for hostel ${hostel.id} (${hostel.name})`);
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'scale(1.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                            }}
                                        />
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-center h-100">
                                            <div className="text-center text-muted">
                                                <i className="fas fa-image fa-3x mb-2"></i>
                                                <p className="mb-0">No Image</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Verification Badge - Top Left */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px'
                                    }}>
                                        {hostel.verification_status ? (
                                            <span style={{
                                                background: 'rgba(40, 167, 69, 0.9)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <i className="fas fa-check-circle"></i>
                                                Verified
                                            </span>
                                        ) : (
                                            <span style={{
                                                background: 'rgba(220, 53, 69, 0.9)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <i className="fas fa-times-circle"></i>
                                                Unverified
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Gender Badge - Top Right */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px'
                                    }}>
                                        <span style={{
                                            background: 'rgba(13, 110, 253, 0.9)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <i className={`fas fa-${hostel.gender === 'male' ? 'mars' : hostel.gender === 'female' ? 'venus' : 'venus-mars'}`}></i>
                                            {hostel.gender.charAt(0).toUpperCase() + hostel.gender.slice(1)}
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
                                            1 photo
                                        </span>
                                    </div>
                                </div>

                                <CardContent className="p-3">
                                    {/* Header */}
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className="flex-grow-1">
                                            <h5 className="mb-1 fw-bold">{hostel.name}</h5>
                                            <p className="text-muted small mb-0">
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                {hostel.city.charAt(0).toUpperCase() + hostel.city.slice(1)}
                                            </p>
                                        </div>
                                        <div className="d-flex gap-1">
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(hostel.id)}
                                                title="Delete Hostel"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
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
                                        <div className="col-6">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold text-primary fs-4">{hostel.total_rooms}</div>
                                                <small className="text-muted">Total Rooms</small>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="text-center p-2 bg-light rounded">
                                                <div className="fw-bold text-success fs-4">{calculateAvailableBeds(hostel)}</div>
                                                <small className="text-muted">Available Vacancies</small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    {hostel.map_location && (
                                        <div className="mb-3">
                                            <a
                                                href={hostel.map_location}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-secondary w-100"
                                            >
                                                <i className="fas fa-map-marked-alt me-2"></i>
                                                View on Map
                                            </a>
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
        </div>
    );
};

export default HostelsList;