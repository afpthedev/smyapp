import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          // Kullanıcı bilgisi alınamazsa login'e yönlendir
          navigate('/api/admin/login');
        }
      } catch (error) {
        console.error('User data loading error:', error);
        navigate('/api/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/api/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Hata olsa bile logout yap
      navigate('/api/admin/login');
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Hoş geldiniz, {user?.login || user?.username || 'Admin'}</span>
          <button onClick={handleLogout} className="btn logout-btn">
            Çıkış Yap
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Toplam Kullanıcılar</h3>
            <p className="stat-number">-</p>
          </div>
          <div className="stat-card">
            <h3>Aktif Oturumlar</h3>
            <p className="stat-number">-</p>
          </div>
          <div className="stat-card">
            <h3>Sistem Durumu</h3>
            <p className="stat-number">Aktif</p>
          </div>
        </div>
        
        <div className="user-details">
          <h2>Kullanıcı Bilgileri</h2>
          {user && (
            <div className="user-info-card">
              <p><strong>Kullanıcı Adı:</strong> {user.login || user.username}</p>
              <p><strong>E-posta:</strong> {user.email || 'Belirtilmemiş'}</p>
              <p><strong>Ad Soyad:</strong> {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Belirtilmemiş'}</p>
              <p><strong>Dil:</strong> {user.langKey || 'tr'}</p>
              <p><strong>Yetkilendirmeler:</strong> {user.authorities ? user.authorities.join(', ') : 'Belirtilmemiş'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;