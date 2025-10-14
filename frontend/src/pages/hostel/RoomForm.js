import React, { useState, useEffect } from 'react';
import { fetchRoomFacilities } from '../../services/roomServices';
import { fetchMyHostels } from '../../services/hostelServices';

const RoomForm = ({ room, onSubmit, onCancel, submitting }) => {
    const [formData, setFormData] = useState({
        hostel: '', // Changed from hostelId to match backend
        room_type: 'shared', // Changed from type to match backend
        total_capacity: 1, // Changed from capacity to match backend
        available_capacity: 1, // Changed from availableBeds to match backend
        rent: '',
        security_deposit: '', // Changed from deposit to match backend
        facilities: [],
        description: '',
        media: null, // Main thumbnail image
        is_available: true, // Changed from status to match backend
        ...room,
        // Ensure facilities is always an array
        facilities: room?.facilities || []
    });

    const [facilitiesOptions, setFacilitiesOptions] = useState([]);
    const [userHostels, setUserHostels] = useState([]);
    const [loadingHostels, setLoadingHostels] = useState(true);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [mediaPreview, setMediaPreview] = useState(room?.media || null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [uploadingAdditional, setUploadingAdditional] = useState(false);

    useEffect(() => {
        // Load Cloudinary upload widget script
        if (!window.cloudinary) {
            const script = document.createElement('script');
            script.src = 'https://upload-widget.cloudinary.com/global/all.js';
            script.async = true;
            document.body.appendChild(script);
        }
        
        // Set valid facilities immediately to prevent invalid selections
        const validFacilities = [
            'wifi', 'ac', 'heater', 'tv', 'laundry', 
            'kitchen', 'parking', 'security_cameras',
            'study_table', 'cupboard', 'ups', 'geyser'
        ];
        setFacilitiesOptions(validFacilities);
        console.log('Set valid facilities immediately:', validFacilities);
        
        // Load facilities and user's hostels from backend
        loadFacilities();
        loadUserHostels();
    }, []);

    // Update formData when room prop changes (for editing)
    useEffect(() => {
        if (room) {
            setFormData(prevData => ({
                ...prevData,
                ...room,
                facilities: room.facilities || []
            }));
        }
    }, [room]);

    const loadFacilities = async () => {
        try {
            console.log('Loading facilities from backend...');
            const result = await fetchRoomFacilities();
            console.log('fetchRoomFacilities result:', result);
            
            if (result.success && Array.isArray(result.data)) {
                console.log('Loaded facilities from backend:', result.data);
                // Validate that all facilities are in the allowed list
                const validFacilities = [
                    'wifi', 'ac', 'heater', 'tv', 'laundry', 
                    'kitchen', 'parking', 'security_cameras',
                    'study_table', 'cupboard', 'ups', 'geyser'
                ];
                
                const filteredFacilities = result.data.filter(facility => 
                    validFacilities.includes(facility)
                );
                
                if (filteredFacilities.length > 0) {
                    console.log('Using validated facilities from backend:', filteredFacilities);
                    setFacilitiesOptions(filteredFacilities);
                } else {
                    console.log('No valid facilities from backend, using fallback');
                    setFacilitiesOptions(validFacilities);
                }
            } else {
                console.error('Failed to load facilities:', result.message);
                // Use fallback facilities
                const defaultFacilities = [
                    'wifi', 'ac', 'heater', 'tv', 'laundry', 
                    'kitchen', 'parking', 'security_cameras',
                    'study_table', 'cupboard', 'ups', 'geyser'
                ];
                console.log('Using fallback facilities:', defaultFacilities);
                setFacilitiesOptions(defaultFacilities);
            }
        } catch (error) {
            console.error('Failed to load facilities:', error);
            // Fallback to default facilities if backend fails (must match backend ALLOWED_FACILITIES)
            const defaultFacilities = [
                'wifi', 'ac', 'heater', 'tv', 'laundry', 
                'kitchen', 'parking', 'security_cameras',
                'study_table', 'cupboard', 'ups', 'geyser'
            ];
            console.log('Using fallback facilities due to error:', defaultFacilities);
            setFacilitiesOptions(defaultFacilities);
        }
    };

    const loadUserHostels = async () => {
        try {
            console.log('Loading user hostels...');
            setLoadingHostels(true);
            const result = await fetchMyHostels();
            console.log('fetchMyHostels result:', result);
            
            if (result.success) {
                console.log('Loaded user hostels:', result.data);
                setUserHostels(result.data);
            } else {
                console.error('Failed to load hostels:', result.message);
                setUserHostels([]);
            }
        } catch (error) {
            console.error('Failed to load user hostels:', error);
            setUserHostels([]);
        } finally {
            setLoadingHostels(false);
        }
    };

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
            // Convert numeric fields to numbers
            let processedValue = value;
            if (name === 'rent' || name === 'security_deposit' || name === 'total_capacity' || name === 'available_capacity') {
                processedValue = value === '' ? '' : parseFloat(value);
            }
            
            setFormData(prev => ({
                ...prev,
                [name]: processedValue
            }));
        }
    };

    const handleMediaUpload = () => {
        if (!window.cloudinary) {
            console.error('Cloudinary widget not loaded yet');
            return;
        }

        setUploadingMedia(true);

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'musa-bukhari',
                uploadPreset: 'hamariManzil',
                sources: ['local', 'url', 'camera'],
                multiple: false, // Single image for room
                folder: 'rooms',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                maxFileSize: 5000000, // 5MB
                theme: 'minimal',
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

    const handleAdditionalImagesUpload = () => {
        if (!window.cloudinary) {
            console.error('Cloudinary widget not loaded yet');
            return;
        }

        setUploadingAdditional(true);

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'musa-bukhari',
                uploadPreset: 'hamariManzil',
                sources: ['local', 'url', 'camera'],
                multiple: true, // Multiple images for additional photos
                folder: 'rooms',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                maxFileSize: 5000000, // 5MB
                theme: 'minimal',
                cropping: false,
                showAdvancedOptions: false,
                showSkipCropButton: false,
                showPoweredBy: false,
            },
            (error, result) => {
                console.log('Additional images upload result:', { error, result });
                
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    setUploadingAdditional(false);
                    return;
                }
                
                if (result && result.event === 'success') {
                    const newImage = {
                        public_id: result.info.public_id,
                        secure_url: result.info.secure_url
                    };
                    setAdditionalImages(prev => [...prev, newImage]);
                }

                if (result && result.event === 'close') {
                    setUploadingAdditional(false);
                }
            }
        );

        widget.open();
    };

    const removeAdditionalImage = (index) => {
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate facilities - only allow valid ones
        const validFacilities = [
            'wifi', 'ac', 'heater', 'tv', 'laundry', 
            'kitchen', 'parking', 'security_cameras',
            'study_table', 'cupboard', 'ups', 'geyser'
        ];
        
        const filteredFacilities = (formData.facilities || []).filter(facility => 
            validFacilities.includes(facility)
        );
        
        // Validate and format data before submission
        const submitData = {
            ...formData,
            rent: parseFloat(formData.rent) || 0,
            security_deposit: parseFloat(formData.security_deposit) || 0,
            total_capacity: parseInt(formData.total_capacity) || 1,
            available_capacity: parseInt(formData.available_capacity) || 1,
            hostel: parseInt(formData.hostel) || null,
            facilities: filteredFacilities, // Only valid facilities
            additional_images: additionalImages // Include additional images
        };
        
        console.log('Submitting room data:', submitData);
        console.log('Filtered facilities:', filteredFacilities);
        console.log('Additional images:', additionalImages);
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-3">
                {/* Hostel Selection */}
                <div className="col-12">
                    <h6 className="fw-bold mb-3 text-primary">Room Information</h6>
                </div>

                <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label mb-0">Select Hostel <span className="text-danger">*</span></label>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={loadUserHostels}
                            disabled={loadingHostels}
                            title="Refresh hostels list"
                        >
                            <i className={`fas fa-sync-alt ${loadingHostels ? 'fa-spin' : ''}`}></i>
                        </button>
                    </div>
                    <select
                        name="hostel"
                        className="form-select"
                        value={formData.hostel}
                        onChange={handleChange}
                        required
                        disabled={!!room || loadingHostels}
                    >
                        <option value="">
                            {loadingHostels ? 'Loading hostels...' : '-- Select Hostel --'}
                        </option>
                        {!loadingHostels && userHostels.length === 0 ? (
                            <option value="" disabled>No hostels found. Create a hostel first.</option>
                        ) : (
                            userHostels.map((hostel) => (
                                <option key={hostel.id} value={hostel.id}>
                                    {hostel.name} - {hostel.city}
                                </option>
                            ))
                        )}
                    </select>
                    {!loadingHostels && userHostels.length === 0 && (
                        <div className="mt-2 p-3 bg-light rounded">
                            <p className="mb-2 text-muted">
                                <i className="fas fa-info-circle me-1"></i>
                                Can't find a hostel? Add a new one here.
                            </p>
                            <a 
                                href="/hostel/hostels" 
                                className="btn btn-sm btn-outline-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fas fa-plus me-1"></i>
                                Register New Hostel
                            </a>
                        </div>
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label">Room Type <span className="text-danger">*</span></label>
                    <select
                        name="room_type"
                        className="form-select"
                        value={formData.room_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="shared">Shared Room</option>
                        <option value="ind">Independent Room</option>
                    </select>
                </div>

                {/* Room Capacity */}
                <div className="col-md-6">
                    <label className="form-label">Total Capacity <span className="text-danger">*</span></label>
                    <input
                        type="number"
                        name="total_capacity"
                        className="form-control"
                        value={formData.total_capacity}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Available Capacity <span className="text-danger">*</span></label>
                    <input
                        type="number"
                        name="available_capacity"
                        className="form-control"
                        value={formData.available_capacity}
                        onChange={handleChange}
                        required
                        min="0"
                        max={formData.total_capacity}
                    />
                </div>

                {/* Pricing */}
                <div className="col-md-4">
                    <label className="form-label">Monthly Rent (PKR) <span className="text-danger">*</span></label>
                    <input
                        type="number"
                        name="rent"
                        className="form-control"
                        value={formData.rent}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="15000"
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Security Deposit (PKR) <span className="text-danger">*</span></label>
                    <input
                        type="number"
                        name="security_deposit"
                        className="form-control"
                        value={formData.security_deposit}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="30000"
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Floor Number</label>
                    <input
                        type="number"
                        name="floor"
                        className="form-control"
                        value={formData.floor}
                        onChange={handleChange}
                        min="0"
                        placeholder="1"
                    />
                </div>

                {/* Status */}
                <div className="col-md-12">
                    <label className="form-label">Room Status</label>
                    <select
                        name="is_available"
                        className="form-select"
                        value={formData.is_available}
                        onChange={handleChange}
                    >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                    </select>
                </div>

                {/* Description */}
                <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the room features, view, etc."
                    ></textarea>
                </div>

                {/* Facilities */}
                <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-3 text-primary">Room Facilities</h6>
                    <div className="row g-2">
                        {facilitiesOptions.map((facility) => {
                            // Handle both string and object formats
                            const facilityValue = typeof facility === 'string' ? facility : facility.key || facility.value;
                            const facilityLabel = typeof facility === 'string' ? facility : facility.label || facility.name || facilityValue;
                            
                            return (
                                <div key={facilityValue} className="col-md-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={facilityValue}
                                            id={`room-facility-${facilityValue}`}
                                            checked={(formData.facilities || []).includes(facilityValue)}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor={`room-facility-${facilityValue}`}>
                                            {facilityLabel}
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Media */}
                <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-3 text-primary">Room Image</h6>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleMediaUpload}
                        disabled={uploadingMedia}
                    >
                        <i className="fas fa-cloud-upload-alt me-2"></i>
                        {uploadingMedia ? 'Uploading...' : 'Upload Room Image via Cloudinary'}
                    </button>
                    <small className="text-muted d-block mt-1">
                        Upload a main image for your room (max 5MB, JPG/PNG)
                    </small>

                    {mediaPreview && (
                        <div className="mt-3">
                            <div className="position-relative d-inline-block">
                                <img
                                    src={mediaPreview}
                                    alt="Room"
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

                    {/* Additional Images */}
                    <div className="mt-4">
                        <h6 className="fw-bold mb-3 text-primary">Additional Room Photos</h6>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleAdditionalImagesUpload}
                            disabled={uploadingAdditional}
                        >
                            <i className="fas fa-images me-2"></i>
                            {uploadingAdditional ? 'Uploading...' : 'Upload Additional Photos'}
                        </button>
                        <small className="text-muted d-block mt-1">
                            Upload multiple photos to showcase your room (max 5MB each, JPG/PNG)
                        </small>

                        {additionalImages.length > 0 && (
                            <div className="mt-3">
                                <div className="row g-2">
                                    {additionalImages.map((image, index) => (
                                        <div key={index} className="col-md-3">
                                            <div className="position-relative">
                                                <img
                                                    src={image.secure_url}
                                                    alt={`Room photo ${index + 1}`}
                                                    className="img-fluid rounded"
                                                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                                    onClick={() => removeAdditionalImage(index)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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
                            {room ? 'Update Room' : 'Create Room'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default RoomForm;

