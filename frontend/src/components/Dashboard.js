import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faHome,
  faCalendarAlt,
  faUsers,
  faDollarSign,
  faCog,
  faSignOutAlt,
  faSearch,
  faPlus,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';
import authService from '../services/authService';
import DashboardPage from '../pages/DashboardPage';
import ClientsPage from '../pages/ClientsPage';
import CalendarPage from '../pages/CalendarPage';
import FinancesPage from '../pages/FinancesPage';
import SettingsPage from '../pages/SettingsPage';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage/>;
      case 'clients':
        return <ClientsPage/>;
      case 'calendar':
        return <CalendarPage/>;
      case 'finances':
        return <FinancesPage/>;
      case 'settings':
        return <SettingsPage user={user}/>;
      default:
        return <DashboardPage/>;
    }
  };

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
            <span className="nav-icon"><FontAwesomeIcon icon={faHome}/></span>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <span className="nav-icon"><FontAwesomeIcon icon={faCalendarAlt}/></span>
            Calendar
          </button>
          <button
            className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <span className="nav-icon"><FontAwesomeIcon icon={faUsers}/></span>
            Clients
          </button>
          <button
            className={`nav-item ${activeTab === 'finances' ? 'active' : ''}`}
            onClick={() => setActiveTab('finances')}
          >
            <span className="nav-icon"><FontAwesomeIcon icon={faDollarSign}/></span>
            Finances
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon"><FontAwesomeIcon icon={faCog}/></span>
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt}/> Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
