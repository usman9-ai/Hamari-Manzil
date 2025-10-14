import React from 'react';

const StudentDashboard = () => {
    return (
        <div className="student-dashboard">
            <div className="container py-5">
                <h1 className="mb-4">Student Dashboard</h1>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">Welcome to Hamari Manzil</h5>
                                <p className="card-text">Your student dashboard is being set up. Soon you'll be able to:</p>
                                <ul>
                                    <li>View your favorite hostels</li>
                                    <li>Track your hostel inquiries</li>
                                    <li>Manage your profile</li>
                                    <li>Submit reviews for hostels</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Quick Actions</h5>
                                <div className="list-group">
                                    <a href="/" className="list-group-item list-group-item-action">Browse Hostels</a>
                                    <a href="/student/bookings" className="list-group-item list-group-item-action">My Bookings</a>
                                    <a href="/profile" className="list-group-item list-group-item-action">Edit Profile</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
