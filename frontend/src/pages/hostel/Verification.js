import React, { useState, useEffect } from 'react';
import { getHostels, getVerificationRequests } from '../../actions/hostelActions';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const Verification = () => {
    const [hostels, setHostels] = useState([]);
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            approved: 'success',
            rejected: 'danger',
        };
        return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading verification requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Page Header */}
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Verification Requests</h1>
                <p className="text-muted">Track your hostel verification requests and their status</p>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Verified Hostels</p>
                                    <h2 className="h3 fw-bold mb-0">
                                        {hostels.filter(h => h.verified).length}
                                    </h2>
                                </div>
                                <div className="bg-success bg-opacity-10 rounded p-3">
                                    <i className="fas fa-check-circle text-success fs-4"></i>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Pending Requests</p>
                                    <h2 className="h3 fw-bold mb-0">
                                        {verificationRequests.filter(vr => vr.status === 'pending').length}
                                    </h2>
                                </div>
                                <div className="bg-warning bg-opacity-10 rounded p-3">
                                    <i className="fas fa-clock text-warning fs-4"></i>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Verification Requests */}
            <Card>
                <CardHeader className="p-4">
                    <CardTitle>Verification Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {verificationRequests.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-certificate fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">No verification requests yet</h5>
                            <p className="text-muted mb-0">You can submit verification requests from the Hostels page by clicking the "Request Verification" button on any unverified hostel.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Hostel Name</th>
                                        <th>Requested On</th>
                                        <th>Documents</th>
                                        <th>Status</th>
                                        <th>Admin Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {verificationRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <div className="fw-semibold">{request.hostelName}</div>
                                                        <small className="text-muted">{request.hostelCity}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <small>{new Date(request.submittedAt).toLocaleDateString()}</small>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {request.documents.map((doc, idx) => (
                                                        <span key={idx} className="badge bg-light text-dark border">
                                                            <i className="fas fa-file me-1"></i>
                                                            {doc.name}
                                                        </span>
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
        </div>
    );
};

export default Verification;
