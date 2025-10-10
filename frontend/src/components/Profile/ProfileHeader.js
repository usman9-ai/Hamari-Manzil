import React from "react";
import { FaUserEdit } from "react-icons/fa";

const ProfileHeader = ({ name, joinDate, avatar }) => (
  <div className="position-relative text-white text-center" 
  style={{
      background: "linear-gradient(135deg, #6B21A8, #9333EA)", // gradient instead of plain bg-primary
      paddingBottom: "50px", // extra padding to make space below avatar
      borderBottomLeftRadius: "20px", // curved bottom edges
      borderBottomRightRadius: "20px",
    }}
    >

    <div className="position-relative d-inline-block mt-4">
      <img
        src={avatar}
        alt="User Avatar"
        className="rounded-circle"
        style={{ 
          width: "120px", height: "120px", objectFit: "cover",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          border: "3px solid #fff", 
        }}
      />

      <FaUserEdit
        className="position-absolute"
        style={{
          bottom: 0,
          right: 0,
          cursor: "pointer",
          backgroundColor: "#fff", // white circle background
          borderRadius: "50%",
          padding: "6px",
          color: "#0d8abc",
          transition: "transform 0.2s", // smooth hover animation
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")} // hover scale
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    </div>

    <h3 className="mt-3 fw-bold">{name}</h3>
    <p className="small mb-1">Joined {joinDate}</p>
  </div>
);

export default ProfileHeader;
