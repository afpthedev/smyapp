import React from 'react';
import { Card, DatePicker, List, Progress, Select, Space, Tag, Typography } from 'antd';
import { FundProjectionScreenOutlined, RiseOutlined, StockOutlined, WalletOutlined } from '@ant-design/icons';
import Topbar from '../../components/Topbar';
import '../../styles/workspace.css';
import './styles.css';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const financeHighlights = [
  {
    title: 'Aylık Gelir',
    value: '₺2,4M',
    helper: '+12% artış',
    progress: 72,
    accent: '#2563eb',
  },
  {
    title: 'ADR',
    value: '₺3.150',
    helper: '+₺240',
    progress: 64,
    accent: '#6366f1',
  },
  {
    title: 'RevPAR',
    value: '₺2.120',
    helper: '+%9 büyüme',
    progress: 58,
    accent: '#38bdf8',
  },
  {
    title: 'Masraf Oranı',
    value: '%42',
    helper: '-2 puan',
    progress: 62,
    accent: '#f97316',
  },
];

const revenueStreams = [
  {
    label: 'Konaklama Geliri',
    value: '₺1,6M',
    change: '+14%',
    accent: '#2563eb',
  },
  {
    label: 'Yiyecek & İçecek',
    value: '₺420K',
    change: '+8%',
    accent: '#38bdf8',
  },
  {
    label: 'Etkinlik & Toplantı',
    value: '₺210K',
    change: '+5%',
    accent: '#a855f7',
  },
  {
    label: 'Spa & Wellness',
    value: '₺180K',
    change: '+6%',
    accent: '#10b981',
  },
];

const expenseBreakdown = [
  {
    category: 'Operasyon',
    value: '₺820K',
    ratio: 34,
    accent: '#f97316',
  },
  {
    category: 'Personel',
    value: '₺640K',
    ratio: 26,
    accent: '#facc15',
  },
  {
    category: 'Pazarlama',
    value: '₺210K',
    ratio: 9,
    accent: '#6366f1',
  },
  {
    category: 'Bakım & Yatırım',
    value: '₺150K',
    ratio: 6,
    accent: '#38bdf8',
  },
];

const collectionStatus = [
  {
    account: 'Global Travel A.Ş.',
    amount: '₺92.400',
    due: '5 gün kaldı',
    status: 'Beklemede',
  },
  {
    account: 'Kaya Holding',
    amount: '₺58.300',
    due: 'Bugün',
    status: 'Öncelik',
  },
  {
    account: 'Sunrise Events',
    amount: '₺41.850',
    due: '2 gün kaldı',
    status: 'Takipte',
  },
  {
    account: 'BlueSky Agency',
    amount: '₺27.600',
    due: 'Yeni',
    status: 'Planlandı',
  },
];

