import React from 'react';
import { Avatar, Card, DatePicker, List, Progress, Select, Space, Tag, Timeline, Typography } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, LineChartOutlined, TeamOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Topbar from '../../components/Topbar';
import '../../styles/workspace.css';
import './styles.css';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const reservationHighlights = [
  {
    title: 'Aktif Rezervasyonlar',
    value: '128',
    helper: '12 yeni rezervasyon',
    progress: 72,
    accent: '#2563eb',
  },
  {
    title: 'Check-in Hazır',
    value: '34',
    helper: '6 oda hazırlıkta',
    progress: 54,
    accent: '#38bdf8',
  },
  {
    title: 'Bekleyen Onay',
    value: '9',
    helper: 'Son 2 saatte bekleyen',
    progress: 26,
    accent: '#f97316',
  },
  {
    title: 'İptal Oranı',
    value: '%4,2',
    helper: 'Hedef: %5 altı',
    progress: 86,
    accent: '#10b981',
  },
];

const reservationPipeline = [
  {
    guest: 'Ece Yılmaz',
    service: 'Deluxe Oda · 2 gece',
    time: 'Bugün · 14:00',
    status: 'Check-in',
  },
  {
    guest: 'Mert Demir',
    service: 'Spa & Wellness',
    time: 'Bugün · 16:00',
    status: 'Hazırlık',
  },
  {
    guest: 'Selin Arslan',
    service: 'Akşam Yemeği',
    time: 'Bugün · 20:00',
    status: 'Onaylandı',
  },
  {
    guest: 'Tuna Karaca',
    service: 'Toplantı Salonu',
    time: 'Yarın · 09:30',
    status: 'Bekliyor',
  },
];

const statusColors: Record<string, string> = {
  'Check-in': 'success',
  Hazırlık: 'processing',
  Onaylandı: 'geekblue',
  Bekliyor: 'warning',
};

const channelBreakdown = [
  {
    channel: 'Web Sitesi',
    ratio: 48,
    delta: '+5%',
    accent: '#2563eb',
  },
  {
    channel: 'Online Acente',
    ratio: 32,
    delta: '+2%',
    accent: '#38bdf8',
  },
  {
    channel: 'Kurumsal',
    ratio: 12,
    delta: '+1%',
    accent: '#6366f1',
  },
  {
    channel: 'Walk-in',
    ratio: 8,
    delta: '-3%',
    accent: '#f97316',
  },
];

const operationsTimeline = [
  {
    time: '08:00',
    title: 'Temizlik tamamlandı',
    description: 'Check-out sonrası odalar hazırlandı.',
  },
  {
    time: '10:30',
    title: 'Kurumsal toplantı hazırlığı',
    description: 'Salon ekipmanı kontrol edildi.',
  },
  {
    time: '13:00',
    title: 'Ön büro brifingi',
    description: 'Akşam pik saat planlaması yapıldı.',
  },
  {
    time: '17:30',
    title: 'Akşam servisi',
    description: 'Restoran rezervasyonları teyit edildi.',
  },
];

