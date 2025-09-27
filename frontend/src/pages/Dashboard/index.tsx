import React from 'react';
import { Avatar, Card, DatePicker, Divider, List, Progress, Select, Space, Tag, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, CalendarOutlined, DollarCircleOutlined, TeamOutlined } from '@ant-design/icons';
import Topbar from '../../components/Topbar';
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

const Dashboard: React.FC = () => {
  return (
    <main className="dashboard-page">
      <Topbar />
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
