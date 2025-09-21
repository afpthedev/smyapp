import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        // Başarılı giriş
        navigate('/admin/dashboard');
      } else {
        // Hata durumu
        setError(result.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Bağlantı hatası. Lütfen daha sonra tekrar deneyiniz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">InkFlow</span>
          </div>
        </div>
        
        <div className="login-form-container">
          <div className="welcome-section">
            <h1>Welcome back</h1>
            <p>Sign in to manage your studio</p>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
                disabled={isLoading}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                disabled={isLoading}
                className="form-input"
              />
            </div>
            
            <div className="forgot-password">
              <a href="#" className="forgot-link">Forgot your password?</a>
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          
          <div className="signup-section">
            <span>Don't have an account? </span>
            <a href="#" className="signup-link">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;