const Reservations: React.FC = () => {
  return (
    <main className="workspace-page reservations-page">
      <Topbar />
      <header className="workspace-header">
        <div>
          <Text className="workspace-eyebrow">Operasyon Kontrolü</Text>
          <Title level={2}>Rezervasyon Yönetimi</Title>
          <Text className="workspace-subtitle">
            Günlük rezervasyon akışınızı takip edin, yoğunluk noktalarını analiz edin ve ekibinizin odaklanması gereken adımları planlayın.
          </Text>
        </div>
        <Space size={16} className="workspace-actions" wrap>
          <RangePicker suffixIcon={<CalendarOutlined />} />
          <Select
            defaultValue="today"
            options={[
              { label: 'Bugün', value: 'today' },
              { label: 'Bu Hafta', value: 'week' },
              { label: 'Bu Ay', value: 'month' },
            ]}
          />
        </Space>
      </header>

      <section className="workspace-section reservations-overview">
        <div className="workspace-stat-grid">
          {reservationHighlights.map(stat => (
            <Card key={stat.title} className="workspace-stat-card" bordered={false}>
              <Text className="workspace-stat-label">{stat.title}</Text>
              <div className="reservations-stat-value">
                <Title level={3}>{stat.value}</Title>
                <span className="reservations-helper" style={{ color: stat.accent }}>
                  {stat.helper}
                </span>
              </div>
              <Progress percent={stat.progress} strokeColor={stat.accent} trailColor="rgba(148, 163, 184, 0.18)" strokeLinecap="round" />
            </Card>
          ))}
        </div>
      </section>

      <section className="workspace-section reservations-grid">
        <Card className="workspace-card reservations-list-card" bordered={false}>
          <div className="workspace-card-header">
            <div>
              <Text className="workspace-stat-label">Rezervasyon Akışı</Text>
              <Title level={4}>Günlük Takip</Title>
            </div>
            <Tag icon={<ClockCircleOutlined />} className="workspace-pill">
              Canlı güncelleme
            </Tag>
          </div>
          <div className="reservations-filters">
            <Select
              defaultValue="all"
              options={[
                { label: 'Tümü', value: 'all' },
                { label: 'Check-in', value: 'check-in' },
                { label: 'Hazırlık', value: 'prep' },
                { label: 'Bekleyen', value: 'pending' },
              ]}
            />
            <Select
              defaultValue="today"
              options={[
                { label: 'Bugün', value: 'today' },
                { label: 'Yarın', value: 'tomorrow' },
                { label: 'Bu Hafta', value: 'week' },
              ]}
            />
          </div>
          <List
            className="reservations-list"
            dataSource={reservationPipeline}
            renderItem={item => (
              <List.Item className="reservations-item">
                <List.Item.Meta
                  avatar={<Avatar>{item.guest.charAt(0)}</Avatar>}
                  title={item.guest}
                  description={<span className="reservations-service">{item.service}</span>}
                />
                <div className="reservations-meta">
                  <Text className="reservations-time">{item.time}</Text>
                  <Tag color={statusColors[item.status] || 'default'} className="reservations-status">
                    {item.status}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Card className="workspace-card reservations-channel-card" bordered={false}>
          <div className="workspace-card-header">
            <div>
              <Text className="workspace-stat-label">Kapasite & Kanallar</Text>
              <Title level={4}>Doluluk Dağılımı</Title>
            </div>
            <Tag icon={<LineChartOutlined />} className="workspace-pill">
              Haftalık trend
            </Tag>
          </div>
          <div className="reservations-channel-list">
            {channelBreakdown.map(channel => (
              <div key={channel.channel} className="reservations-channel-item">
                <div className="reservations-channel-header">
                  <Text className="reservations-channel-name">{channel.channel}</Text>
                  <Tag color={channel.accent} className="reservations-channel-tag">
                    {channel.delta}
                  </Tag>
                </div>
                <Progress
                  percent={channel.ratio}
                  strokeColor={channel.accent}
                  trailColor="rgba(148, 163, 184, 0.16)"
                  strokeLinecap="round"
                />
              </div>
            ))}
          </div>
          <div className="reservations-timeline-header">
            <Text className="workspace-stat-label">Operasyon Akışı</Text>
            <Tag icon={<ThunderboltOutlined />} className="workspace-pill">
              Kritik anlar
            </Tag>
          </div>
          <Timeline
            className="reservations-timeline"
            mode="left"
            items={operationsTimeline.map(event => ({
              dot: (
                <span className="reservations-timeline-dot">
                  <TeamOutlined />
                </span>
              ),
              children: (
                <div className="reservations-timeline-item">
                  <Text className="reservations-timeline-time">{event.time}</Text>
                  <Title level={5}>{event.title}</Title>
                  <Text>{event.description}</Text>
                </div>
              ),
            }))}
          />
        </Card>
      </section>
    </main>
  );
};

export default Reservations;
