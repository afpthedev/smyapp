import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import authService from './services/authService';

// Protected Route bileşeni
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ana sayfa yönlendirmesi */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          
          {/* Login sayfası */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Korumalı Dashboard sayfası */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Diğer tüm rotalar login'e yönlendirilir */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;