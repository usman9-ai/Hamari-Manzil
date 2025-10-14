import React, { useState, useEffect } from 'react';
import { handleRoomVerification, fetchVerificationStatus, getVerificationStatusBadge } from '../../services/verificationServices';
import { fetchMyRooms } from '../../services/roomServices';
import { fetchMyHostels } from '../../services/hostelServices';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import CameraCapture from '../../components/verification/CameraCapture';
import ToastContainer from '../../components/ui/ToastContainer';
import useToast from '../../hooks/useToast';

const RoomVerification = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [hostels, setHostels] = useState([]);
    const [verificationStatus, setVerificationStatus] = useState({});
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [capturedImages, setCapturedImages] = useState([]);
    const { toasts, showSuccess, showError, removeToast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [roomsResult, hostelsResult, statusResult] = await Promise.all([
                fetchMyRooms(),
                fetchMyHostels(),
                fetchVerificationStatus()
            ]);

            if (roomsResult.success) {
                setRooms(roomsResult.data);
            }
            if (hostelsResult.success) {
                setHostels(hostelsResult.data);
            }
            if (statusResult.success) {
                setVerificationStatus(statusResult.data.room_verifications || {});
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showError('Error', 'Failed to load room data');
        } finally {
            setLoading(false);
        }
    };

    const handleImagesCaptured = (images) => {
        setCapturedImages(images);
    };

    const handleSubmit = async () => {
        if (!selectedRoom) {
            showError('Error', 'Please select a room');
            return;
        }

        if (capturedImages.length < 3) {
            showError('Error', 'Please capture at least 3 photos');
            return;
        }

        try {
            setSubmitting(true);
            const result = await handleRoomVerification(selectedRoom.id, capturedImages);
            
            if (result.success) {
                showSuccess('Success', result.message);
                setSelectedRoom(null);
                setCapturedImages([]);
                loadData(); // Reload status
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

    const getStatusBadge = (roomId) => {
        const status = verificationStatus[roomId]?.status || 'not_submitted';
        const badge = getVerificationStatusBadge(status);
        return (
            <Badge variant={badge.variant}>
                <i className={`${badge.icon} me-1`}></i>
                {badge.text}
            </Badge>
        );
    };

    const getVerifiedHostels = () => {
        return hostels.filter(hostel => hostel.verification_status);
    };

    const getRoomsForVerification = () => {
        const verifiedHostels = getVerifiedHostels();
        return rooms.filter(room => 
            verifiedHostels.some(hostel => hostel.id === room.hostel)
        );
    };

    const canSubmitVerification = (roomId) => {
        const status = verificationStatus[roomId]?.status;
        return status !== 'pending' && status !== 'approved';
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading room data...</p>
                </div>
            </div>
        );
    }

    const roomsForVerification = getRoomsForVerification();
    const verifiedHostels = getVerifiedHostels();

    return (
        <div className="container-fluid py-4">
            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            
            {/* Page Header */}
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Room Verification</h1>
                <p className="text-muted">Take photos of your rooms using camera for verification</p>
            </div>

            {/* Prerequisites Check */}
            {verifiedHostels.length === 0 && (
                <Card className="border-warning mb-4">
                    <CardContent className="p-4">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-exclamation-triangle fa-2x text-warning me-3"></i>
                            <div>
                                <h5 className="mb-1">Hostel Verification Required</h5>
                                <p className="text-muted mb-0">
                                    You need to verify your hostels first before you can verify rooms.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Room Selection */}
            {verifiedHostels.length > 0 && (
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>Select Room for Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {roomsForVerification.length === 0 ? (
                            <div className="text-center py-4">
                                <i className="fas fa-bed fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted">No Rooms Available</h5>
                                <p className="text-muted">Create rooms in your verified hostels first.</p>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {roomsForVerification.map((room) => (
                                    <div key={room.id} className="col-md-6 col-lg-4">
                                        <div 
                                            className={`border rounded p-3 cursor-pointer ${
                                                selectedRoom?.id === room.id ? 'border-primary bg-light' : ''
                                            }`}
                                            onClick={() => setSelectedRoom(room)}
                                        >
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h6 className="mb-1">Room {room.id}</h6>
                                                    <p className="text-muted small mb-0">
                                                        {room.hostel_name || 'Unknown Hostel'}
                                                    </p>
                                                </div>
                                                {getStatusBadge(room.id)}
                                            </div>
                                            
                                            <div className="row g-2 mb-2">
                                                <div className="col-6">
                                                    <small className="text-muted">Type</small>
                                                    <div className="fw-semibold">
                                                        {room.room_type?.charAt(0).toUpperCase() + room.room_type?.slice(1) || 'Shared'}
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <small className="text-muted">Rent</small>
                                                    <div className="fw-semibold">Rs {room.rent || 0}</div>
                                                </div>
                                            </div>

                                            {verificationStatus[room.id]?.rejection_reason && (
                                                <div className="mt-2">
                                                    <small className="text-danger">
                                                        <strong>Rejection Reason:</strong> {verificationStatus[room.id].rejection_reason}
                                                    </small>
                                                </div>
                                            )}

                                            {selectedRoom?.id === room.id && (
                                                <div className="mt-2">
                                                    <small className="text-primary">
                                                        <i className="fas fa-check-circle me-1"></i>
                                                        Selected for verification
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Camera Capture */}
            {selectedRoom && (
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>
                            Capture Room Photos - Room {selectedRoom.id}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <CameraCapture
                            onImagesCaptured={handleImagesCaptured}
                            maxImages={5}
                            minImages={3}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Submit Button */}
            {selectedRoom && capturedImages.length >= 3 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="mb-1">Ready to Submit</h6>
                                <p className="text-muted mb-0">
                                    Room {selectedRoom.id} • {capturedImages.length} photos captured
                                </p>
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={submitting}
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

            {/* Verification Status Summary */}
            {roomsForVerification.length > 0 && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Verification Status Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="row g-3">
                            {roomsForVerification.map((room) => (
                                <div key={room.id} className="col-md-6">
                                    <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                                        <div>
                                            <h6 className="mb-1">Room {room.id}</h6>
                                            <p className="text-muted small mb-0">
                                                {room.hostel_name || 'Unknown Hostel'}
                                            </p>
                                        </div>
                                        {getStatusBadge(room.id)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default RoomVerification;
