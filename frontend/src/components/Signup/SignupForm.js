import React, { useState } from "react";

const SignupForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
    gender: "",
    role: "",
    phone: "",
    city: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Password match check
    if (formData.password !== formData.password2) {
      setErrors({ password2: "Passwords do not match" });
      return;
    }

    // ✅ Clear previous errors
    setErrors({});

    // ✅ Call parent onSubmit
    onSubmit(formData, setErrors);
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      {/* General error */}
      {errors.general && (
        <div className="alert alert-danger" role="alert">
          {errors.general}
        </div>
      )}

      {/* First & Last Name */}
      <div className="row">
        <div className="col-6 mb-3">
          <label htmlFor="first_name" className="form-label fw-medium">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
            placeholder="First name"
            required
          />
          {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
        </div>

        <div className="col-6 mb-3">
          <label htmlFor="last_name" className="form-label fw-medium">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
            placeholder="Last name"
            required
          />
          {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
        </div>
      </div>

      {/* Username & Phone */}
      <div className="row">
        <div className="col-6 mb-3">
          <label htmlFor="username" className="form-label fw-medium">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            placeholder="Username"
            required
          />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>

        <div className="col-6 mb-3">
          <label htmlFor="phone" className="form-label fw-medium">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            placeholder="Enter your number"
            required
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>
      </div>

      {/* Email */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-medium">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          placeholder="Enter your email"
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      {/* City & Gender */}
      <div className="row">
        <div className="col-6 mb-3">
          <label htmlFor="city" className="form-label fw-medium">City</label>
          <input
            list="cityOptions"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`form-control ${errors.city ? "is-invalid" : ""}`}
            placeholder="Select your city"
            required
          />
          <datalist id="cityOptions">
            <option value="Karachi" />
            <option value="Lahore" />
            <option value="Islamabad" />
            <option value="Faisalabad" />
            <option value="Multan" />
          </datalist>
          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
        </div>

        <div className="col-6 mb-3">
          <label htmlFor="gender" className="form-label fw-medium">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`form-control ${errors.gender ? "is-invalid" : ""}`}
            required
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
        </div>
      </div>

      {/* Role */}
      <div className="col-6 mb-3">
        <label className="form-label fw-medium">Role</label>
        <div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              name="role"
              id="student"
              value="student"
              checked={formData.role === "student"}
              onChange={handleChange}
              className="form-check-input"
              required
            />
            <label className="form-check-label" htmlFor="student">Student</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              name="role"
              id="owner"
              value="owner"
              checked={formData.role === "owner"}
              onChange={handleChange}
              className="form-check-input"
            />
            <label className="form-check-label" htmlFor="owner">Owner</label>
          </div>
        </div>
        {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
      </div>

      {/* Password & Confirm */}
      <div className="mb-3">
        <label htmlFor="password" className="form-label fw-medium">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          placeholder="Create a password"
          required
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="password2" className="form-label fw-medium">Confirm Password</label>
        <input
          type="password"
          id="password2"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
          className={`form-control ${errors.password2 ? "is-invalid" : ""}`}
          placeholder="Confirm your password"
          required
        />
        {errors.password2 && <div className="invalid-feedback">{errors.password2}</div>}
      </div>

      {/* Terms */}
      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="terms" required />
        <label className="form-check-label" htmlFor="terms">
          I agree to the <a href="/terms" className="text-primary">Terms of Service</a> and{" "}
          <a href="/privacy" className="text-primary">Privacy Policy</a>
        </label>
      </div>

      <button type="submit" className="btn btn-primary w-100 py-2 fw-medium" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default SignupForm;
