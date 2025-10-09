import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const Profile = () => {
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'owner@example.com',
        phone: '+92 300 1234567',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage('Profile updated successfully! ✅');

            // Update localStorage with new data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.firstName = formData.firstName;
            user.lastName = formData.lastName;
            user.phone = formData.phone;
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            setMessage('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            {/* Page Header */}
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Profile Settings</h1>
                <p className="text-muted">Manage your personal information</p>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {message && (
                                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} mb-4`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            First Name
                                            <span className="text-danger ms-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            Last Name
                                            <span className="text-danger ms-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                        />
                                        <small className="text-muted">Email cannot be changed</small>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">
                                            Phone Number
                                            <span className="text-danger ms-1">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+92 300 1234567"
                                            required
                                        />
                                    </div>

                                    <div className="col-12 mt-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => window.history.back()}
                                            >
                                                <i className="fas fa-times me-2"></i>
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={saving}
                                            >
                                                {saving ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-save me-2"></i>
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-lg-4">
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 text-center">
                            <div
                                className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style={{ width: '120px', height: '120px' }}
                            >
                                <i className="fas fa-user text-white" style={{ fontSize: '48px' }}></i>
                            </div>
                            <p className="text-muted small mb-3">Upload a profile picture</p>
                            <button type="button" className="btn btn-sm btn-outline-primary">
                                <i className="fas fa-camera me-2"></i>
                                Change Picture
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="mt-4">
                        <CardHeader className="p-4">
                            <CardTitle>Account Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="d-flex flex-column gap-3">
                                <div>
                                    <small className="text-muted d-block">Account Type</small>
                                    <strong>Hostel Owner</strong>
                                </div>
                                <hr className="my-0" />
                                <div>
                                    <small className="text-muted d-block">Member Since</small>
                                    <strong>January 2024</strong>
                                </div>
                                <hr className="my-0" />
                                <div>
                                    <small className="text-muted d-block">Account Status</small>
                                    <span className="badge bg-success">Active</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;

