import React, { useState, useEffect } from 'react';
import { handleUserVerification, fetchVerificationStatus, getVerificationStatusBadge } from '../../services/verificationServices';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import ToastContainer from '../../components/ui/ToastContainer';
import useToast from '../../hooks/useToast';

const UserVerification = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [cnicFront, setCnicFront] = useState(null);
    const [cnicBack, setCnicBack] = useState(null);
    const [passportPhoto, setPassportPhoto] = useState(null);
    const [cnicFrontPreview, setCnicFrontPreview] = useState(null);
    const [cnicBackPreview, setCnicBackPreview] = useState(null);
    const [passportPhotoPreview, setPassportPhotoPreview] = useState(null);
    const { toasts, showSuccess, showError, removeToast } = useToast();

    useEffect(() => {
        loadVerificationStatus();
    }, []);

    const loadVerificationStatus = async () => {
        try {
            setLoading(true);
            const result = await fetchVerificationStatus();
            if (result.success) {
                setVerificationStatus(result.data.user_verification);
            } else {
                showError('Error', result.message || 'Failed to load verification status');
            }
        } catch (error) {
            console.error('Error loading verification status:', error);
            showError('Error', 'Failed to load verification status');
        } finally {
            setLoading(false);
        }
    };

    const handleCnicFrontUpload = (publicId, secureUrl) => {
        setCnicFront(publicId);
        setCnicFrontPreview(secureUrl);
    };

    const handleCnicBackUpload = (publicId, secureUrl) => {
        setCnicBack(publicId);
        setCnicBackPreview(secureUrl);
    };

    const handlePassportPhotoUpload = (publicId, secureUrl) => {
        setPassportPhoto(publicId);
        setPassportPhotoPreview(secureUrl);
    };

    const handleSubmit = async () => {
        if (!cnicFront || !cnicBack || !passportPhoto) {
            showError('Error', 'Please upload CNIC front, back images, and passport photo');
            return;
        }

        try {
            setSubmitting(true);
            const result = await handleUserVerification(cnicFront, cnicBack, passportPhoto);
            
            if (result.success) {
                showSuccess('Success', result.message);
                setCnicFront(null);
                setCnicBack(null);
                setPassportPhoto(null);
                setCnicFrontPreview(null);
                setCnicBackPreview(null);
                setPassportPhotoPreview(null);
                loadVerificationStatus(); // Reload status
            } else {
                showError('Error', result.message);
            }
        } catch (error) {
            console.error('Error submitting verification:', error);
            showError('Error', 'Failed to submit verification request');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = () => {
        if (!verificationStatus) return null;
        const badge = getVerificationStatusBadge(verificationStatus.status);
        return (
            <Badge variant={badge.variant}>
                <i className={`${badge.icon} me-1`}></i>
                {badge.text}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading verification status...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            
            {/* Page Header */}
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">User Verification</h1>
                <p className="text-muted">Upload your CNIC documents for identity verification</p>
            </div>

            {/* Current Status */}
            {verificationStatus && (
                <Card className="mb-4">
                    <CardContent className="p-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-1">Verification Status</h5>
                                <p className="text-muted mb-0">
                                    {verificationStatus.status === 'approved' 
                                        ? 'Your account has been verified successfully'
                                        : verificationStatus.status === 'rejected'
                                        ? 'Your verification was rejected'
                                        : verificationStatus.status === 'pending'
                                        ? 'Your verification is under review'
                                        : 'Please submit your verification documents'
                                    }
                                </p>
                                {verificationStatus.rejection_reason && (
                                    <div className="mt-2">
                                        <small className="text-danger">
                                            <strong>Rejection Reason:</strong> {verificationStatus.rejection_reason}
                                        </small>
                                    </div>
                                )}
                            </div>
                            {getStatusBadge()}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Verification Form */}
            {(!verificationStatus || verificationStatus.status !== 'approved') && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload CNIC Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="row g-4">
                            {/* CNIC Front Upload */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        CNIC Front <span className="text-danger">*</span>
                                    </label>
                                    <p className="text-muted small mb-2">
                                        Upload a clear image of the front side of your CNIC
                                    </p>
                                    
                                    {cnicFrontPreview ? (
                                        <div className="border rounded p-3 text-center">
                                            <img 
                                                src={cnicFrontPreview} 
                                                alt="CNIC Front Preview" 
                                                className="img-fluid rounded mb-2"
                                                style={{ maxHeight: '200px' }}
                                            />
                                            <div className="d-flex justify-content-center gap-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setCnicFront(null);
                                                        setCnicFrontPreview(null);
                                                    }}
                                                >
                                                    <i className="fas fa-edit me-1"></i>
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border rounded p-4 text-center" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div>
                                                <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                                                <p className="text-muted">Click to upload CNIC front image</p>
                                                <button 
                                                    className="btn btn-outline-primary"
                                                    onClick={() => {
                                                        // Cloudinary widget will be implemented here
                                                        console.log('Open Cloudinary widget for CNIC front');
                                                    }}
                                                >
                                                    <i className="fas fa-upload me-2"></i>
                                                    Upload CNIC Front
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CNIC Back Upload */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        CNIC Back <span className="text-danger">*</span>
                                    </label>
                                    <p className="text-muted small mb-2">
                                        Upload a clear image of the back side of your CNIC
                                    </p>
                                    
                                    {cnicBackPreview ? (
                                        <div className="border rounded p-3 text-center">
                                            <img 
                                                src={cnicBackPreview} 
                                                alt="CNIC Back Preview" 
                                                className="img-fluid rounded mb-2"
                                                style={{ maxHeight: '200px' }}
                                            />
                                            <div className="d-flex justify-content-center gap-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setCnicBack(null);
                                                        setCnicBackPreview(null);
                                                    }}
                                                >
                                                    <i className="fas fa-edit me-1"></i>
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border rounded p-4 text-center" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div>
                                                <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                                                <p className="text-muted">Click to upload CNIC back image</p>
                                                <button 
                                                    className="btn btn-outline-primary"
                                                    onClick={() => {
                                                        // Cloudinary widget will be implemented here
                                                        console.log('Open Cloudinary widget for CNIC back');
                                                    }}
                                                >
                                                    <i className="fas fa-upload me-2"></i>
                                                    Upload CNIC Back
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Passport Photo Upload */}
                        <div className="row g-4 mb-4">
                            <div className="col-12">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Passport-Size Photo <span className="text-danger">*</span>
                                    </label>
                                    <p className="text-muted small mb-2">
                                        Take a passport-size photo using your camera (not from gallery)
                                    </p>
                                    
                                    {passportPhotoPreview ? (
                                        <div className="border rounded p-3 text-center">
                                            <img 
                                                src={passportPhotoPreview} 
                                                alt="Passport Photo Preview" 
                                                className="img-fluid rounded mb-2"
                                                style={{ maxHeight: '200px' }}
                                            />
                                            <div className="d-flex justify-content-center gap-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setPassportPhoto(null);
                                                        setPassportPhotoPreview(null);
                                                    }}
                                                >
                                                    <i className="fas fa-edit me-1"></i>
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border rounded p-4 text-center" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div>
                                                <i className="fas fa-camera fa-3x text-muted mb-3"></i>
                                                <p className="text-muted">Take passport-size photo with camera</p>
                                                <button 
                                                    className="btn btn-outline-primary"
                                                    onClick={() => {
                                                        // Cloudinary widget will be implemented here
                                                        console.log('Open Cloudinary widget for passport photo');
                                                    }}
                                                >
                                                    <i className="fas fa-camera me-2"></i>
                                                    Take Photo
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Requirements Info */}
                        <div className="alert alert-info">
                            <h6 className="alert-heading">
                                <i className="fas fa-info-circle me-2"></i>
                                Document Requirements
                            </h6>
                            <ul className="mb-0">
                                <li>Images must be clear and readable</li>
                                <li>File formats: JPG, JPEG, PNG only</li>
                                <li>Maximum file size: 5MB per image</li>
                                <li>Both front and back sides are required</li>
                                <li>Passport-size photo must be taken with camera (not from gallery)</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={submitting || !cnicFront || !cnicBack || !passportPhoto}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane me-2"></i>
                                        Submit Verification Request
                                    </>
                                )}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Success Message */}
            {verificationStatus && verificationStatus.status === 'approved' && (
                <Card className="border-success">
                    <CardContent className="p-4">
                        <div className="text-center">
                            <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                            <h5 className="text-success">Verification Complete!</h5>
                            <p className="text-muted">
                                Your account has been successfully verified. You can now proceed with hostel verification.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default UserVerification;
