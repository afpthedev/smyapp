import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  DatePicker,
  Divider,
  Dropdown,
  List,
  Popover,
  Progress,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BellOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './styles.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const reservationStats = [
  {
    title: 'Bugünkü Rezervasyonlar',
    value: 42,
    change: '+8%',
    trend: 'up',
    descriptor: 'düne göre artış',
  },
  {
    title: 'Aylık Doluluk',
    value: '78%',
    change: '+3%',
    trend: 'up',
    descriptor: 'hedeflenen oran',
  },
  {
    title: 'İptaller',
    value: 5,
    change: '-2%',
    trend: 'down',
    descriptor: 'son 7 gün',
  },
];

const upcomingReservations = [
  {
    guest: 'Ece Yılmaz',
    type: 'Deluxe Oda',
    time: 'Bugün · 14:30',
    status: 'Check-in',
  },
  {
    guest: 'Mert Demir',
    type: 'Spa & Wellness',
    time: 'Bugün · 16:00',
    status: 'Hazırlık',
  },
  {
    guest: 'Selin Arslan',
    type: 'Akşam Yemeği',
    time: 'Bugün · 20:00',
    status: 'Onaylandı',
  },
];

const occupancyMetrics = [
  {
    label: 'Oda Doluluk',
    value: 76,
    accent: '#2563eb',
  },
  {
    label: 'Spa Rezervasyonları',
    value: 54,
    accent: '#38bdf8',
  },
  {
    label: 'Restoran Doluluk',
    value: 63,
    accent: '#6366f1',
  },
];

const revenueBreakdown = [
  {
    label: 'Oda Geliri',
    value: '₺52.400',
    trend: '+12%',
  },
  {
    label: 'Ek Hizmetler',
    value: '₺18.150',
    trend: '+5%',
  },
  {
    label: 'Etkinlikler',
    value: '₺9.480',
    trend: '+3%',
  },
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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
    <main className="dashboard-page">
      {contextHolder}
      <nav className="dashboard-topbar">
        <div className="dashboard-brand">
          <div className="brand-mark">LR</div>
          <div className="brand-copy">
            <Text className="brand-eyebrow">Luxe Rezervasyon</Text>
            <Title level={5}>Yönetim Merkezi</Title>
          </div>
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
      <header className="dashboard-header">
        <div>
          <Text className="dashboard-eyebrow">Genel Bakış</Text>
          <Title level={2}>Rezervasyon Paneli</Title>
          <Text className="dashboard-subtitle">Bugünün performansını takip edin, trendleri analiz edin ve operasyonları yönetin.</Text>
        </div>
        <Space size={16} className="dashboard-actions" wrap>
          <RangePicker suffixIcon={<CalendarOutlined />} className="dashboard-range-picker" popupClassName="dashboard-picker-dropdown" />
          <Select
            className="dashboard-select"
            defaultValue="today"
            options={[
              { label: 'Bugün', value: 'today' },
              { label: 'Bu Hafta', value: 'week' },
              { label: 'Bu Ay', value: 'month' },
            ]}
          />
        </Space>
      </header>

      <section className="dashboard-stat-grid">
        {reservationStats.map(stat => (
          <Card key={stat.title} className="dashboard-stat-card" bordered={false}>
            <Text className="stat-label">{stat.title}</Text>
            <div className="stat-value-row">
              <Title level={2}>{stat.value}</Title>
              <Tag
                className={`stat-tag ${stat.trend === 'up' ? 'tag-positive' : 'tag-negative'}`}
                icon={stat.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              >
                {stat.change}
              </Tag>
            </div>
            <Text className="stat-helper">{stat.descriptor}</Text>
          </Card>
        ))}
      </section>

      <section className="dashboard-panels">
        <Card className="dashboard-card" bordered={false}>
          <div className="dashboard-card-header">
            <div>
              <Text className="dashboard-card-eyebrow">Yaklaşan Rezervasyonlar</Text>
              <Title level={4}>Bugünkü Misafir Akışı</Title>
            </div>
            <Tag icon={<TeamOutlined />} color="blue" className="dashboard-pill">
              18 misafir
            </Tag>
          </div>
          <List
            className="dashboard-reservation-list"
            dataSource={upcomingReservations}
            renderItem={item => (
              <List.Item className="dashboard-reservation-item">
                <List.Item.Meta avatar={<Avatar>{item.guest.charAt(0)}</Avatar>} title={item.guest} description={item.type} />
                <div className="reservation-meta">
                  <Text className="reservation-time">{item.time}</Text>
                  <Tag className="reservation-status">{item.status}</Tag>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Card className="dashboard-card" bordered={false}>
          <div className="dashboard-card-header">
            <div>
              <Text className="dashboard-card-eyebrow">Doluluk Durumu</Text>
              <Title level={4}>Kaynak Optimizasyonu</Title>
            </div>
            <Tag icon={<DollarCircleOutlined />} color="cyan" className="dashboard-pill">
              Gelir +8%
            </Tag>
          </div>
          <div className="dashboard-occupancy">
            {occupancyMetrics.map(metric => (
              <div key={metric.label} className="occupancy-item">
                <div className="occupancy-label-row">
                  <Text className="occupancy-label">{metric.label}</Text>
                  <Text className="occupancy-value">{metric.value}%</Text>
                </div>
                <Progress
                  percent={metric.value}
                  size="small"
                  strokeLinecap="round"
                  strokeColor={metric.accent}
                  trailColor="rgba(148, 163, 184, 0.15)"
                />
              </div>
            ))}
          </div>
          <Divider className="dashboard-divider" />
          <div className="dashboard-revenue">
            {revenueBreakdown.map(item => (
              <div key={item.label} className="revenue-item">
                <Text className="revenue-label">{item.label}</Text>
                <div className="revenue-value-group">
                  <Text className="revenue-value">{item.value}</Text>
                  <Tag className="revenue-trend tag-positive">{item.trend}</Tag>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;
