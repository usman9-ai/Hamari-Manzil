import React, { useState } from "react";
import { Link } from "react-router-dom";

// Forgot Password Page Component
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Email validation
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isValidEmail(email)) {
      setSubmitted(true);
      // Handle password reset logic here
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4 w-100" style={{ maxWidth: 400 }}>
        {/* Header */}
        <h2 className="mb-3 text-center">Forgot Password</h2>
        {submitted ? (
          <div className="alert alert-success">
            If this email exists, a reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className={`form-control ${touched && !isValidEmail(email) ? "is-invalid" : ""}`}
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                required
              />
              <div className="invalid-feedback">
                Please enter a valid email address.
              </div>
            </div>
            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100 mb-2">
              Submit
            </button>
            {/* Link to Signin */}
            <div className="text-center">
              <Link to="/signin" className="small">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;