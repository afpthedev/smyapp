import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Dropdown, List, Popover, Space, Typography, message } from 'antd';
import type { MenuProps } from 'antd';
import { BellOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  accountService,
  authService,
  businessService,
  reservationService,
  resolveImageUrl,
  type AdminUser,
  type Business,
  type Reservation,
} from '../../services/api';
import './styles.css';

const { Text, Title } = Typography;

const navItems = [
  { key: 'dashboard', label: 'Genel Bakış', to: '/dashboard' },
  { key: 'reservations', label: 'Rezervasyonlar', to: '/reservations' },
  { key: 'customers', label: 'Müşteriler', to: '/customers' },
  { key: 'finance', label: 'Finans', to: '/finance' },
];

const statusLabels: Record<string, string> = {
  PENDING: 'Onay bekliyor',
  CONFIRMED: 'Onaylandı',
  CANCELLED: 'İptal edildi',
  COMPLETED: 'Tamamlandı',
};

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
  const [user, setUser] = useState<AdminUser | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [accountResponse, businessResponse, reservationsResponse] = await Promise.all([
          accountService.getProfile().catch(() => null),
          businessService.list({ page: 0, size: 1 }).catch(() => null),
          reservationService.list({ page: 0, size: 5, sort: 'date,desc' }).catch(() => null),
        ]);

        if (!isMounted) {
          return;
        }

        if (accountResponse) {
          setUser(accountResponse.data);
        }

        if (businessResponse && businessResponse.items.length > 0) {
          setBusiness(businessResponse.items[0]);
        }

        if (reservationsResponse) {
          setRecentReservations(reservationsResponse.items);
        }
      } catch (error) {
        // Sessizce geç ve topbar'ı çalışır durumda bırak
        console.warn('Topbar verileri yüklenirken hata oluştu', error);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const notifications = useMemo(
    () =>
      recentReservations.map(reservation => {
        const customerName = [reservation.customer?.firstName, reservation.customer?.lastName].filter(Boolean).join(' ');
        const serviceName = reservation.service?.name ?? 'Belirlenmemiş hizmet';
        return {
          key: reservation.id,
          title: statusLabels[reservation.status] ?? reservation.status,
          description: `${customerName || 'Müşteri'} · ${serviceName}`,
          time: dayjs(reservation.date).format('DD MMM YYYY HH:mm'),
        };
      }),
    [recentReservations],
  );

  const notificationCount = notifications.length;

  const defaultBrandName = 'Caplio.ai';
  const brandName = business?.name?.trim() || defaultBrandName;
  const brandInitials = useMemo(() => {
    const normalized = brandName.replace(/[.]/g, ' ');
    return normalized
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .padEnd(2, 'A')
      .slice(0, 2);
  }, [brandName]);

  const brandSubtitle = business?.type ? business.type.toLowerCase().replace(/_/g, ' ') : 'Operasyon Merkezi';

  const handleProfileMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile' || key === 'security') {
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    messageApi.success('Oturum başarıyla kapatıldı.');
    authService.logout();
  };

  const notificationContent = (
    <div className="dashboard-notification-content">
      {notifications.length > 0 ? (
        <List
          dataSource={notifications}
          renderItem={item => (
            <List.Item key={item.key} className="notification-item">
              <div className="notification-copy">
                <Text className="notification-title">{item.title}</Text>
                <Text className="notification-description">{item.description}</Text>
              </div>
              <Text className="notification-time">{item.time}</Text>
            </List.Item>
          )}
        />
      ) : (
        <div className="notification-empty">
          <Text>Yeni bildirim bulunmuyor.</Text>
        </div>
      )}
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
          <div className="brand-mark">{brandInitials}</div>
          <div className="brand-copy">
            <Text className="brand-eyebrow">{brandName}</Text>
            <Title level={5}>{brandSubtitle}</Title>
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
            <Badge count={notificationCount} overflowCount={9} color="#38bdf8" offset={[2, -4]}>
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
              <Avatar src={resolveImageUrl(user?.imageUrl)} size={40} icon={<UserOutlined />} />
              <span className="topbar-profile-name">
                {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.login || 'Kullanıcı'}
              </span>
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
