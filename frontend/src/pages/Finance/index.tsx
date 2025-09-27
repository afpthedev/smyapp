import React, { useEffect, useMemo, useState } from 'react';
import { Card, DatePicker, Empty, List, Progress, Select, Space, Spin, Tag, Typography } from 'antd';
import { FundProjectionScreenOutlined, RiseOutlined, StockOutlined, WalletOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Topbar from '../../components/Topbar';
import '../../styles/workspace.css';
import './styles.css';
import { paymentService, type Payment, type PaymentStatus } from '../../services/api';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

const statusLabels: Record<PaymentStatus, string> = {
  PENDING: 'Beklemede',
  PAID: 'Tamamlandı',
  FAILED: 'Başarısız',
  REFUNDED: 'İade edildi',
};

const Finance: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFinanceData = async () => {
      try {
        const paymentResponse = await paymentService.list({ page: 0, size: 200, sort: 'id,desc' });

        if (!isMounted) {
          return;
        }

        setPayments(paymentResponse.items);
      } catch {
        if (isMounted) {
          setError('Finans verileri alınamadı.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFinanceData();

    return () => {
      isMounted = false;
    };
  }, []);

  const paidTotal = useMemo(
    () => payments.filter(payment => payment.status === 'PAID').reduce((total, payment) => total + Number(payment.amount ?? 0), 0),
    [payments],
  );
  const pendingTotal = useMemo(
    () => payments.filter(payment => payment.status === 'PENDING').reduce((total, payment) => total + Number(payment.amount ?? 0), 0),
    [payments],
  );
  const refundedTotal = useMemo(
    () => payments.filter(payment => payment.status === 'REFUNDED').reduce((total, payment) => total + Number(payment.amount ?? 0), 0),
    [payments],
  );
  const averagePayment = useMemo(() => (payments.length ? paidTotal / payments.length : 0), [payments, paidTotal]);
  const totalRevenue = paidTotal + pendingTotal + refundedTotal;

  const financeHighlights = [
    {
      title: 'Tahsil Edilen',
      value: currencyFormatter.format(paidTotal),
      helper: `${payments.filter(payment => payment.status === 'PAID').length} işlem`,
      progress: totalRevenue ? Math.round((paidTotal / totalRevenue) * 100) : 0,
      accent: '#2563eb',
      icon: <WalletOutlined />,
    },
    {
      title: 'Bekleyen Tahsilat',
      value: currencyFormatter.format(pendingTotal),
      helper: `${payments.filter(payment => payment.status === 'PENDING').length} işlem`,
      progress: totalRevenue ? Math.round((pendingTotal / totalRevenue) * 100) : 0,
      accent: '#f97316',
      icon: <StockOutlined />,
    },
    {
      title: 'İade Edilen',
      value: currencyFormatter.format(refundedTotal),
      helper: `${payments.filter(payment => payment.status === 'REFUNDED').length} işlem`,
      progress: totalRevenue ? Math.round((refundedTotal / totalRevenue) * 100) : 0,
      accent: '#a855f7',
      icon: <FundProjectionScreenOutlined />,
    },
    {
      title: 'Ortalama İşlem',
      value: currencyFormatter.format(averagePayment || 0),
      helper: `${payments.length} ödeme kaydı`,
      progress: payments.length ? Math.min(100, Math.round((averagePayment / (paidTotal || 1)) * 100)) : 0,
      accent: '#10b981',
      icon: <RiseOutlined />,
    },
  ];

  const paymentMethodDistribution = useMemo(() => {
    const counts = payments.reduce<Record<string, number>>((acc, payment) => {
      const method = payment.method ?? 'Bilinmiyor';
      acc[method] = (acc[method] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([method, count]) => ({ method, count, ratio: Math.round((count / (payments.length || 1)) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [payments]);

  const latestPayments = useMemo(() => {
    return payments.slice(0, 6).map(payment => {
      const customerName = [payment.customer?.firstName, payment.customer?.lastName].filter(Boolean).join(' ') || 'Müşteri';
      const reservationDate = payment.reservation?.date ? dayjs(payment.reservation.date).format('DD MMM YYYY') : 'Tarih yok';
      return {
        ...payment,
        customerName,
        reservationDate,
      };
    });
  }, [payments]);

  const outstandingPayments = useMemo(() => {
    return payments
      .filter(payment => payment.status === 'PENDING' || payment.status === 'FAILED')
      .sort((a, b) => Number(b.amount ?? 0) - Number(a.amount ?? 0))
      .slice(0, 5)
      .map(payment => {
        const customerName = [payment.customer?.firstName, payment.customer?.lastName].filter(Boolean).join(' ') || 'Müşteri';
        return {
          id: payment.id,
          customerName,
          amount: Number(payment.amount ?? 0),
          due: payment.reservation?.date ? dayjs(payment.reservation.date).format('DD MMM YYYY HH:mm') : 'Planlanmadı',
          method: payment.method,
          status: payment.status,
        };
      });
  }, [payments]);

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

      {loading ? (
        <div className="workspace-loader">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {error && (
            <div className="workspace-error">
              <Text type="danger">{error}</Text>
            </div>
          )}

          <section className="workspace-section finance-overview">
            <div className="workspace-stat-grid">
              {financeHighlights.map(highlight => (
                <Card key={highlight.title} className="workspace-stat-card" bordered={false}>
                  <Text className="workspace-stat-label">{highlight.title}</Text>
                  <div className="finance-stat-value">
                    <div className="finance-value-row">
                      <Title level={3}>{highlight.value}</Title>
                      <span className="finance-icon">{highlight.icon}</span>
                    </div>
                    <span className="finance-helper" style={{ color: highlight.accent }}>
                      {highlight.helper}
                    </span>
                  </div>
                  <Progress
                    percent={Math.min(100, highlight.progress)}
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
                  <Text className="workspace-stat-label">Ödeme Hareketleri</Text>
                  <Title level={4}>En Son Tahsilatlar</Title>
                </div>
                <Tag icon={<RiseOutlined />} className="workspace-pill">
                  {payments.length} kayıt
                </Tag>
              </div>
              <List
                className="finance-revenue-list"
                dataSource={latestPayments}
                locale={{ emptyText: <Empty description="Ödeme kaydı bulunamadı." /> }}
                renderItem={payment => (
                  <List.Item className="finance-revenue-item" key={payment.id}>
                    <div className="finance-revenue-copy">
                      <Text className="finance-revenue-label">{payment.customerName}</Text>
                      <Text className="finance-revenue-value">{currencyFormatter.format(Number(payment.amount ?? 0))}</Text>
                    </div>
                    <div className="finance-revenue-meta">
                      <Tag color="blue" className="finance-revenue-tag">
                        {payment.method ?? 'Bilinmiyor'}
                      </Tag>
                      <Tag
                        color={payment.status === 'PAID' ? 'green' : payment.status === 'PENDING' ? 'orange' : 'red'}
                        className="finance-revenue-tag"
                      >
                        {statusLabels[payment.status]}
                      </Tag>
                      <Text className="finance-revenue-time">{payment.reservationDate}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            <Card className="workspace-card finance-insights-card" bordered={false}>
              <div className="workspace-card-header">
                <div>
                  <Text className="workspace-stat-label">Ödeme Yöntemi Dağılımı</Text>
                  <Title level={4}>Tahsilat Kanalları</Title>
                </div>
                <Tag icon={<StockOutlined />} className="workspace-pill">
                  {paymentMethodDistribution.length} yöntem
                </Tag>
              </div>
              <div className="finance-methods">
                {paymentMethodDistribution.length > 0 ? (
                  paymentMethodDistribution.map(method => (
                    <div key={method.method} className="finance-method-item">
                      <div className="finance-method-header">
                        <Text className="finance-method-name">{method.method}</Text>
                        <Text className="finance-method-value">%{method.ratio}</Text>
                      </div>
                      <Progress percent={method.ratio} strokeColor="#2563eb" trailColor="rgba(148, 163, 184, 0.18)" strokeLinecap="round" />
                    </div>
                  ))
                ) : (
                  <Empty description="Ödeme yöntemi verisi bulunamadı." image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>

              <div className="finance-collections">
                <div className="finance-collections-header">
                  <Text className="workspace-stat-label">Takip Gerektiren İşlemler</Text>
                  <Tag icon={<WalletOutlined />} className="workspace-pill">
                    {outstandingPayments.length} kayıt
                  </Tag>
                </div>
                <List
                  dataSource={outstandingPayments}
                  locale={{ emptyText: <Empty description="Bekleyen işlem bulunmuyor." /> }}
                  renderItem={item => (
                    <List.Item key={item.id} className="finance-collection-item">
                      <div className="finance-collection-main">
                        <Text className="finance-collection-name">{item.customerName}</Text>
                        <Text className="finance-collection-due">{item.due}</Text>
                      </div>
                      <div className="finance-collection-meta">
                        <Tag color="orange" className="finance-collection-tag">
                          {item.method ?? 'Bilinmiyor'}
                        </Tag>
                        <Text className="finance-collection-amount">{currencyFormatter.format(item.amount)}</Text>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </section>
        </>
      )}
    </main>
  );
};

export default Finance;
