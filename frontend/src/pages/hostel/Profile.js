import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { fetchUserProfile, updateProfile, uploadProfilePicture } from '../../services/userServices';
import ChangePasswordModal from '../../components/Profile/ChangePasswordModal';

const Profile = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone: '',
        city: '',
        gender: '',
        role: '',
        profile_picture_url: null,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profile = await fetchUserProfile();
            setFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                username: profile.username || '',
                email: profile.email || '',
                phone: profile.phone || '',
                city: profile.city || '',
                gender: profile.gender || '',
                role: profile.role || '',
                profile_picture_url: profile.profile_picture_url || null,
                date_joined: profile.date_joined,
                verification_status: profile.verification_status,
            });
        } catch (error) {
            console.error('Failed to load profile:', error);
            setMessage('Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear field error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setErrors({});

        try {
            await updateProfile({
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                city: formData.city,
                gender: formData.gender,
            });
            setMessage('Profile updated successfully! ✅');
        } catch (error) {
            console.error('Failed to update profile:', error);
            if (error.response?.data) {
                const backendErrors = error.response.data;
                setErrors(backendErrors);
                setMessage('Failed to update profile. Please check the errors below.');
            } else {
                setMessage('Failed to update profile. Please try again.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage('File size must be less than 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage('Please upload an image file');
            return;
        }

        setUploadingPicture(true);
        setMessage('');

        try {
            const updated = await uploadProfilePicture(file);
            setFormData(prev => ({
                ...prev,
                profile_picture_url: updated.profile_picture_url
            }));
            setMessage('Profile picture updated successfully! ✅');
        } catch (error) {
            console.error('Failed to upload picture:', error);
            setMessage('Failed to upload profile picture. Please try again.');
        } finally {
            setUploadingPicture(false);
        }
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Page Header */}
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 fw-bold mb-1">Profile Settings</h1>
                    <p className="text-muted">Manage your personal information</p>
                </div>
                <button 
                    className="btn btn-outline-primary"
                    onClick={() => setShowPasswordModal(true)}
                >
                    <i className="fas fa-key me-2"></i>
                    Change Password
                </button>
            </div>

            {/* Change Password Modal */}
            <ChangePasswordModal
                show={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSuccess={() => {
                    setMessage('Password changed successfully! ✅');
                    setTimeout(() => setMessage(''), 5000);
                }}
            />

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
                                            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            Last Name
                                            <span className="text-danger ms-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={formData.username}
                                            disabled
                                        />
                                        <small className="text-muted">Username cannot be changed</small>
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

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            Phone Number
                                            <span className="text-danger ms-1">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+923001234567"
                                            required
                                        />
                                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            City
                                            <span className="text-danger ms-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Gender</label>
                                        <select
                                            className="form-control"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            disabled
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <small className="text-muted">Gender cannot be changed</small>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Role</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.role === 'owner' ? 'Hostel Owner' : 'Student'}
                                            disabled
                                        />
                                        <small className="text-muted">Role cannot be changed</small>
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
                            {formData.profile_picture_url ? (
                                <img
                                    src={formData.profile_picture_url}
                                    alt="Profile"
                                    className="rounded-circle mb-3"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                />
                            ) : (
                                <div
                                    className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{ width: '120px', height: '120px' }}
                                >
                                    <i className="fas fa-user text-white" style={{ fontSize: '48px' }}></i>
                                </div>
                            )}
                            <p className="text-muted small mb-3">Upload a profile picture (max 5MB)</p>
                            <input
                                type="file"
                                id="profile-picture-input"
                                className="d-none"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => document.getElementById('profile-picture-input').click()}
                                disabled={uploadingPicture}
                            >
                                {uploadingPicture ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-camera me-2"></i>
                                        Change Picture
                                    </>
                                )}
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
                                    <strong>{formData.role === 'owner' ? 'Hostel Owner' : 'Student'}</strong>
                                </div>
                                <hr className="my-0" />
                                <div>
                                    <small className="text-muted d-block">Member Since</small>
                                    <strong>{formData.date_joined ? new Date(formData.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}</strong>
                                </div>
                                <hr className="my-0" />
                                <div>
                                    <small className="text-muted d-block">Verification Status</small>
                                    <span className={`badge ${formData.verification_status ? 'bg-success' : 'bg-warning'}`}>
                                        {formData.verification_status ? 'Verified' : 'Pending'}
                                    </span>
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

