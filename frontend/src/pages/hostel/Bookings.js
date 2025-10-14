import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus } from '../../actions/hostelActions';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        const result = await getBookings();
        if (result.success) {
            setBookings(result.data);
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (id, status) => {
        const result = await updateBookingStatus(id, status);
        if (result.success) {
            alert(result.message);
            loadBookings();
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

    const filteredBookings = bookings.filter(booking => {
        const matchesTab = activeTab === 'all' || booking.status === activeTab;
        const matchesSearch = booking.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.hostelName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const stats = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        approved: bookings.filter(b => b.status === 'approved').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-3">Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Page Header */}
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Manage Bookings</h1>
                <p className="text-muted">Review and manage booking requests from students</p>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small opacity-75">Total Bookings</div>
                                    <div className="h3 fw-bold mb-0">{stats.all}</div>
                                </div>
                                <i className="fas fa-clipboard-list fa-2x opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small opacity-75">Pending</div>
                                    <div className="h3 fw-bold mb-0">{stats.pending}</div>
                                </div>
                                <i className="fas fa-clock fa-2x opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small opacity-75">Approved</div>
                                    <div className="h3 fw-bold mb-0">{stats.approved}</div>
                                </div>
                                <i className="fas fa-check-circle fa-2x opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-danger text-white">
                        <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small opacity-75">Rejected</div>
                                    <div className="h3 fw-bold mb-0">{stats.rejected}</div>
                                </div>
                                <i className="fas fa-times-circle fa-2x opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs and Search */}
            <Card className="mb-4">
                <CardContent className="p-4">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-8">
                            <ul className="nav nav-pills">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('all')}
                                    >
                                        All ({stats.all})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('pending')}
                                    >
                                        Pending ({stats.pending})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'approved' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('approved')}
                                    >
                                        Approved ({stats.approved})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'rejected' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('rejected')}
                                    >
                                        Rejected ({stats.rejected})
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search bookings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
                <Card>
                    <CardContent className="p-5">
                        <div className="text-center">
                            <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                            <h4>No bookings found</h4>
                            <p className="text-muted">
                                {searchTerm ? 'Try adjusting your search' : 'No bookings in this category'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="row g-4">
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className="col-lg-6">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 className="mb-1 fw-bold">{booking.studentName}</h5>
                                            <div className="text-muted small">
                                                <i className="fas fa-envelope me-1"></i>
                                                {booking.email}
                                            </div>
                                            <div className="text-muted small">
                                                <i className="fas fa-phone me-1"></i>
                                                {booking.phone}
                                            </div>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>

                                    <div className="bg-light rounded p-3 mb-3">
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <small className="text-muted d-block">Hostel</small>
                                                <span className="fw-semibold">{booking.hostelName}</span>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted d-block">Room</small>
                                                <Badge variant="info">{booking.roomNumber}</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <small className="text-muted d-block">Move-in Date</small>
                                            <span className="fw-semibold">
                                                {new Date(booking.moveInDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block">Duration</small>
                                            <span className="fw-semibold">{booking.duration}</span>
                                        </div>
                                    </div>

                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <small className="text-muted d-block">Monthly Rent</small>
                                            <span className="fw-bold text-primary">
                                                PKR {booking.rent.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block">Security Deposit</small>
                                            <span className="fw-semibold">
                                                PKR {booking.deposit.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {booking.notes && (
                                        <div className="alert alert-info mb-3 py-2">
                                            <small className="fw-semibold d-block mb-1">Notes:</small>
                                            <small>{booking.notes}</small>
                                        </div>
                                    )}

                                    <div className="d-flex gap-2">
                                        {booking.status === 'pending' ? (
                                            <>
                                                <button
                                                    className="btn btn-success btn-sm flex-grow-1"
                                                    onClick={() => handleStatusUpdate(booking.id, 'approved')}
                                                >
                                                    <i className="fas fa-check me-1"></i>
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm flex-grow-1"
                                                    onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                                >
                                                    <i className="fas fa-times me-1"></i>
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <button className="btn btn-outline-primary btn-sm w-100">
                                                <i className="fas fa-eye me-1"></i>
                                                View Details
                                            </button>
                                        )}
                                    </div>

                                    <div className="text-muted small mt-2">
                                        <i className="fas fa-calendar me-1"></i>
                                        Requested on {new Date(booking.bookingDate).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;
