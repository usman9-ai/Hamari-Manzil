import React from 'react';

const ManageHostels = () => {
    return (
        <div className="manage-hostels-page">
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Manage Hostels</h1>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus me-2"></i>
                        Add New Hostel
                    </button>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="text-center py-5">
                            <i className="fas fa-building fa-3x text-muted mb-3"></i>
                            <h3>No Hostels Yet</h3>
                            <p className="text-muted">You haven't added any hostels yet. Click the button above to add your first hostel.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageHostels;
