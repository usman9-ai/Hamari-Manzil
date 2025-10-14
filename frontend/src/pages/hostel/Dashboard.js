import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOwnerDashboard } from '../../services/dashboardServices';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import MetricCard from '../../components/dashboard/MetricCard';
import ActivityChart from '../../components/dashboard/ActivityChart';
import TopHostelsCard from '../../components/dashboard/TopHostelsCard';
import ActionItemsCard from '../../components/dashboard/ActionItemsCard';
import VerificationStatus from '../../components/verification/VerificationStatus';
import ToastContainer from '../../components/ui/ToastContainer';
import useToast from '../../hooks/useToast';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();
    const { toasts, showError, removeToast } = useToast();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const result = await fetchOwnerDashboard();
            
            if (result.success) {
                setDashboardData(result.data);
            } else {
                showError('Error', result.message || 'Failed to load dashboard data');
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            showError('Error', 'Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        loadDashboardData(true);
    };

    const handleActionClick = (path) => {
        navigate(path);
    };

    const handleViewHostel = (hostelId) => {
        navigate(`/hostel/hostels`);
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3"></div>
                        <p className="text-muted">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="container-fluid py-4">
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                        <h5 className="text-warning mb-2">Unable to load dashboard</h5>
                        <p className="text-muted mb-3">There was an error loading your dashboard data.</p>
                        <Button variant="primary" onClick={handleRefresh}>
                            <i className="fas fa-sync-alt me-2"></i>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold mb-1">Dashboard</h1>
                    <p className="text-muted">Welcome back! Here's what's happening with your hostels.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-primary"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <i className={`fas fa-sync-alt me-2 ${refreshing ? 'fa-spin' : ''}`}></i>
                        Refresh
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/hostel/hostels')}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Add New Hostel
                    </Button>
                </div>
            </div>

            {/* Key Metrics Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3 col-sm-6">
                    <MetricCard
                        title="Total Hostels"
                        value={dashboardData.total_hostels || 0}
                        subtitle={`${dashboardData.verified_hostels || 0} verified`}
                        icon="fas fa-hotel"
                        color="primary"
                        onClick={() => navigate('/hostel/hostels')}
                    />
                </div>
                <div className="col-md-3 col-sm-6">
                    <MetricCard
                        title="Total Rooms"
                        value={dashboardData.total_rooms || 0}
                        subtitle={`${dashboardData.total_available_beds || 0} beds available`}
                        icon="fas fa-bed"
                        color="success"
                        onClick={() => navigate('/hostel/rooms')}
                    />
                </div>
                <div className="col-md-3 col-sm-6">
                    <MetricCard
                        title="Total Views"
                        value={dashboardData.total_views || 0}
                        subtitle={`${dashboardData.this_week?.views || 0} this week`}
                        icon="fas fa-eye"
                        color="info"
                    />
                </div>
                <div className="col-md-3 col-sm-6">
                    <MetricCard
                        title="Total Contacts"
                        value={dashboardData.total_contacts || 0}
                        subtitle={`${dashboardData.this_week?.contacts || 0} this week`}
                        icon="fas fa-phone"
                        color="success"
                    />
                </div>
            </div>

            {/* Engagement Metrics Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3 col-sm-6">
                    <MetricCard
                        title="Student Favorites"
                        value={dashboardData.total_favorites || 0}
                        subtitle={`${dashboardData.this_week?.favorites || 0} this week`}
                        icon="fas fa-heart"
                        color="danger"
                    />
                </div>
                <div className="col-md-3 col-sm-6">
                    <MetricCard
                        title="Average Rating"
                        value={`${dashboardData.avg_rating || 0}/5`}
                        subtitle={`${dashboardData.total_reviews || 0} reviews`}
                        icon="fas fa-star"
                        color="warning"
                    />
                </div>
                <div className="col-md-3 col-sm-6">
                    <MetricCard
                        title="Pending Reviews"
                        value={dashboardData.pending_reviews || 0}
                        subtitle="Need your response"
                        icon="fas fa-comment-dots"
                        color="warning"
                        onClick={() => navigate('/hostel/reviews')}
                    />
                </div>
                <div className="col-md-3 col-sm-6">
                    <MetricCard
                        title="Verification Status"
                        value={`${dashboardData.verified_hostels || 0}/${dashboardData.total_hostels || 0}`}
                        subtitle={`${dashboardData.unverified_count || 0} pending`}
                        icon="fas fa-certificate"
                        color={dashboardData.unverified_count > 0 ? 'danger' : 'success'}
                        onClick={() => navigate('/hostel/verification')}
                    />
                </div>
            </div>

            {/* Verification Status */}
            <div className="row g-4 mb-4">
                <div className="col-12">
                    <VerificationStatus />
                </div>
            </div>

            {/* Charts & Analytics Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-8">
                    <ActivityChart 
                        data={dashboardData.recent_interactions || []} 
                        loading={loading}
                    />
                </div>
                <div className="col-md-4">
                    <TopHostelsCard 
                        hostels={dashboardData.top_hostels || []}
                        loading={loading}
                        onViewHostel={handleViewHostel}
                    />
                </div>
            </div>

            {/* Action Items Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <ActionItemsCard 
                        actionItems={dashboardData.action_items || {}}
                        onActionClick={handleActionClick}
                    />
                </div>
                <div className="col-md-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="d-flex flex-column gap-3">
                                <Button
                                    variant="outline-primary"
                                    className="d-flex align-items-center justify-content-start"
                                    onClick={() => navigate('/hostel/hostels')}
                                >
                                    <i className="fas fa-hotel me-3"></i>
                                    <div className="text-start">
                                        <div className="fw-semibold">Manage Hostels</div>
                                        <small className="text-muted">View and edit your hostels</small>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline-success"
                                    className="d-flex align-items-center justify-content-start"
                                    onClick={() => navigate('/hostel/rooms')}
                                >
                                    <i className="fas fa-bed me-3"></i>
                                    <div className="text-start">
                                        <div className="fw-semibold">Manage Rooms</div>
                                        <small className="text-muted">Add and update room listings</small>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline-info"
                                    className="d-flex align-items-center justify-content-start"
                                    onClick={() => navigate('/hostel/verification')}
                                >
                                    <i className="fas fa-certificate me-3"></i>
                                    <div className="text-start">
                                        <div className="fw-semibold">Verification</div>
                                        <small className="text-muted">Submit verification requests</small>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Contact Information Card */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Student Inquiries</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="alert alert-info mb-0">
                        <div className="d-flex align-items-start">
                            <i className="fas fa-info-circle fa-2x me-3"></i>
                            <div>
                                <h6 className="mb-2">Direct Communication</h6>
                                <p className="mb-2">Students will contact you directly via WhatsApp or phone for inquiries and bookings.</p>
                                <p className="mb-0 small text-muted">
                                    Make sure your contact details are up-to-date in your hostel listings.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
