import React, { useState, useEffect, useCallback } from 'react';
import { handleHostelVerification, fetchVerificationStatus, getVerificationStatusBadge } from '../../services/verificationServices';
import { fetchMyHostels } from '../../services/hostelServices';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import ToastContainer from '../../components/ui/ToastContainer';
import useToast from '../../hooks/useToast';

const Verification = () => {
    const [hostels, setHostels] = useState([]);
    const [verificationStatus, setVerificationStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [utilityBill, setUtilityBill] = useState(null);
    const [utilityBillPreview, setUtilityBillPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const { toasts, showSuccess, showError, removeToast } = useToast();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [hostelsRes, statusRes] = await Promise.all([
                fetchMyHostels(),
                fetchVerificationStatus()
            ]);

            if (hostelsRes.success) setHostels(hostelsRes.data);
            if (statusRes.success) setVerificationStatus(statusRes.data.hostel_verifications || {});
        } catch (error) {
            console.error('Error loading data:', error);
            showError('Error', 'Failed to load verification data');
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSubmitVerification = async () => {
        if (!selectedHostel) {
            showError('Error', 'Please select a hostel');
            return;
        }

        if (!utilityBill) {
            showError('Error', 'Please upload a utility bill document');
            return;
        }

        try {
            setSubmitting(true);
            const result = await handleHostelVerification(selectedHostel.id, utilityBill);

            if (result.success) {
                showSuccess('Success', result.message);
                setShowModal(false);
                setSelectedHostel(null);
                setUtilityBill(null);
                setUtilityBillPreview(null);
                loadData();
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


    const getStatusBadge = (hostelId) => {
        const status = verificationStatus[hostelId]?.status || 'not_submitted';
        const badge = getVerificationStatusBadge(status);
        return (
            <Badge variant={badge.variant}>
                <i className={`${badge.icon} me-1`}></i>
                {badge.text}
            </Badge>
        );
    };

    const unverifiedHostels = hostels.filter(hostel => {
        const status = verificationStatus[hostel.id]?.status;
        return status !== 'approved' && status !== 'pending';
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading data...</p>
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
                    <h1 className="h3 fw-bold mb-1">Hostel Verification</h1>
                    <p className="text-muted">Upload utility bills to verify your hostels</p>
                </div>
                {unverifiedHostels.length > 0 && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Submit Verification Request
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Verified Hostels</p>
                                    <h2 className="h3 fw-bold mb-0">
                                        {Object.values(verificationStatus).filter(v => v.status === 'approved').length}
                                    </h2>
                                </div>
                                <div className="bg-success bg-opacity-10 rounded p-2">
                                    <i className="fas fa-check-circle text-success fs-4"></i>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Pending Requests</p>
                                    <h2 className="h3 fw-bold mb-0">
                                        {Object.values(verificationStatus).filter(v => v.status === 'pending').length}
                                    </h2>
                                </div>
                                <div className="bg-warning bg-opacity-10 rounded p-2">
                                    <i className="fas fa-clock text-warning fs-4"></i>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Unverified Hostels</p>
                                    <h2 className="h3 fw-bold mb-0">{unverifiedHostels.length}</h2>
                                </div>
                                <div className="bg-danger bg-opacity-10 rounded p-2">
                                    <i className="fas fa-exclamation-circle text-danger fs-4"></i>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Hostel Verification Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Hostel Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {hostels.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-hotel fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">No hostels found</h5>
                            <p className="text-muted mb-3">Create hostels first to request verification</p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {hostels.map((hostel) => (
                                <div key={hostel.id} className="col-md-6">
                                    <div className="border rounded p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="mb-1">{hostel.name}</h6>
                                                <p className="text-muted small mb-0">{hostel.city}</p>
                                            </div>
                                            {getStatusBadge(hostel.id)}
                                        </div>
                                        
                                        {verificationStatus[hostel.id]?.rejection_reason && (
                                            <div className="mt-2">
                                                <small className="text-danger">
                                                    <strong>Rejection Reason:</strong> {verificationStatus[hostel.id].rejection_reason}
                                                </small>
                                            </div>
                                        )}
                                        
                                        {verificationStatus[hostel.id]?.created_at && (
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    Submitted: {new Date(verificationStatus[hostel.id].created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                        )}
                                        
                                        {unverifiedHostels.some(h => h.id === hostel.id) && (
                                            <div className="mt-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setSelectedHostel(hostel);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <i className="fas fa-paper-plane me-2"></i>
                                                    Request Verification
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>


            {/* Verification Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Submit Verification Request</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedHostel(null);
                                        setUtilityBill(null);
                                        setUtilityBillPreview(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Select Hostel */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Select Hostel</label>
                                    <select
                                        className="form-select"
                                        value={selectedHostel?.id || ''}
                                        onChange={(e) => {
                                            const hostel = unverifiedHostels.find(h => h.id === parseInt(e.target.value));
                                            setSelectedHostel(hostel);
                                        }}
                                    >
                                        <option value="">-- Select a hostel --</option>
                                        {unverifiedHostels.map((hostel) => (
                                            <option key={hostel.id} value={hostel.id}>
                                                {hostel.name} - {hostel.city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Upload Utility Bill */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Upload Utility Bill
                                        <span className="text-danger ms-1">*</span>
                                    </label>
                                    <p className="text-muted small mb-2">
                                        Required: Utility bill or property document showing the hostel address
                                    </p>
                                    
                                    {utilityBillPreview ? (
                                        <div className="border rounded p-3 text-center">
                                            <img 
                                                src={utilityBillPreview} 
                                                alt="Utility Bill Preview" 
                                                className="img-fluid rounded mb-2"
                                                style={{ maxHeight: '200px' }}
                                            />
                                            <div className="d-flex justify-content-center gap-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setUtilityBill(null);
                                                        setUtilityBillPreview(null);
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
                                                <p className="text-muted">Click to upload utility bill</p>
                                                <button 
                                                    className="btn btn-outline-primary"
                                                    onClick={() => {
                                                        // Cloudinary widget will be implemented here
                                                        console.log('Open Cloudinary widget for utility bill');
                                                    }}
                                                >
                                                    <i className="fas fa-upload me-2"></i>
                                                    Upload Utility Bill
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Info Alert */}
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Verification requests are typically reviewed within 3-5 business days. You'll receive email notifications about status updates.
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedHostel(null);
                                        setUtilityBill(null);
                                        setUtilityBillPreview(null);
                                    }}
                                >
                                    <i className="fas fa-times me-2"></i>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmitVerification}
                                    disabled={submitting || !selectedHostel || !utilityBill}
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
            )}
        </div>
    );
};

export default Verification;

