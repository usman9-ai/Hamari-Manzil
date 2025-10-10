import React from "react";
import ProfileSection from "../components/Profile/ProfileSection";
import ProfileFooterNav from "../components/Profile/ProfileFooterNav";

const ProfilePage = () => {
  const handleClick = (label) => alert(`Clicked ${label}`);

  return (
    <div className="bg-light" style={{ minHeight: "100vh", position: "relative" }}>
    
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="bg-primary text-white text-center py-4 px-3">
        <h3 className="mb-1 fw-bold fs-5 fs-md-4">Profile</h3>
        <p className="small mb-0 fs-6 fs-md-5">Manage your account & settings</p>
      </div>
      
      {/* ----- Sections container centered ----- */}
      <div className="d-flex flex-column align-items-center flex-grow-1 justify-content-between py-2">
        <div style={{ maxWidth: "600px", width: "100%", flexGrow: 1 }}>

          {/* Account Section */}
          <ProfileSection
            title="Account"
            items={[
              { label: "Personal Information", onClick: () => handleClick("Personal Information") },
              { label: "Notifications", onClick: () => handleClick("Notifications") },
              { label: "Privacy", onClick: () => handleClick("Privacy") },
            ]}
          />

          {/* Support Section */}
          <ProfileSection
            title="Support"
            items={[
              { label: "Help Center", onClick: () => handleClick("Help Center") },
              { label: "Contact Us", onClick: () => handleClick("Contact Us") },
              { label: "Terms of Service", onClick: () => handleClick("Terms of Service") },
            ]}
          />

          {/* Logout Section */}
          <ProfileSection
            title=""
            items={[{ label: "Logout", onClick: () => handleClick("Logout"), isLogout: true }]}
          />

        </div>
      </div>

      {/* ----- Footer Navigation ----- */}
      <ProfileFooterNav active="profile"/>
    </div>
    </div>
  );
};

export default ProfilePage;
