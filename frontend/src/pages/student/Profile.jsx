import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import { userProfile } from '../../data/hostels';

const Profile = () => {
  const [user, setUser] = useState(userProfile);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    city: user.city,
    gender: user.gender
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      ...formData
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      city: user.city,
      gender: user.gender
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // In a real app, this would open a change password modal
    console.log('Change password clicked');
  };

  return (
    <div className="profile-page d-flex">
      <Sidebar user={user} />
      
      <div className="main-content flex-grow-1">
        <TopHeader user={user} onToggleSidebar={() => setMobileSidebarOpen(true)} />
        
        <div className="content p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-2">My Profile</h2>
              <p className="text-muted mb-0">Manage your personal information and account settings</p>
            </div>
            {!isEditing && (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <i className="fas fa-edit me-2"></i>
                Edit Profile
              </button>
            )}
          </div>

          <div className="row">
            {/* Profile Sidebar */}
            <div className="col-lg-3 mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="rounded-circle mb-3"
                    width="100"
                    height="100"
                  />
                  <h5 className="fw-bold mb-1">{user.firstName} {user.lastName}</h5>
                  <p className="text-muted mb-3">{user.email}</p>
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-camera me-2"></i>
                      Change Photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="card mt-3">
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    <button
                      className={`list-group-item list-group-item-action ${activeTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal')}
                    >
                      <i className="fas fa-user me-2"></i>
                      Personal Info
                    </button>
                    <button
                      className={`list-group-item list-group-item-action ${activeTab === 'security' ? 'active' : ''}`}
                      onClick={() => setActiveTab('security')}
                    >
                      <i className="fas fa-lock me-2"></i>
                      Security
                    </button>
                    <button
                      className={`list-group-item list-group-item-action ${activeTab === 'payments' ? 'active' : ''}`}
                      onClick={() => setActiveTab('payments')}
                    >
                      <i className="fas fa-credit-card me-2"></i>
                      Payment Methods
                    </button>
                    <button
                      className={`list-group-item list-group-item-action ${activeTab === 'preferences' ? 'active' : ''}`}
                      onClick={() => setActiveTab('preferences')}
                    >
                      <i className="fas fa-cog me-2"></i>
                      Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="col-lg-9">
              {/* Personal Information */}
              {activeTab === 'personal' && (
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">Personal Information</h6>
                    {isEditing && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={handleSave}
                        >
                          <i className="fas fa-check me-1"></i>
                          Save
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleCancel}
                        >
                          <i className="fas fa-times me-1"></i>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">City</label>
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Gender</label>
                          <select
                            className="form-select"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0 fw-bold">Security Settings</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-2">Password</h6>
                        <p className="text-muted mb-3">Last changed 3 months ago</p>
                        <button
                          className="btn btn-outline-primary"
                          onClick={handleChangePassword}
                        >
                          <i className="fas fa-key me-2"></i>
                          Change Password
                        </button>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-2">Two-Factor Authentication</h6>
                        <p className="text-muted mb-3">Add an extra layer of security to your account</p>
                        <button className="btn btn-outline-success">
                          <i className="fas fa-shield-alt me-2"></i>
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0 fw-bold">Preferences</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <h6 className="fw-bold mb-2">Email Notifications</h6>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="bookingConfirmations"
                            defaultChecked
                          />
                          <label className="form-check-label" htmlFor="bookingConfirmations">
                            Booking confirmations
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="paymentReminders"
                            defaultChecked
                          />
                          <label className="form-check-label" htmlFor="paymentReminders">
                            Payment reminders
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="marketingEmails"
                          />
                          <label className="form-check-label" htmlFor="marketingEmails">
                            Marketing emails
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h6 className="fw-bold mb-2">Privacy Settings</h6>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="profileVisibility"
                            defaultChecked
                          />
                          <label className="form-check-label" htmlFor="profileVisibility">
                            Make profile visible to hostel owners
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="reviewVisibility"
                            defaultChecked
                          />
                          <label className="form-check-label" htmlFor="reviewVisibility">
                            Show reviews on my profile
                          </label>
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-primary">
                      <i className="fas fa-save me-2"></i>
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
