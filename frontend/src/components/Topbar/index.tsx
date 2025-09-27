import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Dropdown, List, Popover, Space, Typography, message } from 'antd';
import type { MenuProps } from 'antd';
import { BellOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import './styles.css';

const { Text, Title } = Typography;

const navItems = [
  { key: 'dashboard', label: 'Takvim', to: '/dashboard' },
  { key: 'reservations', label: 'Rezervasyonlar', to: '/reservations' },
  { key: 'customers', label: 'Müşteriler', to: '/customers' },
  { key: 'finance', label: 'Finans', to: '/finance' },
];

const notifications = [
  {
    title: 'Yeni rezervasyon',
    description: 'Elif Kaya · Superior Oda için 12:30 check-in',
    time: '5 dk önce',
  },
  {
    title: 'İptal talebi',
    description: 'Mert Demir · Spa paketi iptal isteği',
    time: '25 dk önce',
  },
  {
    title: 'Ödeme tamamlandı',
    description: 'Selin Arslan · Akşam yemeği rezervasyonu ödendi',
    time: '1 saat önce',
  },
];

const profileMenuItems: MenuProps['items'] = [
  {
    key: 'profile',
    label: 'Profilimi Görüntüle',
  },
  {
    key: 'security',
    label: 'Güvenlik Ayarları',
  },
];

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();

  const handleProfileMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile' || key === 'security') {
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    messageApi.success('Oturum başarıyla kapatıldı.');
    navigate('/login');
  };

  const notificationContent = (
    <div className="dashboard-notification-content">
      <List
        dataSource={notifications}
        renderItem={item => (
          <List.Item className="notification-item">
            <div className="notification-copy">
              <Text className="notification-title">{item.title}</Text>
              <Text className="notification-description">{item.description}</Text>
            </div>
            <Text className="notification-time">{item.time}</Text>
          </List.Item>
        )}
      />
      <Button type="link" className="notification-settings" onClick={() => navigate('/profile')}>
        Bildirim tercihlerini yönet
      </Button>
    </div>
  );

  return (
    <>
      {contextHolder}
      <nav className="dashboard-topbar">
        <div className="dashboard-brand">
          <div className="brand-mark">LR</div>
          <div className="brand-copy">
            <Text className="brand-eyebrow">Luxe Rezervasyon</Text>
            <Title level={5}>Yönetim Merkezi</Title>
          </div>
        </div>

        <div className="topbar-nav" role="navigation" aria-label="Ana menü">
          {navItems.map(item => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) => `topbar-nav-link ${isActive ? 'topbar-nav-link-active' : ''}`}
            >
              {item.label}
              {location.pathname.startsWith(item.to) && <span className="topbar-nav-indicator" aria-hidden />}
            </NavLink>
          ))}
        </div>

        <Space size={16} className="dashboard-topbar-actions" align="center">
          <Popover placement="bottomRight" trigger="click" overlayClassName="dashboard-notification-popover" content={notificationContent}>
            <Badge count={3} overflowCount={9} color="#38bdf8" offset={[2, -4]}>
              <button type="button" className="topbar-icon-button" aria-label="Bildirimler">
                <BellOutlined />
              </button>
            </Badge>
          </Popover>
          <Dropdown
            placement="bottomRight"
            overlayClassName="dashboard-profile-dropdown"
            menu={{ items: profileMenuItems, onClick: handleProfileMenuClick }}
          >
            <button type="button" className="topbar-profile" aria-haspopup="menu">
              <Avatar
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
                size={40}
                icon={<UserOutlined />}
              />
              <span className="topbar-profile-name">Ayşe Zorlu</span>
            </button>
          </Dropdown>
          <Button type="primary" icon={<LogoutOutlined />} className="topbar-logout" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </Space>
      </nav>
    </>
  );
};

export default Topbar;
