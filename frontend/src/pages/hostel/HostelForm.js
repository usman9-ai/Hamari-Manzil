import React, { useState, useEffect } from 'react';
import { hostelFacilitiesOptions } from '../../services/hostelDummyData';
import LocationPickerModal from '../../components/hostel/LocationPickerModal';

const HostelForm = ({ hostel, onSubmit, onCancel, submitting }) => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        description: '',
        phone: '',
        email: '',
        gender: 'male',
        totalRooms: 0,
        availableRooms: 0,
        facilities: [],
        latitude: '',
        longitude: '',
        mapLocation: '',
        images: [],
        videoUrl: '',
        ...hostel
    });

    const [uploadingImage, setUploadingImage] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    useEffect(() => {
        // Load Cloudinary upload widget script
        if (!window.cloudinary) {
            const script = document.createElement('script');
            script.src = 'https://upload-widget.cloudinary.com/global/all.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            // Handle facility checkboxes
            if (checked) {
                setFormData(prev => ({
                    ...prev,
                    facilities: [...prev.facilities, value]
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    facilities: prev.facilities.filter(f => f !== value)
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageUpload = () => {
        if (!window.cloudinary) {
            alert('Cloudinary widget not loaded yet. Please try again.');
            return;
        }

        setUploadingImage(true);

        // Open Cloudinary upload widget
        // You'll need to replace 'YOUR_CLOUD_NAME' with your actual Cloudinary cloud name
        // And create an unsigned upload preset in your Cloudinary dashboard
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'musa-bukhari', // Replace with your cloud name
                uploadPreset: 'hamariManzil', // Replace with your upload preset
                sources: ['local', 'url', 'camera'],
                multiple: true,
                maxFiles: 5,
                folder: 'hostels',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                maxFileSize: 5000000, // 5MB
                theme: 'minimal',
            },
            (error, result) => {
                if (!error && result && result.event === 'success') {
                    const imageUrl = result.info.secure_url;
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, imageUrl]
                    }));
                }

                if (result && result.event === 'close') {
                    setUploadingImage(false);
                }
            }
        );

        widget.open();
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleLocationSelect = (locationData) => {
        setFormData(prev => ({
            ...prev,
            address: locationData.address,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            mapLocation: `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-3">
                {/* Basic Information */}
                <div className="col-12">
                    <h6 className="fw-bold mb-3 text-primary">Basic Information</h6>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Hostel Name <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">City <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">Address <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Contact Information */}
                <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-3 text-primary">Contact Information</h6>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Phone <span className="text-danger">*</span></label>
                    <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Hostel Details */}
                <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-3 text-primary">Hostel Details</h6>
                </div>

                <div className="col-md-4">
                    <label className="form-label">Gender <span className="text-danger">*</span></label>
                    <select
                        name="gender"
                        className="form-select"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="co-ed">Co-ed</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label">Total Rooms</label>
                    <input
                        type="number"
                        name="totalRooms"
                        className="form-control"
                        value={formData.totalRooms}
                        onChange={handleChange}
                        min="0"
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Available Rooms</label>
                    <input
                        type="number"
                        name="availableRooms"
                        className="form-control"
                        value={formData.availableRooms}
                        onChange={handleChange}
                        min="0"
                    />
                </div>

                {/* Facilities */}
                <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-3 text-primary">Facilities</h6>
                    <div className="row g-2">
                        {hostelFacilitiesOptions.map((facility) => (
                            <div key={facility} className="col-md-4">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={facility}
                                        id={`facility-${facility}`}
                                        checked={formData.facilities.includes(facility)}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor={`facility-${facility}`}>
                                        {facility}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-3 text-primary">Location Details</h6>
                </div>

                <div className="col-12">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowLocationModal(true)}
                    >
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {formData.latitude && formData.longitude ? 'Update Location' : 'Set Location on Map'}
                    </button>
                    <small className="text-muted d-block mt-1">
                        Use Google Maps with autocomplete and GPS to set precise hostel location
                    </small>

                    {formData.latitude && formData.longitude && (
                        <div className="card mt-3 bg-light">
                            <div className="card-body">
                                <h6 className="card-title mb-3">
                                    <i className="fas fa-check-circle text-success me-2"></i>
                                    Location Set
                                </h6>
                                <div className="row g-2">
                                    <div className="col-12">
                                        <strong>Address:</strong>
                                        <p className="mb-0 text-muted">{formData.address || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Latitude:</strong>
                                        <p className="mb-0 text-muted">{formData.latitude}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Longitude:</strong>
                                        <p className="mb-0 text-muted">{formData.longitude}</p>
                                    </div>
                                    {formData.mapLocation && (
                                        <div className="col-12 mt-2">
                                            <a
                                                href={formData.mapLocation}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <i className="fas fa-external-link-alt me-1"></i>
                                                View on Google Maps
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Media */}
                <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-3 text-primary">Images & Media</h6>
                </div>

                <div className="col-12">
                    <label className="form-label">Images</label>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleImageUpload}
                        disabled={uploadingImage}
                    >
                        <i className="fas fa-cloud-upload-alt me-2"></i>
                        {uploadingImage ? 'Uploading...' : 'Upload Images via Cloudinary'}
                    </button>
                    <small className="text-muted d-block mt-1">
                        You can upload multiple images. Click to open Cloudinary widget.
                    </small>

                    {formData.images.length > 0 && (
                        <div className="row g-2 mt-2">
                            {formData.images.map((image, index) => (
                                <div key={index} className="col-md-3">
                                    <div className="position-relative">
                                        <img
                                            src={image}
                                            alt={`Hostel ${index + 1}`}
                                            className="img-fluid rounded"
                                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                            onClick={() => removeImage(index)}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-12">
                    <label className="form-label">Video URL (YouTube/Vimeo)</label>
                    <input
                        type="url"
                        name="videoUrl"
                        className="form-control"
                        value={formData.videoUrl}
                        onChange={handleChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-save me-2"></i>
                            {hostel ? 'Update Hostel' : 'Create Hostel'}
                        </>
                    )}
                </button>
            </div>

            {/* Location Picker Modal */}
            <LocationPickerModal
                show={showLocationModal}
                onHide={() => setShowLocationModal(false)}
                onLocationSelect={handleLocationSelect}
                initialLocation={{
                    address: formData.address,
                    lat: parseFloat(formData.latitude) || null,
                    lng: parseFloat(formData.longitude) || null
                }}
            />
        </form>
    );
};

export default HostelForm;

