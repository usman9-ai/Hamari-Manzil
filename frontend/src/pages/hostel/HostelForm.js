import React, { useState, useEffect } from 'react';
import LocationPickerModal from '../../components/hostel/LocationPickerModal';

const HostelForm = ({ hostel, onSubmit, onCancel, submitting }) => {
    const [formData, setFormData] = useState({
        name: '',
        city: 'karachi',
        description: '',
        gender: 'male',
        total_rooms: 0,
        latitude: '',
        longitude: '',
        map_location: '',
        media: null,
        ...hostel
    });

    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [mediaPreview, setMediaPreview] = useState(hostel?.media || null);
    const [showLocationModal, setShowLocationModal] = useState(false);

    const cityOptions = [
        { value: 'karachi', label: 'Karachi' },
        { value: 'lahore', label: 'Lahore' },
        { value: 'islamabad', label: 'Islamabad' },
        { value: 'multan', label: 'Multan' },
        { value: 'bahawalpur', label: 'Bahawalpur' },
        { value: 'rawalpindi', label: 'Rawalpindi' },
        { value: 'faisalabad', label: 'Faisalabad' },
        { value: 'peshawar', label: 'Peshawar' },
        { value: 'quetta', label: 'Quetta' },
    ];

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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMediaUpload = () => {
        if (!window.cloudinary) {
            // We'll pass this error up to the parent component to show as toast
            console.error('Cloudinary widget not loaded yet');
            return;
        }

        setUploadingMedia(true);

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'musa-bukhari',
                uploadPreset: 'hamariManzil',
                sources: ['local', 'url', 'camera'],
                multiple: false, // Only one image for hostel
                folder: 'hostels',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                maxFileSize: 5000000, // 5MB
                theme: 'minimal',
                // Add these options to ensure proper upload
                cropping: false,
                showAdvancedOptions: false,
                showSkipCropButton: false,
                showPoweredBy: false,
            },
            (error, result) => {
                console.log('Cloudinary upload result:', { error, result });
                
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    setUploadingMedia(false);
                    return;
                }
                
                if (result && result.event === 'success') {
                    const publicId = result.info.public_id;
                    const imageUrl = result.info.secure_url;
                    console.log('Upload successful:', { publicId, imageUrl });
                    
                    setFormData(prev => ({
                        ...prev,
                        media: publicId // Store public_id for backend
                    }));
                    setMediaPreview(imageUrl); // Store URL for preview
                }

                if (result && result.event === 'close') {
                    setUploadingMedia(false);
                }
            }
        );

        widget.open();
    };

    const removeMedia = () => {
        setFormData(prev => ({
            ...prev,
            media: null
        }));
        setMediaPreview(null);
    };

    const handleLocationSelect = (locationData) => {
        setFormData(prev => ({
            ...prev,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            map_location: `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
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
                    <select
                        name="city"
                        className="form-select"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    >
                        {cityOptions.map(city => (
                            <option key={city.value} value={city.value}>
                                {city.label}
                            </option>
                        ))}
                    </select>
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

                {/* Hostel Details */}
                <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-3 text-primary">Hostel Details</h6>
                </div>

                <div className="col-md-6">
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
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Total Rooms <span className="text-danger">*</span></label>
                    <input
                        type="number"
                        name="total_rooms"
                        className="form-control"
                        value={formData.total_rooms}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                    <small className="text-muted">Number of rooms in your hostel</small>
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
                                    <div className="col-md-6">
                                        <strong>Latitude:</strong>
                                        <p className="mb-0 text-muted">{formData.latitude}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Longitude:</strong>
                                        <p className="mb-0 text-muted">{formData.longitude}</p>
                                    </div>
                                    {formData.map_location && (
                                        <div className="col-12 mt-2">
                                            <a
                                                href={formData.map_location}
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
                    <h6 className="fw-bold mb-3 text-primary">Hostel Image</h6>
                </div>

                <div className="col-12">
                    <label className="form-label">Main Image</label>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleMediaUpload}
                        disabled={uploadingMedia}
                    >
                        <i className="fas fa-cloud-upload-alt me-2"></i>
                        {uploadingMedia ? 'Uploading...' : 'Upload Hostel Image via Cloudinary'}
                    </button>
                    <small className="text-muted d-block mt-1">
                        Upload a main image for your hostel (max 5MB, JPG/PNG)
                    </small>

                    {mediaPreview && (
                        <div className="mt-3">
                            <div className="position-relative d-inline-block">
                                <img
                                    src={mediaPreview}
                                    alt="Hostel"
                                    className="img-fluid rounded"
                                    style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'cover' }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                    onClick={removeMedia}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    )}
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
                    lat: parseFloat(formData.latitude) || null,
                    lng: parseFloat(formData.longitude) || null
                }}
            />
        </form>
    );
};

export default HostelForm;

