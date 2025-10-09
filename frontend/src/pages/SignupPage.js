import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupHeader from '../components/Signup/SignupHeader';
import SignupForm from '../components/Signup/SignupForm';
import SignupFooter from '../components/Signup/SignupFooter';

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    navigate('/dashboard');
  };

  const handleSignupSubmit = (data) => {
    setLoading(true);

    // SignupForm handles the API call
    setTimeout(() => {
      setLoading(false);
      if (data.token) {
        handleSignupSuccess(data);
      }
    }, 1000);
  };

  return (
    <div className="signup-page min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow border-0">
              <div className="card-body p-4 p-md-5">
                <SignupHeader />
                <SignupForm onSubmit={handleSignupSubmit} loading={loading} />
                <SignupFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;