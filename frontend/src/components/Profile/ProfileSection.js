// File: ProfileSection.jsx
import React from "react";
import { FaChevronRight } from "react-icons/fa";

const ProfileSection = ({ title, items }) => (
  // ----- Outer div: flex column to allow vertical stacking, flex-grow to stretch sections -----
  <div className="d-flex flex-column flex-grow-1 mt-4">
    
    {/* ----- Section Heading ----- */}
    {title && (
      <h5
        className="px-3 fw-bold mt-2 mb-3" // padding-left/right and vertical margins
        style={{ color: "#212529", fontSize: "1rem" }} // dark heading, slightly larger
      >
        {title}
      </h5>
    )}

    {/* ----- Section Items Loop ----- */}
    {items.map((item, index) => {
      const isLogout = item.isLogout === true; // check if item is Logout

      return (
        // ----- Each Item: flex row to align label and arrow, rounded corners -----
        <div
          key={index}
          className="d-flex justify-content-between align-items-center p-2 rounded-2"
          style={{
            cursor: "pointer", // shows it's clickable
            transition: "background-color 0.2s", // smooth hover effect
            marginTop: isLogout ? "1rem" : "0", // extra spacing above Logout
            backgroundColor: "transparent",
            borderBottom: isLogout ? "none" : "1px solid #dee2e6", // remove bottom line for logout
          }}
          // ----- Hover effect: light gray background on mouse enter/leave -----
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          onClick={item.onClick} // click handler
        >
          {/* ----- Item Label ----- */}
          <span
            className="fw-normal fs-6 fs-md-5" // responsive font sizes
            style={{
              color: isLogout ? "red" : "#212529", // red text for logout
              fontWeight: isLogout ? "600" : "400", // bold for logout
            }}
          >
            {item.label}
          </span>

          {/* ----- Right Arrow Icon ----- */}
          <FaChevronRight
            style={{ color: isLogout ? "red" : "#212529" }} // red for logout
          />
        </div>
      );
    })}
  </div>
);

export default ProfileSection;
