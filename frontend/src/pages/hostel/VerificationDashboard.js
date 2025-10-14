import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { fetchVerificationStatus, getVerificationStatusBadge, getNextVerificationStep } from '../../services/verificationServices';
import { useNavigate } from 'react-router-dom';
import ToastContainer from '../../components/ui/ToastContainer';
import useToast from '../../hooks/useToast';

const VerificationDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [verificationData, setVerificationData] = useState(null);
    const navigate = useNavigate();
    const { toasts, showError, removeToast } = useToast();

    useEffect(() => {
        loadVerificationData();
    }, []);

    const loadVerificationData = async () => {
        try {
            setLoading(true);
            const result = await fetchVerificationStatus();
            if (result.success) {
                setVerificationData(result.data);
            } else {
                showError('Error', result.message || 'Failed to load verification data');
            }
        } catch (error) {
            console.error('Error loading verification data:', error);
            showError('Error', 'Failed to load verification data');
        } finally {
            setLoading(false);
        }
    };

    const getStepStatus = (stepType) => {
        if (!verificationData) return 'not_submitted';
        
        if (stepType === 'user') {
            return verificationData.user_verification?.status || 'not_submitted';
        } else if (stepType === 'hostel') {
            // Check if any hostels are verified
            const hostelStatuses = Object.values(verificationData.hostel_verifications || {});
            if (hostelStatuses.length === 0) return 'not_submitted';
            return hostelStatuses.some(status => status.status === 'approved') ? 'approved' : 'pending';
        } else if (stepType === 'room') {
            // Check if any rooms are verified
            const roomStatuses = Object.values(verificationData.room_verifications || {});
            if (roomStatuses.length === 0) return 'not_submitted';
            return roomStatuses.some(status => status.status === 'approved') ? 'approved' : 'pending';
        }
        
        return 'not_submitted';
    };

    const getStepIcon = (stepType) => {
        const status = getStepStatus(stepType);
        const statusConfig = getVerificationStatusBadge(status);
        return statusConfig.icon;
    };

    const getStepColor = (stepType) => {
        const status = getStepStatus(stepType);
        const statusConfig = getVerificationStatusBadge(status);
        return statusConfig.variant;
    };

    const getStepTitle = (stepType) => {
        const status = getStepStatus(stepType);
        const statusConfig = getVerificationStatusBadge(status);
        return statusConfig.text;
    };

    const handleStepClick = (stepType) => {
        if (stepType === 'user') {
            navigate('/hostel/user-verification');
        } else if (stepType === 'hostel') {
            navigate('/hostel/verification');
        } else if (stepType === 'room') {
            navigate('/hostel/room-verification');
        }
    };

    const getNextStep = () => {
        if (!verificationData) return null;
        
        const userStatus = getStepStatus('user');
        const hostelStatus = getStepStatus('hostel');
        const roomStatus = getStepStatus('room');
        
        return getNextVerificationStep(userStatus, verificationData.hostel_verifications || {}, verificationData.room_verifications || {});
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3"></div>
                    <p className="text-muted">Loading verification status...</p>
                </div>
            </div>
        );
    }

    const nextStep = getNextStep();
    const userStatus = getStepStatus('user');
    const hostelStatus = getStepStatus('hostel');
    const roomStatus = getStepStatus('room');

    return (
        <div className="container-fluid">
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="h3 fw-bold mb-1">Verification Dashboard</h2>
                            <p className="text-muted mb-0">Complete your verification to start listing hostels and rooms</p>
                        </div>
                        <Button 
                            variant="outline-primary" 
                            onClick={loadVerificationData}
                            disabled={loading}
                        >
                            <i className="fas fa-sync-alt me-2"></i>
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="row mb-4">
                <div className="col-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="text-center p-3 border rounded">
                                        <i className={`fas fa-user fa-2x mb-2 text-${getStepColor('user')}`}></i>
                                        <h6 className="mb-1">User Verification</h6>
                                        <Badge variant={getStepColor('user')}>
                                            {getStepTitle('user')}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="text-center p-3 border rounded">
                                        <i className={`fas fa-building fa-2x mb-2 text-${getStepColor('hostel')}`}></i>
                                        <h6 className="mb-1">Hostel Verification</h6>
                                        <Badge variant={getStepColor('hostel')}>
                                            {getStepTitle('hostel')}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="text-center p-3 border rounded">
                                        <i className={`fas fa-bed fa-2x mb-2 text-${getStepColor('room')}`}></i>
                                        <h6 className="mb-1">Room Verification</h6>
                                        <Badge variant={getStepColor('room')}>
                                            {getStepTitle('room')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Next Step Recommendation */}
            {nextStep && nextStep.type !== 'complete' && (
                <div className="row mb-4">
                    <div className="col-12">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <i className="fas fa-lightbulb me-2 text-warning"></i>
                                    Next Step
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">{nextStep.message}</h6>
                                        <p className="text-muted mb-0">
                                            {nextStep.type === 'user' && 'Upload your CNIC documents and passport photo for identity verification'}
                                            {nextStep.type === 'hostel' && 'Upload utility bills to verify your hostel location'}
                                            {nextStep.type === 'room' && 'Take photos of your rooms using your camera for verification'}
                                        </p>
                                    </div>
                                    <Button 
                                        variant="primary"
                                        onClick={() => handleStepClick(nextStep.type)}
                                    >
                                        <i className="fas fa-arrow-right me-2"></i>
                                        {nextStep.type === 'user' && 'Start User Verification'}
                                        {nextStep.type === 'hostel' && 'Start Hostel Verification'}
                                        {nextStep.type === 'room' && 'Start Room Verification'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Verification Steps */}
            <div className="row g-4">
                {/* Step 1: User Verification */}
                <div className="col-md-4">
                    <Card className="h-100">
                        <CardHeader>
                            <CardTitle className="d-flex align-items-center">
                                <i className={`fas fa-user me-2 text-${getStepColor('user')}`}></i>
                                Step 1: User Verification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="mb-3">
                                <Badge variant={getStepColor('user')} className="mb-2">
                                    {getStepTitle('user')}
                                </Badge>
                                <p className="text-muted small mb-0">
                                    Verify your identity with CNIC documents and passport photo
                                </p>
                            </div>
                            
                            <ul className="list-unstyled small text-muted mb-3">
                                <li><i className="fas fa-check me-2 text-success"></i>CNIC Front Image</li>
                                <li><i className="fas fa-check me-2 text-success"></i>CNIC Back Image</li>
                                <li><i className="fas fa-check me-2 text-success"></i>Passport-Size Photo</li>
                            </ul>
                            
                            <Button 
                                variant="outline-primary" 
                                className="w-100"
                                onClick={() => handleStepClick('user')}
                            >
                                <i className="fas fa-edit me-2"></i>
                                {userStatus === 'approved' ? 'View Details' : 'Start Verification'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Step 2: Hostel Verification */}
                <div className="col-md-4">
                    <Card className="h-100">
                        <CardHeader>
                            <CardTitle className="d-flex align-items-center">
                                <i className={`fas fa-building me-2 text-${getStepColor('hostel')}`}></i>
                                Step 2: Hostel Verification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="mb-3">
                                <Badge variant={getStepColor('hostel')} className="mb-2">
                                    {getStepTitle('hostel')}
                                </Badge>
                                <p className="text-muted small mb-0">
                                    Verify your hostel location with utility bills
                                </p>
                            </div>
                            
                            <ul className="list-unstyled small text-muted mb-3">
                                <li><i className="fas fa-check me-2 text-success"></i>Utility Bill Document</li>
                                <li><i className="fas fa-check me-2 text-success"></i>Location Verification</li>
                                <li><i className="fas fa-check me-2 text-success"></i>Property Documents</li>
                            </ul>
                            
                            <Button 
                                variant="outline-primary" 
                                className="w-100"
                                onClick={() => handleStepClick('hostel')}
                                disabled={userStatus !== 'approved'}
                            >
                                <i className="fas fa-edit me-2"></i>
                                {hostelStatus === 'approved' ? 'View Details' : 'Start Verification'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Step 3: Room Verification */}
                <div className="col-md-4">
                    <Card className="h-100">
                        <CardHeader>
                            <CardTitle className="d-flex align-items-center">
                                <i className={`fas fa-bed me-2 text-${getStepColor('room')}`}></i>
                                Step 3: Room Verification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="mb-3">
                                <Badge variant={getStepColor('room')} className="mb-2">
                                    {getStepTitle('room')}
                                </Badge>
                                <p className="text-muted small mb-0">
                                    Take photos of your rooms using camera
                                </p>
                            </div>
                            
                            <ul className="list-unstyled small text-muted mb-3">
                                <li><i className="fas fa-check me-2 text-success"></i>Camera-Captured Photos</li>
                                <li><i className="fas fa-check me-2 text-success"></i>Room Interior Shots</li>
                                <li><i className="fas fa-check me-2 text-success"></i>Multiple Angles</li>
                            </ul>
                            
                            <Button 
                                variant="outline-primary" 
                                className="w-100"
                                onClick={() => handleStepClick('room')}
                                disabled={hostelStatus !== 'approved'}
                            >
                                <i className="fas fa-edit me-2"></i>
                                {roomStatus === 'approved' ? 'View Details' : 'Start Verification'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Completion Message */}
            {nextStep && nextStep.type === 'complete' && (
                <div className="row mt-4">
                    <div className="col-12">
                        <Card className="border-success">
                            <CardContent className="p-4 text-center">
                                <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                                <h5 className="text-success mb-2">All Verifications Complete!</h5>
                                <p className="text-muted mb-3">
                                    Congratulations! You have successfully completed all verification steps. 
                                    Your hostels and rooms are now verified and ready for listing.
                                </p>
                                <Button 
                                    variant="success"
                                    onClick={() => navigate('/hostel/dashboard')}
                                >
                                    <i className="fas fa-tachometer-alt me-2"></i>
                                    Go to Dashboard
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationDashboard;
