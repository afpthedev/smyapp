import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import authService from './services/authService';
import './styles.css';

// Protected Route bileşeni
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/api/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ana sayfa - login'e yönlendir */}
          <Route path="/" element={<Navigate to="/api/admin/login" replace />} />
          
          {/* Login sayfası */}
          <Route path="/api/admin/login" element={<Login />} />
          
          {/* Register sayfası */}
          <Route path="/api/admin/register" element={<Register />} />
          
          {/* Dashboard - korumalı route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Diğer tüm route'lar login'e yönlendirilir */}
          <Route path="*" element={<Navigate to="/api/admin/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;