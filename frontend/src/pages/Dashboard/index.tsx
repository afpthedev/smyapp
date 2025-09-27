import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Card, DatePicker, Empty, List, Progress, Select, Space, Spin, Tag, Typography } from 'antd';
import { CalendarOutlined, DollarCircleOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Topbar from '../../components/Topbar';
import {
  customerService,
  paymentService,
  reservationService,
  type Customer,
  type Payment,
  type Reservation,
  type ReservationStatus,
} from '../../services/api';
import './styles.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const statusColors: Record<ReservationStatus, string> = {
  PENDING: 'processing',
  CONFIRMED: 'success',
  CANCELLED: 'error',
  COMPLETED: 'default',
};

const statusLabels: Record<ReservationStatus, string> = {
  PENDING: 'Onay bekliyor',
  CONFIRMED: 'Onaylandı',
  CANCELLED: 'İptal edildi',
  COMPLETED: 'Tamamlandı',
};

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

const Dashboard: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [reservationResponse, paymentResponse, customerResponse] = await Promise.all([
          reservationService.list({ page: 0, size: 200, sort: 'date,desc' }),
          paymentService.list({ page: 0, size: 200, sort: 'id,desc' }),
          customerService.list({ page: 0, size: 200, sort: 'id,desc' }),
        ]);

        if (!isMounted) {
          return;
        }

        setReservations(reservationResponse.items);
        setPayments(paymentResponse.items);
        setCustomers(customerResponse.items);
      } catch {
        if (isMounted) {
          setError('Veriler yüklenirken bir sorun oluştu.');
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

  const reservationStats = useMemo(() => {
    const total = reservations.length;
    const today = reservations.filter(reservation => dayjs(reservation.date).isSame(dayjs(), 'day')).length;
    const confirmed = reservations.filter(reservation => reservation.status === 'CONFIRMED').length;
    const pending = reservations.filter(reservation => reservation.status === 'PENDING').length;
    const cancelled = reservations.filter(reservation => reservation.status === 'CANCELLED').length;
    const active = confirmed + pending;
    const cancellationRate = total ? ((cancelled / total) * 100).toFixed(1) : '0.0';

    return [
      {
        title: 'Bugünkü Rezervasyonlar',
        value: today,
        badge: total ? `${((today / total) * 100).toFixed(0)}%` : '0%',
        badgeTone: today > 0 ? 'positive' : 'neutral',
        descriptor: `Toplam kayıt: ${total}`,
      },
      {
        title: 'Onaylı Rezervasyonlar',
        value: confirmed,
        badge: total ? `${((confirmed / total) * 100).toFixed(0)}%` : '0%',
        badgeTone: confirmed > 0 ? 'positive' : 'neutral',
        descriptor: `Aktif rezervasyon: ${active}`,
      },
      {
        title: 'Bekleyen İşlemler',
        value: pending,
        badge: `${customers.length} müşteri`,
        badgeTone: pending > 0 ? 'warning' : 'neutral',
        descriptor: 'Onay için sırada',
      },
      {
        title: 'İptal Oranı',
        value: `${cancellationRate}%`,
        badge: `${cancelled} kayıt`,
        badgeTone: cancelled > 0 ? 'negative' : 'positive',
        descriptor: 'Operasyon kalitesi',
      },
    ];
  }, [reservations, customers]);

  const upcomingReservations = useMemo(() => {
    return reservations
      .filter(reservation => dayjs(reservation.date).isAfter(dayjs().subtract(1, 'day')))
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
      .slice(0, 5);
  }, [reservations]);

  const serviceDistribution = useMemo(() => {
    if (!reservations.length) {
      return [];
    }

    const counts = new Map<string, number>();
    reservations.forEach(reservation => {
      const label = reservation.service?.name ?? 'Hizmet bilgisi yok';
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });

    const total = reservations.length;

    return Array.from(counts.entries())
      .map(([label, count]) => ({
        label,
        count,
        ratio: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [reservations]);

  const revenueSummary = useMemo(() => {
    if (!payments.length) {
      return {
        total: 0,
        items: [],
      };
    }

    const sumByStatus = (status: string) =>
      payments.filter(payment => payment.status === status).reduce((total, payment) => total + Number(payment.amount ?? 0), 0);

    const paid = sumByStatus('PAID');
    const pending = sumByStatus('PENDING');
    const refunded = sumByStatus('REFUNDED');

    return {
      total: paid,
      items: [
        { key: 'paid', label: 'Tahsil Edilen', amount: paid, tone: 'positive' },
        { key: 'pending', label: 'Bekleyen Tahsilat', amount: pending, tone: pending > 0 ? 'warning' : 'neutral' },
        { key: 'refunded', label: 'İade Edilen', amount: refunded, tone: refunded > 0 ? 'negative' : 'neutral' },
      ],
    };
  }, [payments]);

  return (
    <main className="dashboard-page">
      <Topbar />
      <header className="dashboard-header">
        <div>
          <Text className="dashboard-eyebrow">Genel Bakış</Text>
          <Title level={2}>Rezervasyon Paneli</Title>
          <Text className="dashboard-subtitle">
            Güncel rezervasyonlarınızı takip edin, gelir durumunu görün ve ekip önceliklerini planlayın.
          </Text>
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

      {loading ? (
        <div className="dashboard-loading">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {error && (
            <div className="dashboard-error">
              <Text type="danger">{error}</Text>
            </div>
          )}

          <section className="dashboard-stat-grid">
            {reservationStats.map(stat => (
              <Card key={stat.title} className="dashboard-stat-card" bordered={false}>
                <Text className="stat-label">{stat.title}</Text>
                <div className="stat-value-row">
                  <Title level={2}>{stat.value}</Title>
                  <Tag className={`stat-tag tag-${stat.badgeTone}`}>{stat.badge}</Tag>
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
                  <Title level={4}>Operasyon Akışı</Title>
                </div>
                <Tag icon={<TeamOutlined />} color="blue" className="dashboard-pill">
                  {upcomingReservations.length} kayıt
                </Tag>
              </div>
              <List
                className="dashboard-reservation-list"
                dataSource={upcomingReservations}
                locale={{ emptyText: <Empty description="Yaklaşan rezervasyon bulunmuyor." /> }}
                renderItem={item => {
                  const customerName = [item.customer?.firstName, item.customer?.lastName].filter(Boolean).join(' ') || 'Müşteri';
                  const serviceName = item.service?.name ?? 'Hizmet bilgisi yok';
                  return (
                    <List.Item key={item.id} className="dashboard-reservation-item">
                      <List.Item.Meta avatar={<Avatar>{customerName.charAt(0)}</Avatar>} title={customerName} description={serviceName} />
                      <div className="reservation-meta">
                        <Text className="reservation-time">{dayjs(item.date).format('DD MMM YYYY HH:mm')}</Text>
                        <Tag color={statusColors[item.status]} className="reservation-status">
                          {statusLabels[item.status]}
                        </Tag>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </Card>

            <Card className="dashboard-card" bordered={false}>
              <div className="dashboard-card-header">
                <div>
                  <Text className="dashboard-card-eyebrow">Hizmet Dağılımı</Text>
                  <Title level={4}>Talep Edilen Kategoriler</Title>
                </div>
                <Tag icon={<DollarCircleOutlined />} color="cyan" className="dashboard-pill">
                  Toplam {reservations.length}
                </Tag>
              </div>
              <div className="dashboard-occupancy">
                {serviceDistribution.length > 0 ? (
                  serviceDistribution.map(metric => (
                    <div key={metric.label} className="occupancy-item">
                      <div className="occupancy-label-row">
                        <Text className="occupancy-label">{metric.label}</Text>
                        <Text className="occupancy-value">%{metric.ratio}</Text>
                      </div>
                      <Progress
                        percent={metric.ratio}
                        size="small"
                        strokeLinecap="round"
                        strokeColor="#2563eb"
                        trailColor="rgba(148, 163, 184, 0.15)"
                      />
                    </div>
                  ))
                ) : (
                  <Empty description="Hizmet verisi bulunmuyor" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
              <div className="dashboard-revenue">
                {revenueSummary.items.map(item => (
                  <div key={item.key} className="revenue-item">
                    <Text className="revenue-label">{item.label}</Text>
                    <div className="revenue-value-group">
                      <Text className="revenue-value">{currencyFormatter.format(item.amount)}</Text>
                      <Tag className={`revenue-trend tag-${item.tone}`}>
                        {item.tone === 'positive' ? '✓' : item.tone === 'negative' ? '↺' : '-'}
                      </Tag>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;
