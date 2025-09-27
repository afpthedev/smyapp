import React from 'react';
import { Avatar, Card, List, Progress, Select, Space, Tag, Typography } from 'antd';
import { CrownOutlined, CustomerServiceOutlined, HeartOutlined, SmileOutlined } from '@ant-design/icons';
import Topbar from '../../components/Topbar';
import '../../styles/workspace.css';
import './styles.css';

const { Title, Text } = Typography;

const customerHighlights = [
  {
    title: 'Aktif Müşteri',
    value: '2.430',
    helper: '+8% artış',
    progress: 68,
    accent: '#2563eb',
  },
  {
    title: 'Sadakat Üyesi',
    value: '1.280',
    helper: '%52 dönüşüm',
    progress: 52,
    accent: '#6366f1',
  },
  {
    title: 'Net Tavsiye Skoru',
    value: '68',
    helper: '+4 puan',
    progress: 68,
    accent: '#10b981',
  },
  {
    title: 'Yüksek Değerli',
    value: '320',
    helper: 'Aylık ₺1.2M gelir',
    progress: 84,
    accent: '#f97316',
  },
];

const customerProfiles = [
  {
    name: 'Ece Yılmaz',
    tier: 'Platinum',
    spend: '₺42.150',
    visits: 18,
    interests: ['SPA', 'Suit'],
  },
  {
    name: 'Mert Demir',
    tier: 'Gold',
    spend: '₺31.480',
    visits: 12,
    interests: ['Toplantı', 'Restoran'],
  },
  {
    name: 'Selin Arslan',
    tier: 'Platinum',
    spend: '₺28.940',
    visits: 10,
    interests: ['Etkinlik', 'Gurme'],
  },
  {
    name: 'Kerem Aksoy',
    tier: 'Silver',
    spend: '₺18.620',
    visits: 8,
    interests: ['Aile', 'Hafta Sonu'],
  },
];

const membershipColors: Record<string, string> = {
  Platinum: '#a855f7',
  Gold: '#facc15',
  Silver: '#94a3b8',
};

const customerSegments = [
  {
    segment: 'Premium',
    ratio: 38,
    trend: '+6%',
    accent: '#6366f1',
  },
  {
    segment: 'Kurumsal',
    ratio: 27,
    trend: '+2%',
    accent: '#2563eb',
  },
  {
    segment: 'Aile',
    ratio: 21,
    trend: '+1%',
    accent: '#38bdf8',
  },
  {
    segment: 'Yeni Misafir',
    ratio: 14,
    trend: '-3%',
    accent: '#f97316',
  },
];

const followUps = [
  {
    title: 'Doğum günü paketi önerisi',
    owner: 'Ayşe Y.',
    due: 'Bugün',
    status: 'Hazırlanıyor',
  },
  {
    title: 'Kurumsal anlaşma yenileme',
    owner: 'Emre K.',
    due: '2 gün sonra',
    status: 'Görüşmede',
  },
  {
    title: 'Spa deneyimi geri bildirimi',
    owner: 'Selin A.',
    due: 'Bu hafta',
    status: 'Planlandı',
  },
];

