import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Progress,
  Select,
  Space,
  Spin,
  Tag,
  Timeline,
  Typography,
  message,
} from 'antd';
import { CalendarOutlined, ClockCircleOutlined, LineChartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Topbar from '../../components/Topbar';
import '../../styles/workspace.css';
import './styles.css';
import { reservationService, type Reservation, type ReservationStatus } from '../../services/api';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

type StatusFilter = 'all' | ReservationStatus;
type TimeFilter = 'today' | 'tomorrow' | 'week';

const statusLabels: Record<ReservationStatus, string> = {
  PENDING: 'Onay bekliyor',
  CONFIRMED: 'Onaylandı',
  CANCELLED: 'İptal edildi',
  COMPLETED: 'Tamamlandı',
};

const statusColors: Record<ReservationStatus, string> = {
  PENDING: 'processing',
  CONFIRMED: 'success',
  CANCELLED: 'error',
  COMPLETED: 'default',
};

const timelineColors: Record<ReservationStatus, string> = {
  PENDING: '#2563eb',
  CONFIRMED: '#16a34a',
  CANCELLED: '#dc2626',
  COMPLETED: '#6b7280',
};

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [form] = Form.useForm<{ date: Dayjs; status: ReservationStatus; notes?: string }>();

  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reservationService.list({ page: 0, size: 200, sort: 'date,desc' });
      setReservations(response.items);
      setError(null);
    } catch {
      setError('Rezervasyon verileri alınamadı.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleCreateReservation = async (values: { date: Dayjs; status: ReservationStatus; notes?: string }) => {
    try {
      setCreateLoading(true);
      await reservationService.create({
        date: values.date.toISOString(),
        status: values.status,
        notes: values.notes,
      });
      message.success('Rezervasyon başarıyla oluşturuldu.');
      setCreateModalOpen(false);
      form.resetFields();
      await loadReservations();
    } catch {
      message.error('Rezervasyon oluşturulurken bir hata meydana geldi.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenApproveModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setApprovalNotes(reservation.notes ?? '');
    setApproveModalOpen(true);
  };

  const handleCloseApproveModal = () => {
    setApproveModalOpen(false);
    setSelectedReservation(null);
    setApprovalNotes('');
  };

  const handleApproveReservation = async () => {
    if (!selectedReservation) {
      return;
    }
    try {
      setApproveLoading(true);
      await reservationService.approve(selectedReservation.id, {
        notes: approvalNotes.trim() ? approvalNotes.trim() : undefined,
      });
      message.success('Rezervasyon başarıyla onaylandı.');
      handleCloseApproveModal();
      await loadReservations();
    } catch {
      message.error('Rezervasyon onaylanırken bir hata meydana geldi.');
    } finally {
      setApproveLoading(false);
    }
  };

  const reservationHighlights = useMemo(() => {
    const total = reservations.length;
    const upcoming = reservations.filter(reservation => dayjs(reservation.date).isAfter(dayjs())).length;
    const pending = reservations.filter(reservation => reservation.status === 'PENDING').length;
    const confirmed = reservations.filter(reservation => reservation.status === 'CONFIRMED').length;
    const cancelled = reservations.filter(reservation => reservation.status === 'CANCELLED').length;

    return [
      {
        title: 'Toplam Rezervasyon',
        value: total,
        helper: `${confirmed + pending} aktif işlem`,
        progress: total ? Math.round(((confirmed + pending) / total) * 100) : 0,
        accent: '#2563eb',
      },
      {
        title: 'Yaklaşan Rezervasyon',
        value: upcoming,
        helper: `${total ? Math.round((upcoming / total) * 100) : 0}% gelecek`,
        progress: total ? Math.round((upcoming / total) * 100) : 0,
        accent: '#38bdf8',
      },
      {
        title: 'Onay Bekleyen',
        value: pending,
        helper: `${total ? Math.round((pending / total) * 100) : 0}% oran`,
        progress: total ? Math.round((pending / total) * 100) : 0,
        accent: '#f97316',
      },
      {
        title: 'İptal Edilen',
        value: cancelled,
        helper: `${total ? Math.round((cancelled / total) * 100) : 0}% oran`,
        progress: total ? Math.round((cancelled / total) * 100) : 0,
        accent: '#10b981',
      },
    ];
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    return reservations
      .filter(reservation => {
        const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;

        let matchesTime = true;
        if (timeFilter === 'today') {
          matchesTime = dayjs(reservation.date).isSame(dayjs(), 'day');
        } else if (timeFilter === 'tomorrow') {
          matchesTime = dayjs(reservation.date).isSame(dayjs().add(1, 'day'), 'day');
        } else if (timeFilter === 'week') {
          matchesTime = dayjs(reservation.date).isBetween(dayjs().startOf('week'), dayjs().endOf('week'), 'day', '[]');
        }

        return matchesStatus && matchesTime;
      })
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  }, [reservations, statusFilter, timeFilter]);

  const statusDistribution = useMemo(() => {
    const total = reservations.length || 1;
    const counts: Record<ReservationStatus, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      CANCELLED: 0,
      COMPLETED: 0,
    };

    reservations.forEach(reservation => {
      counts[reservation.status] += 1;
    });

    return (Object.keys(counts) as ReservationStatus[]).map(status => ({
      status,
      count: counts[status],
      ratio: Math.round((counts[status] / total) * 100),
    }));
  }, [reservations]);

  const timelineEntries = useMemo(() => {
    const todaysReservations = reservations
      .filter(reservation => dayjs(reservation.date).isSame(dayjs(), 'day'))
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

    if (!todaysReservations.length) {
      return [
        {
          color: '#94a3b8',
          children: <Text>Bugün için planlanmış rezervasyon bulunmuyor.</Text>,
        },
      ];
    }

    return todaysReservations.map(reservation => {
      const customerName = [reservation.customer?.firstName, reservation.customer?.lastName].filter(Boolean).join(' ') || 'Müşteri';
      const serviceName = reservation.service?.name ?? 'Hizmet bilgisi yok';
      return {
        color: timelineColors[reservation.status],
        dot: <ClockCircleOutlined style={{ fontSize: 14 }} />,
        children: (
          <div className="reservations-timeline-item">
            <Text className="reservations-timeline-time">{dayjs(reservation.date).format('HH:mm')}</Text>
            <Text className="reservations-timeline-title">{statusLabels[reservation.status]}</Text>
            <Text className="reservations-timeline-description">{`${customerName} · ${serviceName}`}</Text>
          </div>
        ),
      };
    });
  }, [reservations]);

  const statusOptions = useMemo(
    () =>
      (Object.keys(statusLabels) as ReservationStatus[]).map(status => ({
        label: statusLabels[status],
        value: status,
      })),
    [],
  );

  return (
    <>
      <main className="workspace-page reservations-page">
        <Topbar />
        <header className="workspace-header">
          <div>
            <Text className="workspace-eyebrow">Operasyon Kontrolü</Text>
            <Title level={2}>Rezervasyon Yönetimi</Title>
            <Text className="workspace-subtitle">
              Günlük rezervasyon akışınızı takip edin, yoğunluk noktalarını analiz edin ve ekibinizin odaklanması gereken adımları
              planlayın.
            </Text>
          </div>
          <Space size={16} className="workspace-actions" wrap>
            <RangePicker suffixIcon={<CalendarOutlined />} />
            <Select
              defaultValue="today"
              value={timeFilter}
              onChange={value => setTimeFilter(value as TimeFilter)}
              options={[
                { label: 'Bugün', value: 'today' },
                { label: 'Yarın', value: 'tomorrow' },
                { label: 'Bu Hafta', value: 'week' },
              ]}
            />
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              Yeni Rezervasyon
            </Button>
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
                    <Progress
                      percent={Math.min(100, stat.progress)}
                      strokeColor={stat.accent}
                      trailColor="rgba(148, 163, 184, 0.18)"
                      strokeLinecap="round"
                    />
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
                  <Tag icon={<LineChartOutlined />} className="workspace-pill">
                    {reservations.length} kayıt
                  </Tag>
                </div>
                <div className="reservations-filters">
                  <Select
                    value={statusFilter}
                    onChange={value => setStatusFilter(value as StatusFilter)}
                    options={[
                      { label: 'Tümü', value: 'all' },
                      { label: 'Onaylı', value: 'CONFIRMED' },
                      { label: 'Onay Bekliyor', value: 'PENDING' },
                      { label: 'Tamamlanan', value: 'COMPLETED' },
                      { label: 'İptal', value: 'CANCELLED' },
                    ]}
                  />
                  <Select
                    value={timeFilter}
                    onChange={value => setTimeFilter(value as TimeFilter)}
                    options={[
                      { label: 'Bugün', value: 'today' },
                      { label: 'Yarın', value: 'tomorrow' },
                      { label: 'Bu Hafta', value: 'week' },
                    ]}
                  />
                </div>
                <List
                  className="reservations-list"
                  dataSource={filteredReservations}
                  locale={{ emptyText: <Empty description="Seçilen filtrelerle eşleşen kayıt bulunmuyor." /> }}
                  renderItem={item => {
                    const customerName = [item.customer?.firstName, item.customer?.lastName].filter(Boolean).join(' ') || 'Müşteri';
                    const serviceName = item.service?.name ?? 'Hizmet bilgisi yok';
                    return (
                      <List.Item className="reservations-item" key={item.id}>
                        <List.Item.Meta
                          avatar={<Avatar>{customerName.charAt(0)}</Avatar>}
                          title={customerName}
                          description={<span className="reservations-service">{serviceName}</span>}
                        />
                        <div className="reservations-meta">
                          <Text className="reservations-time">{dayjs(item.date).format('DD MMM YYYY HH:mm')}</Text>
                          <Tag color={statusColors[item.status]} className="reservations-status">
                            {statusLabels[item.status]}
                          </Tag>
                          {item.status === 'PENDING' && (
                            <Button type="primary" size="small" onClick={() => handleOpenApproveModal(item)}>
                              Onayla
                            </Button>
                          )}
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </Card>

              <Card className="workspace-card reservations-channel-card" bordered={false}>
                <div className="workspace-card-header">
                  <div>
                    <Text className="workspace-stat-label">Durum Dağılımı</Text>
                    <Title level={4}>Operasyon Özeti</Title>
                  </div>
                  <Tag icon={<ThunderboltOutlined />} className="workspace-pill">
                    Gerçek zamanlı
                  </Tag>
                </div>
                <div className="reservations-channel-list">
                  {statusDistribution.map(item => (
                    <div key={item.status} className="reservations-channel-item">
                      <div className="reservations-channel-header">
                        <Text className="reservations-channel-name">{statusLabels[item.status]}</Text>
                        <Text className="reservations-channel-value">%{item.ratio}</Text>
                      </div>
                      <Progress percent={item.ratio} strokeColor="#2563eb" trailColor="rgba(148, 163, 184, 0.16)" strokeLinecap="round" />
                    </div>
                  ))}
                </div>

                <div className="reservations-timeline-card">
                  <Text className="workspace-stat-label">Bugünkü İş Akışı</Text>
                  <Timeline className="reservations-timeline" items={timelineEntries} />
                </div>
              </Card>
            </section>
          </>
        )}
      </main>
      <Modal
        title="Yeni Rezervasyon Oluştur"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createLoading}
        okText="Kaydet"
        cancelText="İptal"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateReservation} initialValues={{ status: 'PENDING' as ReservationStatus }}>
          <Form.Item name="date" label="Rezervasyon Tarihi" rules={[{ required: true, message: 'Rezervasyon tarihini seçiniz.' }]}>
            <DatePicker showTime format="DD.MM.YYYY HH:mm" className="reservation-create-date-picker" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Durum" rules={[{ required: true, message: 'Rezervasyon durumunu belirtiniz.' }]}>
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item name="notes" label="Notlar">
            <Input.TextArea rows={3} placeholder="Opsiyonel açıklama ekleyebilirsiniz." />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Rezervasyonu Onayla"
        open={approveModalOpen}
        onCancel={handleCloseApproveModal}
        onOk={handleApproveReservation}
        confirmLoading={approveLoading}
        okText="Onayla"
        cancelText="Vazgeç"
        okButtonProps={{ disabled: !selectedReservation }}
      >
        {selectedReservation ? (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div className="reservations-approve-details">
              <Text strong>
                {[selectedReservation.customer?.firstName, selectedReservation.customer?.lastName].filter(Boolean).join(' ') || 'Müşteri'}
              </Text>
              <Text type="secondary">{selectedReservation.service?.name ?? 'Hizmet bilgisi yok'}</Text>
              <Text className="reservations-approve-time">{dayjs(selectedReservation.date).format('DD MMM YYYY · HH:mm')}</Text>
            </div>
            <Form layout="vertical">
              <Form.Item label="Yönetici Notu">
                <Input.TextArea
                  rows={3}
                  value={approvalNotes}
                  onChange={event => setApprovalNotes(event.target.value)}
                  placeholder="Onayla beraber iletmek istediğiniz notu ekleyebilirsiniz."
                />
              </Form.Item>
            </Form>
          </Space>
        ) : (
          <div className="reservations-approve-loading">
            <Spin />
          </div>
        )}
      </Modal>
    </>
  );
};

export default Reservations;
