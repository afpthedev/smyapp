import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Liam Carter',
      phone: '(555) 123-4567',
      email: 'liam.carter@email.com',
      appointments: 3,
      lastAppointment: '2023-11-15'
    },
    {
      id: 2,
      name: 'Olivia Bennett',
      phone: '(555) 987-6543',
      email: 'olivia.bennett@email.com',
      appointments: 2,
      lastAppointment: '2023-10-20'
    },
    {
      id: 3,
      name: 'Ethan Harper',
      phone: '(555) 246-8013',
      email: 'ethan.harper@email.com',
      appointments: 1,
      lastAppointment: '2023-09-05'
    },
    {
      id: 4,
      name: 'Sophia Evans',
      phone: '(555) 135-7924',
      email: 'sophia.evans@email.com',
      appointments: 4,
      lastAppointment: '2023-12-01'
    },
    {
      id: 5,
      name: 'Noah Foster',
      phone: '(555) 369-1212',
      email: 'noah.foster@email.com',
      appointments: 2,
      lastAppointment: '2023-11-28'
    }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
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
      navigate('/api/admin/login');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

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
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="app-title">InkFlow</h2>
          <span className="app-subtitle">Beta</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <span className="nav-icon">📅</span>
            Calendar
          </button>
          <button
            className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <span className="nav-icon">👥</span>
            Clients
          </button>
          <button
            className={`nav-item ${activeTab === 'finances' ? 'active' : ''}`}
            onClick={() => setActiveTab('finances')}
          >
            <span className="nav-icon">💰</span>
            Finances
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'clients' && (
          <div className="clients-page">
            <div className="page-header">
              <h1>Clients</h1>
              <button className="new-client-btn">
                + New Client
              </button>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search clients"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="clients-table-container">
              <table className="clients-table">
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Appointments</th>
                  <th>Last Appointment</th>
                </tr>
                </thead>
                <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id}>
                    <td className="client-name">{client.name}</td>
                    <td className="client-phone">{client.phone}</td>
                    <td className="client-email">{client.email}</td>
                    <td className="client-appointments">{client.appointments}</td>
                    <td className="client-last-appointment">{client.lastAppointment}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard-page">
            <h1>Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Toplam Müşteriler</h3>
                <p className="stat-number">{clients.length}</p>
              </div>
              <div className="stat-card">
                <h3>Bu Ay Randevular</h3>
                <p className="stat-number">12</p>
              </div>
              <div className="stat-card">
                <h3>Gelir</h3>
                <p className="stat-number">₺2,450</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="calendar-page">
            <h1>Calendar</h1>
            <p>Takvim özelliği yakında eklenecek...</p>
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="finances-page">
            <h1>Finances</h1>
            <p>Finans özelliği yakında eklenecek...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-page">
            <h1>Settings</h1>
            <div className="user-info-card">
              <h3>Kullanıcı Bilgileri</h3>
              {user && (
                <div>
                  <p><strong>Kullanıcı Adı:</strong> {user.login || user.username}</p>
                  <p><strong>E-posta:</strong> {user.email || 'Belirtilmemiş'}</p>
                  <p><strong>Ad
                    Soyad:</strong> {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Belirtilmemiş'}
                  </p>
                  <p><strong>Dil:</strong> {user.langKey || 'tr'}</p>
                  <p>
                    <strong>Yetkilendirmeler:</strong> {user.authorities ? user.authorities.join(', ') : 'Belirtilmemiş'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
