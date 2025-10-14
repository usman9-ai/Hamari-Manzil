import React, { useState, useRef } from 'react';

const CameraCapture = ({ onImagesCaptured, maxImages = 5, minImages = 3 }) => {
    const [capturedImages, setCapturedImages] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const fileInputRef = useRef(null);

    const handleCameraCapture = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        
        if (files.length === 0) return;

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            alert('Please select only JPG, JPEG, or PNG images');
            return;
        }

        // Validate file sizes (5MB max)
        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert('File size must be less than 5MB');
            return;
        }

        // Check total images limit
        if (capturedImages.length + files.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        setIsCapturing(true);

        // Process each file
        const newImages = [];
        let processedCount = 0;

        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + index,
                    file: file,
                    url: e.target.result,
                    name: file.name,
                    size: file.size,
                    source: 'camera', // Mark as camera-captured
                    timestamp: new Date().toISOString()
                };
                
                newImages.push(imageData);
                processedCount++;

                if (processedCount === files.length) {
                    const updatedImages = [...capturedImages, ...newImages];
                    setCapturedImages(updatedImages);
                    onImagesCaptured(updatedImages);
                    setIsCapturing(false);
                }
            };
            reader.readAsDataURL(file);
        });

        // Reset file input
        event.target.value = '';
    };

    const removeImage = (imageId) => {
        const updatedImages = capturedImages.filter(img => img.id !== imageId);
        setCapturedImages(updatedImages);
        onImagesCaptured(updatedImages);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="camera-capture-component">
            {/* Hidden file input for camera capture */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {/* Capture Button */}
            <div className="text-center mb-4">
                <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleCameraCapture}
                    disabled={isCapturing || capturedImages.length >= maxImages}
                >
                    {isCapturing ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Processing...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-camera me-2"></i>
                            {capturedImages.length === 0 ? 'Take Photos' : 'Add More Photos'}
                        </>
                    )}
                </button>
                
                {capturedImages.length > 0 && (
                    <p className="text-muted small mt-2">
                        {capturedImages.length}/{maxImages} photos captured
                    </p>
                )}
            </div>

            {/* Image Preview Grid */}
            {capturedImages.length > 0 && (
                <div className="row g-3">
                    {capturedImages.map((image) => (
                        <div key={image.id} className="col-md-4 col-sm-6">
                            <div className="position-relative">
                                <div className="border rounded p-2">
                                    <img
                                        src={image.url}
                                        alt={`Captured ${image.name}`}
                                        className="img-fluid rounded"
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                    
                                    {/* Image Info */}
                                    <div className="mt-2">
                                        <small className="text-muted d-block">
                                            {image.name}
                                        </small>
                                        <small className="text-muted d-block">
                                            {formatFileSize(image.size)}
                                        </small>
                                        <small className="text-success d-block">
                                            <i className="fas fa-camera me-1"></i>
                                            Camera Captured
                                        </small>
                                    </div>
                                    
                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger position-absolute"
                                        style={{ top: '8px', right: '8px' }}
                                        onClick={() => removeImage(image.id)}
                                        title="Remove image"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Requirements Info */}
            <div className="alert alert-warning mt-4">
                <h6 className="alert-heading">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Camera Requirements
                </h6>
                <ul className="mb-0">
                    <li><strong>Camera Only:</strong> Photos must be taken using your device camera</li>
                    <li><strong>Gallery Not Allowed:</strong> Images from gallery will be rejected</li>
                    <li><strong>Minimum:</strong> At least {minImages} photos required</li>
                    <li><strong>Maximum:</strong> Up to {maxImages} photos allowed</li>
                    <li><strong>File Size:</strong> Maximum 5MB per image</li>
                    <li><strong>Formats:</strong> JPG, JPEG, PNG only</li>
                </ul>
            </div>

            {/* Validation Messages */}
            {capturedImages.length > 0 && capturedImages.length < minImages && (
                <div className="alert alert-danger">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Please capture at least {minImages} photos. You have {capturedImages.length} photos.
                </div>
            )}

            {capturedImages.length >= minImages && (
                <div className="alert alert-success">
                    <i className="fas fa-check-circle me-2"></i>
                    Great! You have captured {capturedImages.length} photos. You can submit your verification request.
                </div>
            )}
        </div>
    );
};

export default CameraCapture;
