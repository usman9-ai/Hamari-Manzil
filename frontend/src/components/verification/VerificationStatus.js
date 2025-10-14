import React, { useState, useEffect } from 'react';
import { fetchVerificationStatus, getVerificationStatusBadge, getNextVerificationStep } from '../../services/verificationServices';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const VerificationStatus = () => {
    const [loading, setLoading] = useState(true);
    const [verificationData, setVerificationData] = useState(null);
    const [nextStep, setNextStep] = useState(null);

    useEffect(() => {
        loadVerificationStatus();
    }, []);

    const loadVerificationStatus = async () => {
        try {
            setLoading(true);
            const result = await fetchVerificationStatus();
            if (result.success) {
                setVerificationData(result.data);
                
                // Determine next step
                const next = getNextVerificationStep(
                    result.data.user_verification?.status || 'not_submitted',
                    result.data.hostel_verifications || {},
                    result.data.room_verifications || {}
                );
                setNextStep(next);
            }
        } catch (error) {
            console.error('Error loading verification status:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badge = getVerificationStatusBadge(status);
        return (
            <Badge variant={badge.variant}>
                <i className={`${badge.icon} me-1`}></i>
                {badge.text}
            </Badge>
        );
    };

    const getProgressPercentage = () => {
        if (!verificationData) return 0;
        
        let completed = 0;
        let total = 3; // user, hostel, room
        
        // User verification
        if (verificationData.user_verification?.status === 'approved') completed++;
        
        // Hostel verification (at least one approved)
        const hostelStatuses = Object.values(verificationData.hostel_verifications || {});
        if (hostelStatuses.some(status => status.status === 'approved')) completed++;
        
        // Room verification (at least one approved)
        const roomStatuses = Object.values(verificationData.room_verifications || {});
        if (roomStatuses.some(status => status.status === 'approved')) completed++;
        
        return Math.round((completed / total) * 100);
    };

    const getQuickActions = () => {
        if (!nextStep) return [];
        
        const actions = [];
        
        if (nextStep.type === 'user') {
            actions.push({
                text: 'Verify Account',
                link: '/hostel/user-verification',
                icon: 'fas fa-user-check',
                variant: 'primary'
            });
        } else if (nextStep.type === 'hostel') {
            actions.push({
                text: 'Verify Hostels',
                link: '/hostel/verification',
                icon: 'fas fa-building',
                variant: 'warning'
            });
        } else if (nextStep.type === 'room') {
            actions.push({
                text: 'Verify Rooms',
                link: '/hostel/room-verification',
                icon: 'fas fa-bed',
                variant: 'info'
            });
        }
        
        return actions;
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-4">
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const progressPercentage = getProgressPercentage();
    const quickActions = getQuickActions();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="d-flex justify-content-between align-items-center">
                    <span>Verification Status</span>
                    {progressPercentage === 100 && (
                        <Badge variant="success">
                            <i className="fas fa-check-circle me-1"></i>
                            Complete
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold">Overall Progress</span>
                        <span className="text-muted">{progressPercentage}%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                        <div 
                            className="progress-bar bg-primary" 
                            role="progressbar" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Verification Steps */}
                <div className="row g-3 mb-4">
                    {/* User Verification */}
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <div className="me-3">
                                <i className="fas fa-user fa-2x text-muted"></i>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="mb-1">User Verification</h6>
                                <p className="text-muted small mb-1">CNIC Documents</p>
                                {getStatusBadge(verificationData?.user_verification?.status || 'not_submitted')}
                            </div>
                        </div>
                    </div>

                    {/* Hostel Verification */}
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <div className="me-3">
                                <i className="fas fa-building fa-2x text-muted"></i>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="mb-1">Hostel Verification</h6>
                                <p className="text-muted small mb-1">Utility Bills</p>
                                {(() => {
                                    const hostelStatuses = Object.values(verificationData?.hostel_verifications || {});
                                    const hasApproved = hostelStatuses.some(status => status.status === 'approved');
                                    const hasPending = hostelStatuses.some(status => status.status === 'pending');
                                    const status = hasApproved ? 'approved' : hasPending ? 'pending' : 'not_submitted';
                                    return getStatusBadge(status);
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Room Verification */}
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <div className="me-3">
                                <i className="fas fa-bed fa-2x text-muted"></i>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="mb-1">Room Verification</h6>
                                <p className="text-muted small mb-1">Camera Photos</p>
                                {(() => {
                                    const roomStatuses = Object.values(verificationData?.room_verifications || {});
                                    const hasApproved = roomStatuses.some(status => status.status === 'approved');
                                    const hasPending = roomStatuses.some(status => status.status === 'pending');
                                    const status = hasApproved ? 'approved' : hasPending ? 'pending' : 'not_submitted';
                                    return getStatusBadge(status);
                                })()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Step */}
                {nextStep && nextStep.type !== 'complete' && (
                    <div className="alert alert-info">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-info-circle fa-2x me-3"></i>
                            <div>
                                <h6 className="alert-heading mb-1">Next Step</h6>
                                <p className="mb-0">{nextStep.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                {quickActions.length > 0 && (
                    <div className="d-flex gap-2">
                        {quickActions.map((action, index) => (
                            <a
                                key={index}
                                href={action.link}
                                className={`btn btn-${action.variant} btn-sm`}
                            >
                                <i className={`${action.icon} me-1`}></i>
                                {action.text}
                            </a>
                        ))}
                    </div>
                )}

                {/* Completion Message */}
                {progressPercentage === 100 && (
                    <div className="alert alert-success">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-check-circle fa-2x me-3"></i>
                            <div>
                                <h6 className="alert-heading mb-1">Verification Complete!</h6>
                                <p className="mb-0">All your verifications have been approved. Your listings are now fully verified.</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default VerificationStatus;
