import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupHeader from "../components/Signup/SignupHeader";
import SignupForm from "../components/Signup/SignupForm";
import SignupFooter from "../components/Signup/SignupFooter";
import { handleRegister } from "../services/userServices";

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSignupSubmit = async (formData, setFormErrors) => {
    setLoading(true);
    setSuccessMessage("");
    
    try {
      const response = await handleRegister(formData);

      // Backend returns success with verification email message
      if (response && response.status === "success") {
        setSuccessMessage(response.message || "Registration successful! Please check your email to verify your account.");
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setFormErrors({ general: "Unexpected response from server. Please try again." });
      }
    } catch (error) {
      console.error("Signup failed:", error);

      if (error.response?.data) {
        const backendData = error.response.data;
        const newErrors = {};

        // Check if backend returned errors object
        if (backendData.errors && typeof backendData.errors === 'object') {
          Object.keys(backendData.errors).forEach((key) => {
            const errorValue = backendData.errors[key];
            newErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
          });
        } 
        // Check if backend returned field errors directly
        else {
          Object.keys(backendData).forEach((key) => {
            if (key !== 'status' && key !== 'message') {
              const errorValue = backendData[key];
              newErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
            }
          });
        }

        // Add general message if exists
        if (backendData.message) {
          newErrors.general = backendData.message;
        }

        // If no specific errors were found, show a general error
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = "Registration failed. Please check your inputs.";
        }

        setFormErrors(newErrors);
      } else {
        setFormErrors({ general: error.message || "Network error. Please check your connection." });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="signup-page min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow border-0">
              <div className="card-body p-4 p-md-5">
                <SignupHeader />
                
                {/* Success Message */}
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                    <div className="mt-2 small">
                      Redirecting to login page...
                    </div>
                  </div>
                )}
                
                {!successMessage && (
                  <>
                    <SignupForm onSubmit={handleSignupSubmit} loading={loading} />
                    <SignupFooter />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
