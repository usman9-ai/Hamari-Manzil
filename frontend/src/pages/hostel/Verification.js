import React, { useState, useEffect } from 'react';
import { getHostels, getVerificationRequests, submitVerificationRequest } from '../../actions/hostelActions';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const Verification = () => {
    const [hostels, setHostels] = useState([]);
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [hostelsRes, verificationsRes] = await Promise.all([
                getHostels(),
                getVerificationRequests()
            ]);

            if (hostelsRes.success) setHostels(hostelsRes.data);
            if (verificationsRes.success) setVerificationRequests(verificationsRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitVerification = async () => {
        if (!selectedHostel) {
            alert('Please select a hostel');
            return;
        }

        if (documents.length === 0) {
            alert('Please upload at least one document');
            return;
        }

        try {
            setSubmitting(true);
            const result = await submitVerificationRequest(selectedHostel.id, documents);

            if (result.success) {
                alert('Verification request submitted successfully');
                setShowModal(false);
                setSelectedHostel(null);
                setDocuments([]);
                loadData();
            } else {
                alert(result.message || 'Failed to submit verification request');
            }
        } catch (error) {
            console.error('Error submitting verification:', error);
            alert('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const uploadedDocs = files.map(file => ({
            name: file.name.split('.')[0],
            url: file.name,
            uploadedAt: new Date().toISOString().split('T')[0]
        }));
        setDocuments(prev => [...prev, ...uploadedDocs]);
    };

    const removeDocument = (index) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            approved: 'success',
            rejected: 'danger',
        };
        return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
    };

    const unverifiedHostels = hostels.filter(h =>
        !h.verified &&
        !verificationRequests.find(vr => vr.hostelId === h.id)
    );

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
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold mb-1">Hostel Verification</h1>
                    <p className="text-muted">Request verification for your hostels</p>
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
                                        {hostels.filter(h => h.verified).length}
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
                                        {verificationRequests.filter(vr => vr.status === 'pending').length}
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

            {/* Verification Requests */}
            <Card>
                <CardHeader>
                    <CardTitle>Verification Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {verificationRequests.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-certificate fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">No verification requests</h5>
                            <p className="text-muted mb-3">Submit verification requests to build trust with students</p>
                            {unverifiedHostels.length > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowModal(true)}
                                >
                                    <i className="fas fa-paper-plane me-2"></i>
                                    Submit Request
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Hostel Name</th>
                                        <th>Submitted Date</th>
                                        <th>Documents</th>
                                        <th>Status</th>
                                        <th>Admin Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {verificationRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td>
                                                <div className="fw-semibold">{request.hostelName}</div>
                                            </td>
                                            <td>{request.submittedAt}</td>
                                            <td>
                                                <div className="d-flex flex-column gap-1">
                                                    {request.documents.map((doc, idx) => (
                                                        <Badge key={idx} variant="info" className="me-1">
                                                            <i className="fas fa-file me-1"></i>
                                                            {doc.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(request.status)}</td>
                                            <td>
                                                {request.adminNotes ? (
                                                    <span className="text-muted">{request.adminNotes}</span>
                                                ) : (
                                                    <span className="text-muted fst-italic">No notes yet</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Unverified Hostels */}
            {unverifiedHostels.length > 0 && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Unverified Hostels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="row g-3">
                            {unverifiedHostels.map((hostel) => (
                                <div key={hostel.id} className="col-md-6">
                                    <div className="border rounded p-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h6 className="mb-1">{hostel.name}</h6>
                                                <p className="text-muted small mb-2">{hostel.city}</p>
                                                <Badge variant="warning">Not Verified</Badge>
                                            </div>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

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
                                        setDocuments([]);
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

                                {/* Upload Documents */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Upload Documents
                                        <span className="text-danger ms-1">*</span>
                                    </label>
                                    <p className="text-muted small mb-2">
                                        Required: CNIC, Business License, Utility Bills
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
                                {documents.length > 0 && (
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Uploaded Documents</label>
                                        <div className="list-group">
                                            {documents.map((doc, idx) => (
                                                <div key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <i className="fas fa-file me-2 text-primary"></i>
                                                        {doc.name}
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
                                        setDocuments([]);
                                    }}
                                >
                                    <i className="fas fa-times me-2"></i>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmitVerification}
                                    disabled={submitting || !selectedHostel || documents.length === 0}
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

