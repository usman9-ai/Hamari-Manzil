import React, { useState } from 'react';
import LoginHeader from '../components/Login/LoginHeader';
import LoginForm from '../components/Login/LoginForm';
import LoginFooter from '../components/Login/LoginFooter';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/dashboard';
  };

  const handleLoginSubmit = (data) => {
    setLoading(true);
    
    // LoginForm handles the API call
    setTimeout(() => {
      setLoading(false);
      if (data.token) {
        handleLoginSuccess(data);
      }
    }, 1000);
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