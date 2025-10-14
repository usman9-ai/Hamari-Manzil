import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../components/Login/LoginHeader';
import LoginForm from '../components/Login/LoginForm';
import LoginFooter from '../components/Login/LoginFooter';
import { handleLogin } from '../services/userServices';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (formData, setFormErrors) => {
    setLoading(true);
    
    try {
      const response = await handleLogin(formData);
      
      // Login successful - tokens are already stored in handleLogin
      if (response.user) {
        // Redirect based on user role
        const { role } = response.user;
        if (role === 'student') {
          navigate('/student/dashboard');
        } else if (role === 'owner') {
          navigate('/hostel/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.response?.data) {
        const backendData = error.response.data;
        const newErrors = {};
        
        // Handle different error formats
        if (typeof backendData.detail === 'string') {
          newErrors.general = backendData.detail;
        } else if (backendData.non_field_errors) {
          newErrors.general = Array.isArray(backendData.non_field_errors) 
            ? backendData.non_field_errors[0] 
            : backendData.non_field_errors;
        } else {
          // Handle field-specific errors
          Object.keys(backendData).forEach((key) => {
            const errorValue = backendData[key];
            newErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
          });
        }
        
        // If no specific errors, show general message
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = 'Login failed. Please check your credentials.';
        }
        
        setFormErrors(newErrors);
      } else {
        setFormErrors({ 
          general: error.message || 'Network error. Please check your connection.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-body p-4 p-md-5">
                <LoginHeader />
                <LoginForm onSubmit={handleLoginSubmit} loading={loading} />
                <LoginFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;