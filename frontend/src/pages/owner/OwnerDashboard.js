import React from 'react';

const OwnerDashboard = () => {
    return (
        <div className="owner-dashboard">
            <div className="container py-5">
                <h1 className="mb-4">Hostel Owner Dashboard</h1>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">Welcome to Hamari Manzil</h5>
                                <p className="card-text">Your hostel owner dashboard is being set up. Soon you'll be able to:</p>
                                <ul>
                                    <li>Manage your hostel listings</li>
                                    <li>Track student inquiries</li>
                                    <li>Update room availability</li>
                                    <li>View analytics on your listings</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Quick Actions</h5>
                                <div className="list-group">
                                    <a href="/owner/hostels" className="list-group-item list-group-item-action">Manage Hostels</a>
                                    <a href="/profile" className="list-group-item list-group-item-action">Edit Profile</a>
                                    <a href="/settings" className="list-group-item list-group-item-action">Account Settings</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
