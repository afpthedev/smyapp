import React, { useEffect, useMemo, useState } from 'react';
import { Card, DatePicker, Empty, List, Select, Skeleton, Space, Statistic, Table, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import Topbar from '../../components/Topbar';
import { customerApi } from '../../services/api';
import '../../styles/workspace.css';
import './styles.css';

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
};

type ReservationItem = {
  id: number;
  date: string;
  status: ReservationStatus;
  notes?: string;
  service?: { id: number; name?: string } | null;
};

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

type CustomerSummary = {
  customerFullName?: string;
  totalReservations: number;
  upcomingReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  lastReservationDate?: string;
  nextReservationDate?: string;
};

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const statusColors: Record<ReservationStatus, string> = {
  PENDING: 'gold',
  CONFIRMED: 'green',
  CANCELLED: 'red',
  COMPLETED: 'blue',
};

const statusLabels: Record<ReservationStatus, string> = {
  PENDING: 'Beklemede',
  CONFIRMED: 'Onaylandı',
  CANCELLED: 'İptal',
  COMPLETED: 'Tamamlandı',
};

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [summary, setSummary] = useState<CustomerSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | undefined>();
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [reservationPagination, setReservationPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const response = await customerApi.list({ page: 0, size: 50, sort: 'lastName,asc' });
        const data: Customer[] = response.data ?? [];
        setCustomers(data);
        if (data.length > 0) {
          setSelectedCustomerId(data[0].id);
        }
      } catch (error) {
        console.error('Müşteri listesi yüklenemedi', error);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const loadReservations = async () => {
      if (!selectedCustomerId) {
        setSummary(null);
        setReservations([]);
        setReservationPagination(prev => ({ ...prev, total: 0 }));
        return;
      }
      setReservationsLoading(true);
      try {
        const params: Record<string, unknown> = {
          page: reservationPagination.current - 1,
          size: reservationPagination.pageSize,
          sort: 'date,desc',
        };
        if (statusFilter) {
          params.status = statusFilter;
        }
        if (dateRange) {
          params.start = dateRange[0].toISOString();
          params.end = dateRange[1].toISOString();
        }

        const [summaryResponse, reservationsResponse] = await Promise.all([
          customerApi.reservationSummary(selectedCustomerId),
          customerApi.reservations(selectedCustomerId, params),
        ]);

        setSummary(summaryResponse.data);
        setReservations(reservationsResponse.data ?? []);
        const totalCountHeader = reservationsResponse.headers?.['x-total-count'];
        const total = totalCountHeader ? Number.parseInt(totalCountHeader, 10) : (reservationsResponse.data?.length ?? 0);
        setReservationPagination(prev => ({ ...prev, total: Number.isNaN(total) ? 0 : total }));
      } catch (error) {
        console.error('Rezervasyonlar yüklenirken hata oluştu', error);
      } finally {
        setReservationsLoading(false);
      }
    };

    loadReservations();
  }, [selectedCustomerId, statusFilter, dateRange, reservationPagination.current, reservationPagination.pageSize]);

  const handleCustomerSelect = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setReservationPagination(prev => ({ ...prev, current: 1 }));
  };

  const summaryCards = useMemo(
    () => [
      {
        label: 'Toplam Rezervasyon',
        value: summary?.totalReservations ?? 0,
      },
      {
        label: 'Beklemede',
        value: summary?.pendingReservations ?? 0,
      },
      {
        label: 'Onaylanan',
        value: summary?.confirmedReservations ?? 0,
      },
      {
        label: 'Tamamlanan',
        value: summary?.completedReservations ?? 0,
      },
      {
        label: 'İptal Edilen',
        value: summary?.cancelledReservations ?? 0,
      },
    ],
    [summary],
  );

  const reservationsColumns = [
    {
      title: 'Rezervasyon Tarihi',
      dataIndex: 'date',
      key: 'date',
      render: (value: string) => dayjs(value).format('DD MMM YYYY · HH:mm'),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: ReservationStatus) => (
        <Tag color={statusColors[status]} className="customers-status-tag">
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: 'Notlar',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (notes?: string) => notes || '—',
    },
  ];

  return (
    <main className="workspace-page customers-page">
      <Topbar />
      <header className="workspace-header">
        <div>
          <Text className="workspace-eyebrow">Misafir Analitiği</Text>
          <Title level={2}>Müşteri Rezervasyon Merkezi</Title>
          <Text className="workspace-subtitle">
            Müşterilerinizin rezervasyon geçmişini analiz edin, ileri tarihlerdeki planları takip edin ve aksiyon alın.
          </Text>
        </div>
        <Space size={16} className="workspace-actions" wrap>
          <Tag icon={<TeamOutlined />} className="workspace-pill">
            {customers.length} kayıt
          </Tag>
          <Tag icon={<CalendarOutlined />} className="workspace-pill">
            {summary?.upcomingReservations ?? 0} yaklaşan
          </Tag>
        </Space>
      </header>

      <section className="customers-layout">
        <Card className="customers-list-card" bordered={false} title="Müşteriler">
          {loadingCustomers ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <List
              className="customers-list"
              dataSource={customers}
              locale={{ emptyText: <Empty description="Kayıtlı müşteri bulunamadı" /> }}
              renderItem={customer => {
                const isSelected = customer.id === selectedCustomerId;
                return (
                  <List.Item
                    key={customer.id}
                    className={`customers-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCustomerSelect(customer.id)}
                  >
                    <List.Item.Meta
                      title={`${customer.firstName} ${customer.lastName}`}
                      description={
                        <div className="customers-item-meta">
                          <span>{customer.email}</span>
                          <span>{customer.phone}</span>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}
        </Card>

        <Space direction="vertical" size={24} className="customers-detail-column">
          <Card bordered={false} className="customers-summary-card">
            {summary ? (
              <>
                <div className="customers-summary-header">
                  <div>
                    <Text className="workspace-stat-label">Seçili Müşteri</Text>
                    <Title level={4}>{summary.customerFullName ?? 'Müşteri'}</Title>
                  </div>
                  <Tag color="blue" className="workspace-pill">
                    Toplam {summary.totalReservations}
                  </Tag>
                </div>
                <div className="customers-summary-grid">
                  {summaryCards.map(card => (
                    <Statistic key={card.label} title={card.label} value={card.value} />
                  ))}
                </div>
                <div className="customers-summary-meta">
                  <Text>
                    Son rezervasyon: {summary.lastReservationDate ? dayjs(summary.lastReservationDate).format('DD MMM YYYY HH:mm') : '—'}
                  </Text>
                  <Text>
                    Sıradaki rezervasyon:{' '}
                    {summary.nextReservationDate ? dayjs(summary.nextReservationDate).format('DD MMM YYYY HH:mm') : '—'}
                  </Text>
                </div>
              </>
            ) : (
              <Empty description="Müşteri seçiniz" />
            )}
          </Card>

          <Card bordered={false} className="customers-reservations-card" title="Rezervasyonlar">
            <Space className="customers-filters" size={12} wrap>
              <Select
                allowClear
                placeholder="Durum seçin"
                value={statusFilter}
                onChange={value => {
                  setStatusFilter(value as ReservationStatus | undefined);
                  setReservationPagination(prev => ({ ...prev, current: 1 }));
                }}
                options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
                className="customers-filter-control"
              />
              <RangePicker
                value={dateRange as [Dayjs, Dayjs] | null}
                onChange={values => {
                  setDateRange(values as [Dayjs, Dayjs] | null);
                  setReservationPagination(prev => ({ ...prev, current: 1 }));
                }}
                allowClear
                className="customers-filter-control"
              />
            </Space>
            <Table<ReservationItem>
              className="customers-reservations-table"
              dataSource={reservations}
              columns={reservationsColumns}
              pagination={{
                current: reservationPagination.current,
                pageSize: reservationPagination.pageSize,
                total: reservationPagination.total,
                showSizeChanger: true,
                showTotal: total => `${total} rezervasyon`,
              }}
              rowKey="id"
              loading={reservationsLoading}
              locale={{
                emptyText: selectedCustomerId ? (
                  <Empty description="Filtrelere uygun rezervasyon bulunamadı" />
                ) : (
                  <Empty description="Müşteri seçiniz" />
                ),
              }}
              onChange={pagination => {
                setReservationPagination(prev => ({
                  ...prev,
                  current: pagination.current ?? prev.current,
                  pageSize: pagination.pageSize ?? prev.pageSize,
                }));
              }}
            />
          </Card>
        </Space>
      </section>
    </main>
  );
};

export default Customers;
