import React from "react";
import { FaHome, FaStar, FaUser, FaCog } from "react-icons/fa";

const ProfileFooterNav = ({ active}) => (
  <div
    className="d-flex justify-content-around align-items-center bg-white border-top"
    style={{ position: "fixed", bottom: 0, left: 0,
     width: "100%", zIndex: 1000, padding: "0.25rem 0" }}
  >
    {/* Home */}
    <div className="text-center" style={{ cursor: "pointer" }}>
      <FaHome size={18} style={{color: active === "home" ? "var(--primary)" : "#212529"}}/>
      <div className="small mt-0"  style={{color: active === "home" ? "var(--primary)" : "#212529"}}>Home</div>
    </div>

    {/* Favorites */}
    <div className="text-center" style={{ cursor: "pointer" }}>
      <FaStar size={18} style={{color: active === "favorites" ? "var(--primary)" : "#212529"}}/>
      <div className="small mt-0" style={{color: active === "favorites" ? "var(--primary)" : "#212529"}}>Favorites</div>
    </div>

    {/* Profile (current page highlighted) */}
    <div className="text-center" style={{ cursor: "pointer", color: "-var(--primary)" }}>
      <FaUser size={18} style={{color: active === "profile" ? "var(--primary)" : "#212529"}}/>
      <div className="small mt-0 fw-bold" style={{color: active === "profile" ? "var(--primary)" : "#212529"}}>Profile</div>
    </div>

    {/* Settings / Extra */}
    <div className="text-center" style={{ cursor: "pointer" }}>
      <FaCog size={18} style={{color: active === "settings" ? "var(--primary)" : "#212529"}}/>
      <div className="small mt-0" style={{color: active === "settings" ? "var(--primary)" : "#212529"}}>Settings</div>
    </div>
  </div>
);

export default ProfileFooterNav;
