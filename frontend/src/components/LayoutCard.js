import React from "react";

const LayoutCard = ({ children }) => {
  return (
    <div className="container d-flex justify-content-center">
      <div className="card w-100 shadow-sm"
        style={{
          maxWidth: "900px",
          borderRadius: "16px",
          padding: "24px",
          backgroundColor: "#fff"
        }}>
        {children}
      </div>
    </div>
  );
};

export default LayoutCard;