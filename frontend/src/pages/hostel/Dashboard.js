import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getHostels } from '../../actions/hostelActions';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import IntroTour from '../../components/IntroTour';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hostels, setHostels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsResult, hostelsResult] = await Promise.all([
                getDashboardStats(),
                getHostels()
            ]);

            if (statsResult.success) {
                setStats(statsResult.data);
            }
            if (hostelsResult.success) {
                setHostels(hostelsResult.data);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
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
            <div className="flex items-center justify-content-center h-100">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <IntroTour />
            <div className="container-fluid py-4">
                {/* Page Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold mb-1">Dashboard</h1>
                    <p className="text-muted">Welcome back! Here's what's happening with your hostels.</p>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate('/hostel/hostels')}
                >
                    <i className="fas fa-plus me-2"></i>
                    Add New Hostel
                </button>
            </div>

            {/* Stats Cards - Row 1 */}
            <div className="row g-4 mb-4">
                <div className="col-md-3 col-sm-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Total Hostels</p>
                                    <h2 className="h3 fw-bold mb-0">{stats?.totalHostels || 0}</h2>
                                </div>
                                <div className="bg-primary bg-opacity-10 rounded p-3">
                                    <i className="fas fa-building text-primary fs-4"></i>
                                </div>
                            </div>
                            <p className="text-muted small mt-2 mb-0">
                                <i className="fas fa-info-circle me-1"></i>
                                Active listings
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-3 col-sm-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Total Rooms</p>
                                    <h2 className="h3 fw-bold mb-0">{stats?.totalRooms || 0}</h2>
                                </div>
                                <div className="bg-success bg-opacity-10 rounded p-3">
                                    <i className="fas fa-bed text-success fs-4"></i>
                                </div>
                            </div>
                            <p className="text-success small mt-2 mb-0">
                                <i className="fas fa-check me-1"></i>
                                {stats?.availableRooms || 0} available
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-3 col-sm-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Occupancy Rate</p>
                                    <h2 className="h3 fw-bold mb-0">{stats?.occupancyRate || 0}%</h2>
                                </div>
                                <div className="bg-warning bg-opacity-10 rounded p-3">
                                    <i className="fas fa-chart-pie text-warning fs-4"></i>
                                </div>
                            </div>
                            <p className="text-muted small mt-2 mb-0">
                                {stats?.occupiedRooms || 0}/{stats?.totalRooms || 0} occupied
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-3 col-sm-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Pending Bookings</p>
                                    <h2 className="h3 fw-bold mb-0">{stats?.pendingBookings || 0}</h2>
                                </div>
                                <div className="bg-danger bg-opacity-10 rounded p-3">
                                    <i className="fas fa-clock text-danger fs-4"></i>
                                </div>
                            </div>
                            <p className="text-danger small mt-2 mb-0">
                                Requires action
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Stats Cards - Row 2 */}
            <div className="row g-4 mb-4">

                <div className="col-md-3 col-sm-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Total Interactions</p>
                                    <h2 className="h3 fw-bold mb-0">{stats?.totalInteractions || 0}</h2>
                                </div>
                                <div className="bg-purple bg-opacity-10 rounded p-3">
                                    <i className="fas fa-mouse-pointer text-purple fs-4"></i>
                                </div>
                            </div>
                            <p className="text-muted small mt-2 mb-0">
                                Calls + WhatsApp + Views
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-3 col-sm-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted small mb-1">Avg Rating</p>
                                    <h2 className="h3 fw-bold mb-0">
                                        {stats?.avgRating || 0}
                                        <i className="fas fa-star text-warning ms-2 fs-6"></i>
                                    </h2>
                                </div>
                                <div className="bg-warning bg-opacity-10 rounded p-3">
                                    <i className="fas fa-star text-warning fs-4"></i>
                                </div>
                            </div>
                            <p className="text-muted small mt-2 mb-0">
                                {stats?.totalReviews || 0} reviews
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Charts Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-8">
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle>Booking Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="chart-placeholder" style={{ height: '300px' }}>
                                <div className="d-flex align-items-center justify-content-center h-100">
                                    <div className="text-center">
                                        <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                                        <p className="text-muted">Chart visualization will appear here</p>
                                        <small className="text-muted">Using Recharts library</small>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-4">
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted">Total Bookings</span>
                                    <span className="fw-bold">{stats?.totalBookings || 0}</span>
                                </div>
                                <hr className="my-0" />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted">Approved</span>
                                    <Badge variant="success">{stats?.approvedBookings || 0}</Badge>
                                </div>
                                <hr className="my-0" />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted">Pending</span>
                                    <Badge variant="warning">{stats?.pendingBookings || 0}</Badge>
                                </div>
                                <hr className="my-0" />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted">Rejected</span>
                                    <Badge variant="danger">{stats?.rejectedBookings || 0}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Contact Information Card */}
            <Card className="mb-4">
                <CardHeader className="p-4">
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

            {/* Quick Actions */}
            <div className="row g-4 mt-2">
                <div className="col-md-4">
                    <div
                        className="card hover-shadow transition-shadow h-100"
                        onClick={() => navigate('/hostel/hostels')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded p-3 me-3">
                                    <i className="fas fa-home text-primary fa-2x"></i>
                                </div>
                                <div>
                                    <h5 className="mb-1">Manage Hostels</h5>
                                    <p className="text-muted small mb-0">View and edit your hostels</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div
                        className="card hover-shadow transition-shadow h-100"
                        onClick={() => navigate('/hostel/rooms')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                                    <i className="fas fa-bed text-success fa-2x"></i>
                                </div>
                                <div>
                                    <h5 className="mb-1">Manage Rooms</h5>
                                    <p className="text-muted small mb-0">Add and update room listings</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div
                        className="card hover-shadow transition-shadow h-100"
                        onClick={() => navigate('/hostel/verification')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-info bg-opacity-10 rounded p-3 me-3">
                                    <i className="fas fa-certificate text-info fa-2x"></i>
                                </div>
                                <div>
                                    <h5 className="mb-1">Verification</h5>
                                    <p className="text-muted small mb-0">Submit verification requests</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default Dashboard;
