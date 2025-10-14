import React from 'react';

const Bookings = () => {
    return (
        <div className="bookings-page">
            <div className="container py-5">
                <h1 className="mb-4">My Bookings</h1>
                <div className="card">
                    <div className="card-body">
                        <div className="text-center py-5">
                            <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                            <h3>No Bookings Yet</h3>
                            <p className="text-muted">Your booking history will appear here once you've made inquiries or booked a hostel.</p>
                            <a href="/" className="btn btn-primary mt-3">Browse Hostels</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