const Finance: React.FC = () => {
  return (
    <main className="workspace-page finance-page">
      <Topbar />
      <header className="workspace-header">
        <div>
          <Text className="workspace-eyebrow">Gelir Optimizasyonu</Text>
          <Title level={2}>Finans Performans Panosu</Title>
          <Text className="workspace-subtitle">
            Gelir kaynaklarını analiz edin, masraf trendlerini izleyin ve nakit akışınızı sürdürülebilir büyüme için planlayın.
          </Text>
        </div>
        <Space size={16} className="workspace-actions" wrap>
          <RangePicker />
          <Select
            defaultValue="month"
            options={[
              { label: 'Bu Ay', value: 'month' },
              { label: 'Bu Çeyrek', value: 'quarter' },
              { label: 'Bu Yıl', value: 'year' },
            ]}
          />
        </Space>
      </header>

      <section className="workspace-section finance-overview">
        <div className="workspace-stat-grid">
          {financeHighlights.map(highlight => (
            <Card key={highlight.title} className="workspace-stat-card" bordered={false}>
              <Text className="workspace-stat-label">{highlight.title}</Text>
              <div className="finance-stat-value">
                <Title level={3}>{highlight.value}</Title>
                <span className="finance-helper" style={{ color: highlight.accent }}>
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

      <section className="workspace-section finance-grid">
        <Card className="workspace-card finance-revenue-card" bordered={false}>
          <div className="workspace-card-header">
            <div>
              <Text className="workspace-stat-label">Gelir Akışları</Text>
              <Title level={4}>Segment Bazlı Dağılım</Title>
            </div>
            <Tag icon={<RiseOutlined />} className="workspace-pill">
              Bütçe üstü %6
            </Tag>
          </div>
          <List
            className="finance-revenue-list"
            dataSource={revenueStreams}
            renderItem={stream => (
              <List.Item className="finance-revenue-item">
                <div className="finance-revenue-copy">
                  <Text className="finance-revenue-label">{stream.label}</Text>
                  <Text className="finance-revenue-value">{stream.value}</Text>
                </div>
                <div className="finance-revenue-meta">
                  <Tag color={stream.accent} className="finance-revenue-tag">
                    {stream.change}
                  </Tag>
                  <Progress
                    percent={Math.min(100, parseInt(stream.change.replace(/[^0-9-]/g, ''), 10) + 60)}
                    strokeColor={stream.accent}
                    trailColor="rgba(148, 163, 184, 0.16)"
                    strokeLinecap="round"
                  />
                </div>
              </List.Item>
            )}
          />
          <div className="finance-revenue-forecast">
            <Tag icon={<StockOutlined />} className="workspace-pill">
              RevPAR hedefi %92
            </Tag>
            <Progress percent={92} strokeColor="#2563eb" trailColor="rgba(148, 163, 184, 0.2)" strokeLinecap="round" />
          </div>
        </Card>

        <Card className="workspace-card finance-expense-card" bordered={false}>
          <div className="workspace-card-header">
            <div>
              <Text className="workspace-stat-label">Masraf Dağılımı</Text>
              <Title level={4}>Kontrollü Büyüme</Title>
            </div>
            <Tag icon={<FundProjectionScreenOutlined />} className="workspace-pill">
              Bütçe takibi
            </Tag>
          </div>
          <div className="finance-expense-list">
            {expenseBreakdown.map(expense => (
              <div key={expense.category} className="finance-expense-item">
                <div className="finance-expense-header">
                  <Text className="finance-expense-name">{expense.category}</Text>
                  <Text className="finance-expense-value">{expense.value}</Text>
                </div>
                <Progress
                  percent={expense.ratio}
                  strokeColor={expense.accent}
                  trailColor="rgba(148, 163, 184, 0.16)"
                  strokeLinecap="round"
                />
              </div>
            ))}
          </div>
          <div className="finance-expense-summary">
            <div>
              <Text className="finance-expense-label">Gider / Gelir Oranı</Text>
              <Title level={3}>%42</Title>
            </div>
            <Tag color="green" className="finance-expense-tag">
              -2 puan
            </Tag>
          </div>
        </Card>

        <Card className="workspace-card finance-collection-card" bordered={false}>
          <div className="workspace-card-header">
            <div>
              <Text className="workspace-stat-label">Tahsilat Durumu</Text>
              <Title level={4}>Kurumsal Alacaklar</Title>
            </div>
            <Tag icon={<WalletOutlined />} className="workspace-pill">
              ₺219K açık
            </Tag>
          </div>
          <List
            className="finance-collection-list"
            dataSource={collectionStatus}
            renderItem={item => (
              <List.Item className="finance-collection-item">
                <div className="finance-collection-copy">
                  <Title level={5}>{item.account}</Title>
                  <Text>{item.due}</Text>
                </div>
                <div className="finance-collection-meta">
                  <Text className="finance-collection-amount">{item.amount}</Text>
                  <Tag
                    className="finance-collection-status"
                    color={item.status === 'Öncelik' ? 'volcano' : item.status === 'Beklemede' ? 'gold' : 'geekblue'}
                  >
                    {item.status}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </section>
    </main>
  );
};

export default Finance;
