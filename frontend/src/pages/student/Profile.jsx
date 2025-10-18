import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import { userProfile, notifications } from '../../data/hostels';
import Avatar from 'boring-avatars';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(userProfile);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    city: user.city,
    gender: user.gender
  });

  const getUnreadNotifications = () =>
    notifications.filter((notification) => !notification.read).length;

  const userWithStats = {
    ...user,
    unreadNotifications: getUnreadNotifications(),
    notifications,
  };

  const handleChangePhoto = () => {
  const colorsSets = [
    ['#4F46E5', '#6366F1', '#A5B4FC', '#EEF2FF', '#312E81'],
    ['#EF4444', '#F87171', '#FECACA', '#FEF2F2', '#7F1D1D'],
    ['#10B981', '#6EE7B7', '#D1FAE5', '#ECFDF5', '#064E3B'],
    ['#F59E0B', '#FCD34D', '#FEF3C7', '#78350F', '#B45309']
  ];
  const variants = ['bauhaus', 'marble', 'beam', 'pixel'];
  const randomColors = colorsSets[Math.floor(Math.random() * colorsSets.length)];
  const randomVariant = variants[Math.floor(Math.random() * variants.length)];

  setUser(prev => ({
    ...prev,
    avatarColors: randomColors,
    avatarVariant: randomVariant
  }));
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser(prev => ({ ...prev, ...formData }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      city: user.city,
      gender: user.gender
    });
    setIsEditing(false);
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      {/* Sidebar */}
      <Sidebar
        user={userWithStats}
        collapsed={sidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-grow-1" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Top Header */}
        <TopHeader
          user={userWithStats}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <div className="container-fluid px-2 px-md-4 py-4">
          {/* Page Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
            <div>
              <h2 className="fw-bold mb-2">My Profile</h2>
              <p className="text-muted mb-0">Manage your personal information and account settings</p>
            </div>
            {!isEditing && (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <i className="fas fa-edit me-2"></i>Edit Profile
              </button>
            )}
          </div>

          <div className="row g-4">
            {/* Profile Sidebar */}
            <div className="col-12 col-lg-3">
              <div className="card mb-4 text-center">
                <div className="card-body">
                   <Avatar
                      className="rounded-circle mb-3"
                      size={100}
                      height={100}
                      name={`${user.firstName} ${user.lastName}`}
                      variant={user.avatarVariant || 'bauhaus'}
                      colors={['#4F46E5', '#6366F1', '#A5B4FC', '#EEF2FF', '#312E81']}
                    />
                  <h5 className="fw-bold mb-1">{user.username}</h5>
                  <p className="text-muted mb-3">{user.email}</p>
                  <button className="btn btn-outline-primary btn-sm w-100" onClick={handleChangePhoto}>
                    <i className="fas fa-camera me-2"></i>Change Photo
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="card">
                <div className="list-group list-group-flush">
                  {['personal', 'security','preferences'].map(tab => (
                    <button
                      key={tab}
                      className={`list-group-item list-group-item-action ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      <i className={`fas fa-${{
                        personal: 'user',
                        security: 'lock',
                        preferences: 'cog'
                      }[tab]} me-2`}></i>
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="col-12 col-lg-9">
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">Personal Information</h6>
                    {isEditing && (
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={handleSave}>
                          <i className="fas fa-check me-1"></i>Save
                        </button>
                        <button className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>
                          <i className="fas fa-times me-1"></i>Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      {[
                        { label: 'First Name', name: 'first_name' },
                        { label: 'Last Name', name: 'last_name' },
                        { label: 'Username', name: 'username' },
                        { label: 'Email Address', name: 'email', type: 'email' },
                        { label: 'Phone Number', name: 'phone', type: 'tel' },
                        { label: 'City', name: 'city' },
                        { label: 'Role', name: 'role', type: 'select', options: ['Student','Owner'] },
                        { label: 'Gender', name: 'gender', type: 'select', options: ['Male','Female','Other'] }
                      ].map(field => (
                        <div key={field.name} className="col-md-6">
                          <label className="form-label fw-medium">{field.label}</label>
                          {field.type === 'select' ? (
                            <select
                              className="form-select"
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            >
                              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : (
                            <input
                              type={field.type || 'text'}
                              className="form-control"
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="card mb-4">
                  <div className="card-header">
                    <h6 className="mb-0 fw-bold">Security Settings</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      {/* Change Password */}
                      <div className="col-md-4 d-flex flex-column justify-content-between">
                        <div className="mb-2">
                          <h6 className="fw-bold mb-1">Password</h6>
                          <p className="text-muted mb-0">Last changed 3 months ago</p>
                        </div>
                        <button 
                          className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center" 
                          style={{ height: '60px' }}
                          onClick={() => navigate('/forgot-password')} // Redirect to Forgot Password page
                        >
                          <i className="fas fa-key me-2"></i>Change Password
                        </button>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="col-md-4 d-flex flex-column justify-content-between">
                        <div className="mb-2">
                          <h6 className="fw-bold mb-1">Two-Factor Authentication</h6>
                          <p className="text-muted mb-0">Add an extra layer of security</p>
                        </div>
                        <button 
                          className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center" 
                          style={{ height: '60px' }}
                          onClick={() => alert('2FA Enabled!')}
                        >
                          <i className="fas fa-shield-alt me-2"></i>Enable 2FA
                        </button>
                      </div>

                      {/* Log Out of Other Devices */}
                      <div className="col-md-4 d-flex flex-column justify-content-between">
                        <div className="mb-2">
                          <h6 className="fw-bold mb-1">Other Devices</h6>
                          <p className="text-muted mb-0">Sign out from all other devices</p>
                        </div>
                        <button 
                          className="btn btn-danger w-100 d-flex align-items-center justify-content-center" 
                          style={{ height: '60px' }}
                          onClick={() => alert('Logged out from other devices!')}
                        >
                          <i className="fas fa-sign-out-alt me-2"></i>Log Out of Other Devices
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="card mb-4">
                  <div className="card-header"><h6 className="mb-0 fw-bold">Preferences</h6></div>
                  <div className="card-body">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-2">Email Notifications</h6>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="marketingEmails" />
                          <label className="form-check-label" htmlFor="marketingEmails">Marketing emails</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-2">Privacy Settings</h6>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="profileVisibility" defaultChecked />
                          <label className="form-check-label" htmlFor="profileVisibility">Make profile visible to hostel owners</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="reviewVisibility" defaultChecked />
                          <label className="form-check-label" htmlFor="reviewVisibility">Show reviews on my profile</label>
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-primary mt-3">
                      <i className="fas fa-save me-2"></i>Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
