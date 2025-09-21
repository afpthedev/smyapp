import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import authService from './services/authService';

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
          
          {/* Korumalı admin rotaları */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Diğer rotalar için login'e yönlendir */}
          <Route path="*" element={<Navigate to="/api/admin/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;