import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaPlus,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import './Dashboard.css';
import authService from '../services/authService';
import DashboardPage from './DashboardPage';
import ClientsPage from './ClientsPage';
import CalendarPage from './CalendarPage';
import FinancesPage from './FinancesPage';
import SettingsPage from './SettingsPage';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
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
            <span className="nav-icon">🏠</span>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <span className="nav-icon">🗓️</span>
            Calendar
          </button>
          <button
            className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <span className="nav-icon">👤</span>
            Clients
          </button>
          <button
            className={`nav-item ${activeTab === 'finances' ? 'active' : ''}`}
            onClick={() => setActiveTab('finances')}
          >
            <span className="nav-icon">💳</span>
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
            <div className="page-header">
              <h1>Calendar</h1>
              <div className="calendar-controls">
                <button className="calendar-view-btn active">Week</button>
                <button className="calendar-view-btn">Day</button>
              </div>
            </div>

            <div className="calendar-container">
              <div className="calendar-header">
                <div className="calendar-nav">
                  <button className="nav-btn">‹</button>
                  <h2>Today's Appointments</h2>
                  <button className="nav-btn">›</button>
                </div>
              </div>

              <div className="calendar-grid">
                <div className="calendar-sidebar">
                  <div className="artist-profile">
                    <div className="artist-avatar">
                      <span>AV</span>
                    </div>
                    <h3>Alex Volkov</h3>
                    <p>Realism & Blackwork</p>
                  </div>

                  <div className="artist-profile">
                    <div className="artist-avatar">
                      <span>RB</span>
                    </div>
                    <h3>Raven Blackwood</h3>
                    <p>Neo-Traditional</p>
                  </div>

                  <div className="artist-profile">
                    <div className="artist-avatar">
                      <span>JT</span>
                    </div>
                    <h3>Jax Teller</h3>
                    <p>American Traditional</p>
                  </div>
                </div>

                <div className="calendar-main">
                  <div className="appointment-slot">
                    <div className="appointment-card purple">
                      <div className="appointment-time">10:00 - 12:00</div>
                      <div className="appointment-client">Olivia Wilde</div>
                      <div className="appointment-type">Floral Sleeve</div>
                    </div>
                  </div>

                  <div className="appointment-slot">
                    <div className="appointment-card blue">
                      <div className="appointment-time">11:00 - 13:00</div>
                      <div className="appointment-client">Luna Lovegood</div>
                      <div className="appointment-type">Mystical Creature</div>
                    </div>
                  </div>

                  <div className="appointment-slot">
                    <div className="appointment-card pink">
                      <div className="appointment-time">12:00 - 16:00</div>
                      <div className="appointment-client">Gemma Teller</div>
                      <div className="appointment-type">Rose & Dagger</div>
                    </div>
                  </div>

                  <div className="appointment-slot">
                    <div className="appointment-card green">
                      <div className="appointment-time">13:00 - 15:30</div>
                      <div className="appointment-client">James Dean</div>
                      <div className="appointment-type">Geometric Chest Piece</div>
                    </div>
                  </div>

                  <div className="appointment-slot">
                    <div className="appointment-card orange">
                      <div className="appointment-time">14:00 - 17:00</div>
                      <div className="appointment-client">Sirius Black</div>
                      <div className="appointment-type">Large Back Tattoo</div>
                    </div>
                  </div>

                  <div className="appointment-slot">
                    <div className="appointment-card red">
                      <div className="appointment-time">17:30 - 18:30</div>
                      <div className="appointment-client">Draco Malfoy</div>
                      <div className="appointment-type">Small Hand Tattoo</div>
                    </div>
                  </div>
                </div>

                <div className="appointments-sidebar">
                  <h3>Today's Appointments</h3>

                  <div className="appointment-item">
                    <div className="appointment-avatar">
                      <span>OW</span>
                    </div>
                    <div className="appointment-info">
                      <h4>Olivia Wilde</h4>
                      <p>(555) 123-4567</p>
                      <span className="appointment-status approved">Approved</span>
                    </div>
                    <div className="appointment-actions">
                      <button className="action-btn">✏️</button>
                      <button className="action-btn">❌</button>
                    </div>
                  </div>

                  <div className="appointment-item">
                    <div className="appointment-avatar">
                      <span>JD</span>
                    </div>
                    <div className="appointment-info">
                      <h4>James Dean</h4>
                      <p>(555) 987-6543</p>
                      <span className="appointment-status pending">Pending</span>
                    </div>
                    <div className="appointment-actions">
                      <button className="action-btn">✅</button>
                      <button className="action-btn">❌</button>
                    </div>
                  </div>

                  <div className="appointment-item">
                    <div className="appointment-avatar">
                      <span>MM</span>
                    </div>
                    <div className="appointment-info">
                      <h4>Marilyn Monroe</h4>
                      <p>(555) 246-8013</p>
                      <span className="appointment-status canceled">Canceled</span>
                    </div>
                    <div className="appointment-actions">
                      <button className="action-btn">🔄</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="add-appointment">
                <button className="add-appointment-btn">+</button>
              </div>
            </div>
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
