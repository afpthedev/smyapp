import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Card, Empty, List, Progress, Select, Space, Spin, Tag, Typography } from 'antd';
import { CrownOutlined, CustomerServiceOutlined, HeartOutlined, SmileOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Topbar from '../../components/Topbar';
import '../../styles/workspace.css';
import './styles.css';
import { customerService, paymentService, reservationService, type Customer, type Payment, type Reservation } from '../../services/api';

const { Title, Text } = Typography;

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

interface CustomerInsight extends Customer {
  reservationCount: number;
  lastReservation?: string;
  nextReservation?: string;
  nextStatus?: string;
  totalPaid: number;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [segmentFilter, setSegmentFilter] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [customerResponse, reservationResponse, paymentResponse] = await Promise.all([
          customerService.list({ page: 0, size: 200, sort: 'id,desc' }),
          reservationService.list({ page: 0, size: 200, sort: 'date,desc' }),
          paymentService.list({ page: 0, size: 200, sort: 'id,desc' }),
        ]);

        if (!isMounted) {
          return;
        }

        setCustomers(customerResponse.items);
        setReservations(reservationResponse.items);
        setPayments(paymentResponse.items);
      } catch {
        if (isMounted) {
          setError('Müşteri verileri alınamadı.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const insights = useMemo<CustomerInsight[]>(() => {
    const paymentsByCustomer = payments.reduce<Record<number, number>>((acc, payment) => {
      if (payment.customer?.id && payment.status === 'PAID') {
        acc[payment.customer.id] = (acc[payment.customer.id] ?? 0) + Number(payment.amount ?? 0);
      }
      return acc;
    }, {});

    return customers.map(customer => {
      const relatedReservations = reservations
        .filter(reservation => reservation.customer?.id === customer.id)
        .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

      const lastReservation = relatedReservations[0];
      const upcomingReservation = relatedReservations.find(reservation => dayjs(reservation.date).isAfter(dayjs()));

      return {
        ...customer,
        reservationCount: relatedReservations.length,
        lastReservation: lastReservation?.date,
        nextReservation: upcomingReservation?.date,
        nextStatus: upcomingReservation?.status,
        totalPaid: paymentsByCustomer[customer.id ?? 0] ?? 0,
      };
    });
  }, [customers, reservations, payments]);

  const totalCustomers = customers.length;
  const customersWithReservations = insights.filter(customer => customer.reservationCount > 0).length;
  const loyalCustomers = insights.filter(customer => customer.reservationCount > 1).length;
  const totalRevenue = payments.filter(payment => payment.status === 'PAID').reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const averageRevenuePerCustomer = customersWithReservations ? totalRevenue / customersWithReservations : 0;

  const customerHighlights = [
    {
      title: 'Toplam Müşteri',
      value: totalCustomers,
      helper: `${customersWithReservations} kayıtlı rezervasyon`,
      progress: 100,
      accent: '#2563eb',
    },
    {
      title: 'Aktif İlişkiler',
      value: customersWithReservations,
      helper: `${totalCustomers ? Math.round((customersWithReservations / totalCustomers) * 100) : 0}% oran`,
      progress: totalCustomers ? Math.round((customersWithReservations / totalCustomers) * 100) : 0,
      accent: '#6366f1',
    },
    {
      title: 'Tekrar Eden Müşteri',
      value: loyalCustomers,
      helper: `${customersWithReservations ? Math.round((loyalCustomers / customersWithReservations) * 100) : 0}% dönüşüm`,
      progress: customersWithReservations ? Math.round((loyalCustomers / customersWithReservations) * 100) : 0,
      accent: '#10b981',
    },
    {
      title: 'Müşteri Başına Gelir',
      value: currencyFormatter.format(averageRevenuePerCustomer || 0),
      helper: `Toplam gelir: ${currencyFormatter.format(totalRevenue)}`,
      progress: totalRevenue ? Math.min(100, Math.round((averageRevenuePerCustomer / (totalRevenue || 1)) * 100)) : 0,
      accent: '#f97316',
    },
  ];

  const filteredInsights = useMemo(() => {
    if (segmentFilter === 'all') {
      return insights;
    }

    if (segmentFilter === 'loyal') {
      return insights.filter(customer => customer.reservationCount > 1);
    }

    if (segmentFilter === 'inactive') {
      return insights.filter(customer => customer.reservationCount === 0);
    }

    return insights;
  }, [insights, segmentFilter]);

  const servicePreferences = useMemo(() => {
    const counts = reservations.reduce<Record<string, Set<number>>>((acc, reservation) => {
      const serviceName = reservation.service?.name ?? 'Hizmet bilgisi yok';
      const customerId = reservation.customer?.id;
      if (!customerId) {
        return acc;
      }
      if (!acc[serviceName]) {
        acc[serviceName] = new Set();
      }
      acc[serviceName].add(customerId);
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([serviceName, customerSet]) => ({
        serviceName,
        uniqueCustomers: customerSet.size,
      }))
      .sort((a, b) => b.uniqueCustomers - a.uniqueCustomers)
      .slice(0, 5);
  }, [reservations]);

  const pendingFollowUps = useMemo(() => {
    return reservations
      .filter(reservation => reservation.status === 'PENDING')
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
      .slice(0, 5)
      .map(reservation => {
        const customerName = [reservation.customer?.firstName, reservation.customer?.lastName].filter(Boolean).join(' ') || 'Müşteri';
        const serviceName = reservation.service?.name ?? 'Hizmet bilgisi yok';
        return {
          id: reservation.id,
          title: serviceName,
          owner: customerName,
          due: dayjs(reservation.date).format('DD MMM YYYY HH:mm'),
          status: reservation.status,
        };
      });
  }, [reservations]);

  return (
    <main className="workspace-page customers-page">
      <Topbar />
      <header className="workspace-header">
        <div>
          <Text className="workspace-eyebrow">Müşteri Analitiği</Text>
          <Title level={2}>Müşteri Deneyimi Merkezi</Title>
          <Text className="workspace-subtitle">
            Sadakat üyelerinizi tanıyın, segment performansını takip edin ve kişiselleştirilmiş aksiyonlarla gelir etkisini artırın.
          </Text>
        </div>
        <Space size={16} className="workspace-actions" wrap>
          <Select
            value={segmentFilter}
            onChange={value => setSegmentFilter(value)}
            options={[
              { label: 'Tüm Müşteriler', value: 'all' },
              { label: 'Tekrar Eden', value: 'loyal' },
              { label: 'Pasif', value: 'inactive' },
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
                    percent={Math.min(100, highlight.progress)}
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
                  <Text className="workspace-stat-label">Müşteri Profilleri</Text>
                  <Title level={4}>İlişki Durumu</Title>
                </div>
                <Tag icon={<CrownOutlined />} className="workspace-pill">
                  {customersWithReservations} aktif müşteri
                </Tag>
              </div>
              <List
                className="customers-list"
                dataSource={filteredInsights}
                locale={{ emptyText: <Empty description="Kayıt bulunamadı." /> }}
                renderItem={customer => (
                  <List.Item className="customers-item" key={customer.id}>
                    <List.Item.Meta
                      avatar={<Avatar>{(customer.firstName || customer.lastName || '?').charAt(0)}</Avatar>}
                      title={`${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim() || customer.email}
                      description={
                        <div className="customers-interests">
                          <Tag color="blue">{customer.email}</Tag>
                          <Tag color="cyan">{customer.phone}</Tag>
                          <Tag color="purple">{`${customer.reservationCount} rezervasyon`}</Tag>
                        </div>
                      }
                    />
                    <div className="customers-meta">
                      <Text className="customers-meta-label">Son Rezervasyon</Text>
                      <Text className="customers-meta-value">
                        {customer.lastReservation ? dayjs(customer.lastReservation).format('DD MMM YYYY') : 'Kayıt yok'}
                      </Text>
                      <Text className="customers-meta-label">Bekleyen</Text>
                      <Text className="customers-meta-value">
                        {customer.nextReservation
                          ? `${dayjs(customer.nextReservation).format('DD MMM HH:mm')} · ${customer.nextStatus ?? ''}`
                          : 'Aktif işlem yok'}
                      </Text>
                      <Text className="customers-meta-label">Toplam Ödeme</Text>
                      <Text className="customers-meta-value">{currencyFormatter.format(customer.totalPaid)}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            <Card className="workspace-card customers-segments-card" bordered={false}>
              <div className="workspace-card-header">
                <div>
                  <Text className="workspace-stat-label">Hizmet Tercihleri</Text>
                  <Title level={4}>En Popüler Seçimler</Title>
                </div>
                <Tag icon={<HeartOutlined />} className="workspace-pill">
                  {servicePreferences.length} kategori
                </Tag>
              </div>
              <div className="customers-segments">
                {servicePreferences.length > 0 ? (
                  servicePreferences.map(preference => (
                    <div key={preference.serviceName} className="customers-segment-item">
                      <div className="customers-segment-header">
                        <Text className="customers-segment-name">{preference.serviceName}</Text>
                        <Text className="customers-segment-value">{preference.uniqueCustomers} müşteri</Text>
                      </div>
                      <Progress
                        percent={Math.min(100, Math.round((preference.uniqueCustomers / (totalCustomers || 1)) * 100))}
                        strokeColor="#2563eb"
                        trailColor="rgba(148, 163, 184, 0.18)"
                        strokeLinecap="round"
                      />
                    </div>
                  ))
                ) : (
                  <Empty description="Hizmet tercih verisi bulunmuyor." image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>

              <div className="customers-follow-ups">
                <div className="customers-follow-ups-header">
                  <Text className="workspace-stat-label">Takip Gerektiren Rezervasyonlar</Text>
                  <Tag icon={<CustomerServiceOutlined />} className="workspace-pill">
                    {pendingFollowUps.length} kayıt
                  </Tag>
                </div>
                <List
                  dataSource={pendingFollowUps}
                  locale={{ emptyText: <Empty description="Bekleyen rezervasyon bulunmuyor." /> }}
                  renderItem={item => (
                    <List.Item key={item.id} className="customers-follow-up-item">
                      <div className="customers-follow-up-main">
                        <Text className="customers-follow-up-title">{item.title}</Text>
                        <Text className="customers-follow-up-owner">{item.owner}</Text>
                      </div>
                      <div className="customers-follow-up-meta">
                        <Tag color="gold" icon={<SmileOutlined />}>
                          {item.due}
                        </Tag>
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

export default Customers;
