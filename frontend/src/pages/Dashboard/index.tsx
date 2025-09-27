import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Card, DatePicker, Empty, List, Progress, Select, Skeleton, Space, Tag, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, CalendarOutlined, DollarCircleOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import Topbar from '../../components/Topbar';
import { reservationApi } from '../../services/api';
import './styles.css';

type ReservationReport = {
  totalReservations: number;
  distinctCustomers: number;
  distinctBusinesses: number;
  upcomingReservations: number;
  statusCounts: Record<string, number>;
};

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

type ReservationListItem = {
  id: number;
  date: string;
  status: ReservationStatus;
  notes?: string;
};

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const statusLabels: Record<ReservationStatus, string> = {
  PENDING: 'Beklemede',
  CONFIRMED: 'Onaylandı',
  CANCELLED: 'İptal',
  COMPLETED: 'Tamamlandı',
};

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('day'), dayjs().endOf('day')]);
  const [report, setReport] = useState<ReservationReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [upcomingReservations, setUpcomingReservations] = useState<ReservationListItem[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);

  useEffect(() => {
    if (period === 'today') {
      setRange([dayjs().startOf('day'), dayjs().endOf('day')]);
    } else if (period === 'week') {
      setRange([dayjs().startOf('week'), dayjs().endOf('week')]);
    } else if (period === 'month') {
      setRange([dayjs().startOf('month'), dayjs().endOf('month')]);
    }
  }, [period]);

  useEffect(() => {
    const fetchReport = async () => {
      setLoadingReport(true);
      try {
        const response = await reservationApi.report({
          start: range[0].toISOString(),
          end: range[1].toISOString(),
        });
        setReport(response.data as ReservationReport);
      } catch (error) {
        console.error('Rezervasyon raporu yüklenemedi', error);
        setReport(null);
      } finally {
        setLoadingReport(false);
      }
    };

    fetchReport();
  }, [range]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoadingUpcoming(true);
      try {
        const response = await reservationApi.upcoming({ size: 5, sort: 'date,asc' });
        setUpcomingReservations(response.data as ReservationListItem[]);
      } catch (error) {
        console.error('Yaklaşan rezervasyonlar yüklenemedi', error);
        setUpcomingReservations([]);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    fetchUpcoming();
  }, []);

  const statusCounts = report?.statusCounts ?? {};
  const pending = statusCounts.PENDING ?? 0;
  const confirmed = statusCounts.CONFIRMED ?? 0;
  const cancelled = statusCounts.CANCELLED ?? 0;
  const completed = statusCounts.COMPLETED ?? 0;

  const reservationStats = useMemo(
    () => [
      {
        title: 'Toplam Rezervasyon',
        value: report?.totalReservations ?? 0,
        change: `${report?.upcomingReservations ?? 0} yaklaşan`,
        trend: 'up',
        descriptor: 'seçili tarih aralığı',
      },
      {
        title: 'Bekleyen Rezervasyonlar',
        value: pending,
        change: `${confirmed} onaylandı`,
        trend: pending > confirmed ? 'down' : 'up',
        descriptor: 'işlem bekleyen kayıtlar',
      },
      {
        title: 'İptaller',
        value: cancelled,
        change: `${completed} tamamlandı`,
        trend: cancelled > 0 ? 'down' : 'up',
        descriptor: 'iptal edilen rezervasyonlar',
      },
    ],
    [report?.totalReservations, report?.upcomingReservations, pending, confirmed, cancelled, completed],
  );

  const occupancyMetrics = useMemo(
    () => [
      {
        label: 'Yaklaşan Rezervasyon',
        value: report?.upcomingReservations ?? 0,
        accent: '#2563eb',
        denominator: Math.max(report?.totalReservations ?? 1, 1),
      },
      {
        label: 'Benzersiz Müşteri',
        value: report?.distinctCustomers ?? 0,
        accent: '#38bdf8',
        denominator: Math.max(report?.totalReservations ?? 1, 1),
      },
      {
        label: 'Aktif İşletme',
        value: report?.distinctBusinesses ?? 0,
        accent: '#6366f1',
        denominator: Math.max(report?.distinctBusinesses ?? 1, 1),
      },
    ],
    [report?.upcomingReservations, report?.distinctCustomers, report?.distinctBusinesses, report?.totalReservations],
  );

  const statusBreakdown = [
    { label: 'Beklemede', value: pending, trend: pending > 0 ? '+%' : '0%' },
    { label: 'Onaylandı', value: confirmed, trend: confirmed > 0 ? '+%' : '0%' },
    { label: 'Tamamlandı', value: completed, trend: completed > 0 ? '+%' : '0%' },
  ];

  return (
    <main className="dashboard-page">
      <Topbar />
      <header className="dashboard-header">
        <div>
          <Text className="dashboard-eyebrow">Genel Bakış</Text>
          <Title level={2}>Rezervasyon Paneli</Title>
          <Text className="dashboard-subtitle">
            Operasyonel görünürlüğü artırmak için rezervasyon dağılımlarını, yaklaşan talepleri ve müşteri etkileşimlerini izleyin.
          </Text>
        </div>
        <Space size={16} className="dashboard-actions" wrap>
          <RangePicker
            value={range}
            onChange={values => {
              if (values && values[0] && values[1]) {
                setRange([values[0], values[1]] as [Dayjs, Dayjs]);
                setPeriod('custom');
              }
            }}
            suffixIcon={<CalendarOutlined />}
            className="dashboard-range-picker"
            popupClassName="dashboard-picker-dropdown"
          />
          <Select
            className="dashboard-select"
            value={period}
            onChange={value => setPeriod(value as 'today' | 'week' | 'month' | 'custom')}
            options={[
              { label: 'Bugün', value: 'today' },
              { label: 'Bu Hafta', value: 'week' },
              { label: 'Bu Ay', value: 'month' },
              { label: 'Özel Aralık', value: 'custom', disabled: period !== 'custom' },
            ]}
          />
        </Space>
      </header>

      <section className="dashboard-stat-grid">
        {reservationStats.map(stat => (
          <Card key={stat.title} className="dashboard-stat-card" bordered={false}>
            <Skeleton loading={loadingReport} active paragraph={false}>
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
            </Skeleton>
          </Card>
        ))}
      </section>

      <section className="dashboard-panels">
        <Card className="dashboard-card" bordered={false}>
          <div className="dashboard-card-header">
            <div>
              <Text className="dashboard-card-eyebrow">Yaklaşan Rezervasyonlar</Text>
              <Title level={4}>Önceliklendirilmiş Misafir Akışı</Title>
            </div>
            <Tag icon={<TeamOutlined />} color="blue" className="dashboard-pill">
              {report?.upcomingReservations ?? 0} misafir
            </Tag>
          </div>
          <List
            className="dashboard-reservation-list"
            dataSource={upcomingReservations}
            loading={loadingUpcoming}
            locale={{ emptyText: <Empty description="Yaklaşan rezervasyon bulunmuyor" /> }}
            renderItem={item => (
              <List.Item className="dashboard-reservation-item" key={item.id}>
                <List.Item.Meta
                  avatar={<Avatar>#{item.id}</Avatar>}
                  title={`Rezervasyon #${item.id}`}
                  description={dayjs(item.date).format('DD MMM YYYY · HH:mm')}
                />
                <div className="reservation-meta">
                  <Text className="reservation-time">{statusLabels[item.status]}</Text>
                  <Tag className="reservation-status">{item.status}</Tag>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Card className="dashboard-card" bordered={false}>
          <div className="dashboard-card-header">
            <div>
              <Text className="dashboard-card-eyebrow">Dağılım Analizi</Text>
              <Title level={4}>Kaynak Optimizasyonu</Title>
            </div>
            <Tag icon={<DollarCircleOutlined />} color="cyan" className="dashboard-pill">
              {report?.distinctCustomers ?? 0} müşteri
            </Tag>
          </div>
          <Skeleton loading={loadingReport} active paragraph={{ rows: 4 }}>
            <div className="dashboard-occupancy">
              {occupancyMetrics.map(metric => {
                const percent = Math.min(100, Math.round((metric.value / metric.denominator) * 100));
                return (
                  <div key={metric.label} className="occupancy-item">
                    <div className="occupancy-label-row">
                      <Text className="occupancy-label">{metric.label}</Text>
                      <Text className="occupancy-value">{metric.value}</Text>
                    </div>
                    <Progress
                      percent={percent}
                      size="small"
                      strokeLinecap="round"
                      strokeColor={metric.accent}
                      trailColor="rgba(148, 163, 184, 0.15)"
                    />
                  </div>
                );
              })}
            </div>
            <div className="dashboard-revenue">
              {statusBreakdown.map(item => (
                <div key={item.label} className="revenue-item">
                  <Text className="revenue-label">{item.label}</Text>
                  <div className="revenue-value-group">
                    <Text className="revenue-value">{item.value}</Text>
                    <Tag className="revenue-trend tag-positive">{item.trend}</Tag>
                  </div>
                </div>
              ))}
            </div>
          </Skeleton>
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;