const Customers: React.FC = () => {
  return (
    <main className="workspace-page customers-page">
      <Topbar />
      <header className="workspace-header">
        <div>
          <Text className="workspace-eyebrow">Misafir Analitiği</Text>
          <Title level={2}>Müşteri Deneyimi Merkezi</Title>
          <Text className="workspace-subtitle">
            Sadakat üyelerinizi tanıyın, segment performansını takip edin ve kişiselleştirilmiş aksiyonlarla gelir etkisini artırın.
          </Text>
        </div>
        <Space size={16} className="workspace-actions" wrap>
          <Select
            defaultValue="all"
            options={[
              { label: 'Tüm Segmentler', value: 'all' },
              { label: 'Premium', value: 'premium' },
              { label: 'Kurumsal', value: 'corporate' },
            ]}
          />
          <Select
            defaultValue="quarter"
            options={[
              { label: 'Bu Ay', value: 'month' },
              { label: 'Bu Çeyrek', value: 'quarter' },
              { label: 'Bu Yıl', value: 'year' },
            ]}
          />
        </Space>
      </header>

      <section className="workspace-section customers-overview">
        <div className="workspace-stat-grid">
          {customerHighlights.map(highlight => (
            <Card key={highlight.title} className="workspace-stat-card" bordered={false}>
              <Text className="workspace-stat-label">{highlight.title}</Text>
              <div className="customers-stat-value">
                <Title level={3}>{highlight.value}</Title>
                <span className="customers-helper" style={{ color: highlight.accent }}>
                  {highlight.helper}
                </span>
              </div>
              <Progress
                percent={highlight.progress}
                strokeColor={highlight.accent}
                trailColor="rgba(148, 163, 184, 0.18)"
                strokeLinecap="round"
              />
            </Card>
          ))}
        </div>
      </section>

      <section className="workspace-section customers-grid">
        <Card className="workspace-card customers-list-card" bordered={false}>
          <div className="workspace-card-header">
            <div>
              <Text className="workspace-stat-label">Sadakat Üyeleri</Text>
              <Title level={4}>En Değerli Misafirler</Title>
            </div>
            <Tag icon={<CrownOutlined />} className="workspace-pill">
              Öncelikli hizmet
            </Tag>
          </div>
          <List
            className="customers-list"
            dataSource={customerProfiles}
            renderItem={customer => (
              <List.Item className="customers-item">
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: membershipColors[customer.tier] }}>{customer.name.charAt(0)}</Avatar>}
                  title={customer.name}
                  description={
                    <div className="customers-interests">
                      {customer.interests.map(interest => (
                        <Tag key={interest}>{interest}</Tag>
                      ))}
                    </div>
                  }
                />
                <div className="customers-meta">
                  <Tag className="customers-tier" color={membershipColors[customer.tier]}>
                    {customer.tier}
                  </Tag>
                  <Text className="customers-spend">{customer.spend}</Text>
                  <Text className="customers-visits">{customer.visits} ziyaret</Text>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Card className="workspace-card customers-segment-card" bordered={false}>
          <div className="workspace-card-header">
            <div>
              <Text className="workspace-stat-label">Segment Analizi</Text>
              <Title level={4}>Sadakat Nabzı</Title>
            </div>
            <Tag icon={<HeartOutlined />} className="workspace-pill">
              %84 memnuniyet
            </Tag>
          </div>
          <div className="customers-segment-overview">
            <div className="customers-sentiment">
              <Progress type="dashboard" percent={84} strokeColor="#10b981" trailColor="rgba(148, 163, 184, 0.18)" />
              <div className="customers-sentiment-copy">
                <Title level={4}>Sadakat Sağlığı</Title>
                <Text>Sadakat üyelerinin %84’ü deneyimlerinden oldukça memnun.</Text>
              </div>
            </div>
            <div className="customers-segment-list">
              {customerSegments.map(segment => (
                <div key={segment.segment} className="customers-segment-item">
                  <div className="customers-segment-header">
                    <Text className="customers-segment-name">{segment.segment}</Text>
                    <Tag color={segment.accent} className="customers-segment-tag">
                      {segment.trend}
                    </Tag>
                  </div>
                  <Progress
                    percent={segment.ratio}
                    strokeColor={segment.accent}
                    trailColor="rgba(148, 163, 184, 0.16)"
                    strokeLinecap="round"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="customers-follow-ups">
            <Text className="workspace-stat-label">Takip Aksiyonları</Text>
            <div className="customers-follow-up-list">
              {followUps.map(action => (
                <div key={action.title} className="customers-follow-up-item">
                  <div className="customers-follow-up-copy">
                    <Title level={5}>{action.title}</Title>
                    <Text>{action.owner}</Text>
                  </div>
                  <div className="customers-follow-up-meta">
                    <Tag icon={<CustomerServiceOutlined />} className="workspace-pill">
                      {action.due}
                    </Tag>
                    <Tag color="geekblue" className="customers-follow-up-status">
                      {action.status}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="workspace-section customers-feedback">
        <Card className="workspace-card" bordered={false}>
          <div className="workspace-card-header">
            <div>
              <Text className="workspace-stat-label">Geri Bildirimler</Text>
              <Title level={4}>Misafir Yorumları</Title>
            </div>
            <Tag icon={<SmileOutlined />} className="workspace-pill">
              Haftalık özet
            </Tag>
          </div>
          <div className="customers-feedback-grid">
            {[
              {
                quote: 'Lobi ekibiniz check-in sırasında tüm süreci dakikalar içinde çözdü. Dijital oda anahtarını çok sevdim!',
                author: 'Deniz K.',
                tier: 'Gold Üye',
              },
              {
                quote: 'Spa paketlerinizde kişiselleştirilmiş önerilerle gerçekten fark yaratıyorsunuz.',
                author: 'Melisa T.',
                tier: 'Platinum Üye',
              },
              {
                quote: 'Toplantı salonunuzda teknik destek hep hazır. Yeni kahve menüsü de çok beğenildi.',
                author: 'Baran L.',
                tier: 'Kurumsal Misafir',
              },
            ].map(feedback => (
              <blockquote key={feedback.author} className="customers-feedback-card">
                <p>“{feedback.quote}”</p>
                <footer>
                  <strong>{feedback.author}</strong>
                  <span>{feedback.tier}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
};

export default Customers;
