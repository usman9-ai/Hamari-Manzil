import React, { useState, useEffect } from 'react';
import { roomFacilitiesOptions } from '../../services/hostelDummyData';

const RoomForm = ({ room, hostels, onSubmit, onCancel, submitting }) => {
    const [formData, setFormData] = useState({
        hostelId: '',
        roomNumber: '',
        type: 'shared',
        capacity: 1,
        availableBeds: 1,
        rent: '',
        deposit: '',
        facilities: [],
        floor: 0,
        description: '',
        images: [],
        status: 'available',
        ...room
    });

    const [uploadingImage, setUploadingImage] = useState(false);

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

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'musa-bukhari',
                uploadPreset: 'hamariManzil',
                sources: ['local', 'url', 'camera'],
                multiple: true,
                maxFiles: 5,
                folder: 'rooms',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                maxFileSize: 5000000,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-3">
                {/* Hostel Selection */}
                <div className="col-12">
                    <h6 className="fw-bold mb-3 text-primary">Room Information</h6>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Select Hostel <span className="text-danger">*</span></label>
                    <select
                        name="hostelId"
                        className="form-select"
                        value={formData.hostelId}
                        onChange={handleChange}
                        required
                        disabled={!!room}
                    >
                        <option value="">-- Select Hostel --</option>
                        {hostels.map((hostel) => (
                            <option key={hostel.id} value={hostel.id}>
                                {hostel.name} - {hostel.city}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Room Number <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        name="roomNumber"
                        className="form-control"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 101, G-12, A1"
                    />
                </div>

                {/* Room Type & Capacity */}
                <div className="col-md-4">
                    <label className="form-label">Room Type <span className="text-danger">*</span></label>
                    <select
                        name="type"
                        className="form-select"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="single">Single</option>
                        <option value="shared">Shared</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label">Total Capacity <span className="text-danger">*</span></label>
                    <input
                        type="number"
                        name="capacity"
                        className="form-control"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Available Beds <span className="text-danger">*</span></label>
                    <input
                        type="number"
                        name="availableBeds"
                        className="form-control"
                        value={formData.availableBeds}
                        onChange={handleChange}
                        required
                        min="0"
                        max={formData.capacity}
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
                        name="deposit"
                        className="form-control"
                        value={formData.deposit}
                        onChange={handleChange}
                        required
                        min="0"
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
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Under Maintenance</option>
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
                        {roomFacilitiesOptions.map((facility) => (
                            <div key={facility} className="col-md-4">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={facility}
                                        id={`room-facility-${facility}`}
                                        checked={formData.facilities.includes(facility)}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor={`room-facility-${facility}`}>
                                        {facility}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-3 text-primary">Room Images</h6>
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
                        Upload room photos to attract students
                    </small>

                    {formData.images.length > 0 && (
                        <div className="row g-2 mt-2">
                            {formData.images.map((image, index) => (
                                <div key={index} className="col-md-3">
                                    <div className="position-relative">
                                        <img
                                            src={image}
                                            alt={`Room ${index + 1}`}
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

