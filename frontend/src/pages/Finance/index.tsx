import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Popconfirm,
  Progress,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  Upload,
  notification,
} from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FundProjectionScreenOutlined,
  PlusOutlined,
  RiseOutlined,
  StockOutlined,
  UploadOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Topbar from '../../components/Topbar';
import '../../styles/workspace.css';
import './styles.css';
import {
  financeDocumentService,
  financeEntryService,
  paymentService,
  type FinanceDocument,
  type FinanceEntry,
  type FinanceEntryType,
  type Payment,
  type PaymentStatus,
} from '../../services/api';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

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

interface EntryFormValues {
  entryDate: dayjs.Dayjs;
  type: FinanceEntryType;
  amount: number;
  description?: string;
}

const Finance: React.FC = () => {
  const [entryForm] = Form.useForm<EntryFormValues>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [entryLoading, setEntryLoading] = useState(true);
  const [entrySubmitting, setEntrySubmitting] = useState(false);
  const [uploadingInvoice, setUploadingInvoice] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<FinanceDocument | null>(null);

  const fetchFinanceEntries = useCallback(async () => {
    setEntryLoading(true);
    try {
      const financeEntries = await financeEntryService.list();
      const sortedEntries = [...financeEntries].sort((a, b) => dayjs(b.entryDate).valueOf() - dayjs(a.entryDate).valueOf());
      setEntries(sortedEntries);
    } catch (err) {
      console.error(err);
      notification.error({ message: 'Finans girişleri yüklenemedi.' });
    } finally {
      setEntryLoading(false);
    }
  }, []);

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

    fetchFinanceEntries();

    return () => {
      isMounted = false;
    };
  }, [fetchFinanceEntries]);

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

  const manualIncome = useMemo(
    () => entries.filter(entry => entry.type === 'INCOME').reduce((total, entry) => total + Number(entry.amount ?? 0), 0),
    [entries],
  );
  const manualExpense = useMemo(
    () => entries.filter(entry => entry.type === 'EXPENSE').reduce((total, entry) => total + Number(entry.amount ?? 0), 0),
    [entries],
  );
  const manualNet = manualIncome - manualExpense;

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

  const manualHighlights = useMemo(() => {
    const incomeCount = entries.filter(entry => entry.type === 'INCOME').length;
    const expenseCount = entries.filter(entry => entry.type === 'EXPENSE').length;

    return [
      {
        title: 'Manuel Gelirler',
        value: currencyFormatter.format(manualIncome),
        helper: `${incomeCount} kayıt`,
        accent: '#0ea5e9',
        icon: <PlusOutlined />,
      },
      {
        title: 'Manuel Giderler',
        value: currencyFormatter.format(manualExpense),
        helper: `${expenseCount} kayıt`,
        accent: '#ef4444',
        icon: <DeleteOutlined />,
      },
      {
        title: 'Net Bakiye',
        value: currencyFormatter.format(manualNet),
        helper: manualNet >= 0 ? 'Pozitif bakiye' : 'Negatif bakiye',
        accent: manualNet >= 0 ? '#22c55e' : '#f87171',
        icon: <WalletOutlined />,
      },
    ];
  }, [entries, manualIncome, manualExpense, manualNet]);

  const handleDownloadDocument = useCallback(async (fileMeta: FinanceDocument) => {
    try {
      const response = await financeDocumentService.download(fileMeta.id);
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: fileMeta.contentType }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileMeta.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      notification.error({ message: 'Fatura indirilemedi.' });
    }
  }, []);

  const handleEntrySubmit = useCallback(
    async (values: EntryFormValues) => {
      setEntrySubmitting(true);
      try {
        await financeEntryService.create({
          entryDate: values.entryDate.format('YYYY-MM-DD'),
          type: values.type,
          amount: Number(values.amount ?? 0),
          description: values.description,
          documentId: uploadedDocument?.id,
        });
        notification.success({ message: 'Finans kaydı eklendi.' });
        entryForm.resetFields();
        setUploadedDocument(null);
        fetchFinanceEntries();
      } catch (err) {
        console.error(err);
        notification.error({ message: 'Finans kaydı oluşturulamadı.' });
      } finally {
        setEntrySubmitting(false);
      }
    },
    [uploadedDocument, fetchFinanceEntries, entryForm],
  );

  const handleDeleteEntry = useCallback(
    async (id: number) => {
      try {
        await financeEntryService.delete(id);
        notification.success({ message: 'Finans kaydı silindi.' });
        fetchFinanceEntries();
      } catch (err) {
        console.error(err);
        notification.error({ message: 'Finans kaydı silinemedi.' });
      }
    },
    [fetchFinanceEntries],
  );

  const handleRemoveDocument = useCallback(() => {
    setUploadedDocument(null);
  }, []);

  const handleInvoiceUpload = useCallback<NonNullable<UploadProps['customRequest']>>(async options => {
    const { file, onSuccess, onError } = options;
    setUploadingInvoice(true);
    try {
      const uploaded = await financeDocumentService.upload(file as File);
      setUploadedDocument(uploaded);
      notification.success({ message: 'Fatura yüklendi.' });
      onSuccess?.(uploaded, file as File);
    } catch (err) {
      console.error(err);
      notification.error({ message: 'Fatura yüklenirken hata oluştu.' });
      onError?.(err as Error);
    } finally {
      setUploadingInvoice(false);
    }
  }, []);

  const uploadProps = useMemo<UploadProps>(
    () => ({
      accept: '.pdf,.xls,.xlsx',
      showUploadList: false,
      customRequest: handleInvoiceUpload,
      beforeUpload: file => {
        const allowedTypes = [
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        if (file.type && !allowedTypes.includes(file.type)) {
          notification.error({ message: 'Lütfen PDF veya Excel dosyası yükleyin.' });
          return Upload.LIST_IGNORE;
        }
        return true;
      },
    }),
    [handleInvoiceUpload],
  );

  const entryColumns = useMemo<ColumnsType<FinanceEntry>>(
    () => [
      {
        title: 'Tarih',
        dataIndex: 'entryDate',
        key: 'entryDate',
        render: value => <Text>{dayjs(value).format('DD MMM YYYY')}</Text>,
      },
      {
        title: 'Tür',
        dataIndex: 'type',
        key: 'type',
        render: (value: FinanceEntryType) => (
          <Tag color={value === 'INCOME' ? 'green' : 'red'} className="finance-entry-tag">
            {value === 'INCOME' ? 'Gelir' : 'Gider'}
          </Tag>
        ),
      },
      {
        title: 'Tutar',
        dataIndex: 'amount',
        key: 'amount',
        render: (value: number) => <Text strong>{currencyFormatter.format(Number(value ?? 0))}</Text>,
      },
      {
        title: 'Açıklama',
        dataIndex: 'description',
        key: 'description',
        render: (value?: string) => <Text type="secondary">{value || 'Açıklama yok'}</Text>,
      },
      {
        title: 'Fatura',
        dataIndex: 'document',
        key: 'document',
        render: (value?: FinanceDocument) =>
          value ? (
            <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownloadDocument(value)}>
              {value.fileName}
            </Button>
          ) : (
            <Text type="secondary">Ek yok</Text>
          ),
      },
      {
        title: 'İşlemler',
        key: 'actions',
        render: (_, record) => (
          <Popconfirm
            title="Bu kaydı silmek istediğinize emin misiniz?"
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => handleDeleteEntry(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Sil
            </Button>
          </Popconfirm>
        ),
      },
    ],
    [handleDeleteEntry, handleDownloadDocument],
  );

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

          <section className="workspace-section finance-entries-section">
            <div className="finance-manual-grid">
              <Card className="workspace-card finance-manual-card" bordered={false}>
                <div className="workspace-card-header">
                  <div>
                    <Text className="workspace-stat-label">Manuel Finans Özeti</Text>
                    <Title level={4}>Gelir / Gider Durumu</Title>
                  </div>
                  <Tag icon={<WalletOutlined />} className="workspace-pill">
                    {entries.length} kayıt
                  </Tag>
                </div>
                <div className="finance-manual-stats">
                  {manualHighlights.map(highlight => (
                    <div key={highlight.title} className="finance-manual-stat">
                      <span className="finance-manual-icon" style={{ color: highlight.accent, backgroundColor: `${highlight.accent}1a` }}>
                        {highlight.icon}
                      </span>
                      <div className="finance-manual-copy">
                        <Text className="finance-stat-label">{highlight.title}</Text>
                        <Title level={4}>{highlight.value}</Title>
                        <span className="finance-helper" style={{ color: highlight.accent }}>
                          {highlight.helper}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="workspace-card finance-entry-form-card" bordered={false}>
                <div className="workspace-card-header">
                  <div>
                    <Text className="workspace-stat-label">Yeni Finans Kaydı</Text>
                    <Title level={4}>Gelir / Gider Ekle</Title>
                  </div>
                </div>
                <Form
                  layout="vertical"
                  form={entryForm}
                  initialValues={{ entryDate: dayjs(), type: 'INCOME' as FinanceEntryType }}
                  onFinish={handleEntrySubmit}
                  className="finance-entry-form"
                >
                  <Form.Item<EntryFormValues> name="entryDate" label="Tarih" rules={[{ required: true, message: 'Lütfen tarih seçin.' }]}>
                    <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item<EntryFormValues> name="type" label="Tür" rules={[{ required: true, message: 'Lütfen tür seçin.' }]}>
                    <Select
                      options={[
                        { value: 'INCOME', label: 'Gelir' },
                        { value: 'EXPENSE', label: 'Gider' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item<EntryFormValues> name="amount" label="Tutar" rules={[{ required: true, message: 'Lütfen tutar girin.' }]}>
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      formatter={value => (value ? `₺ ${value}` : '')}
                      parser={value => value?.replace(/[₺\s]/g, '') ?? ''}
                    />
                  </Form.Item>
                  <Form.Item<EntryFormValues> name="description" label="Açıklama">
                    <Input.TextArea rows={3} placeholder="İşlemi kısaca açıklayın" />
                  </Form.Item>
                  <Form.Item label="Fatura (PDF/Excel)">
                    <Space direction="vertical" size={8} className="finance-upload-area">
                      <Upload {...uploadProps} disabled={uploadingInvoice}>
                        <Button icon={<UploadOutlined />} loading={uploadingInvoice}>
                          {uploadedDocument ? 'Faturayı Güncelle' : 'Fatura Yükle'}
                        </Button>
                      </Upload>
                      {uploadedDocument ? (
                        <div className="finance-uploaded-document">
                          <Tag
                            icon={uploadedDocument.contentType.includes('pdf') ? <FilePdfOutlined /> : <FileExcelOutlined />}
                            color="processing"
                          >
                            {uploadedDocument.fileName}
                          </Tag>
                          <Button type="link" onClick={handleRemoveDocument}>
                            Kaldır
                          </Button>
                        </div>
                      ) : (
                        <Text type="secondary" className="finance-upload-hint">
                          Desteklenen formatlar: PDF, XLS, XLSX
                        </Text>
                      )}
                    </Space>
                  </Form.Item>
                  <Form.Item>
                    <Space size={12}>
                      <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={entrySubmitting}>
                        Kaydı Kaydet
                      </Button>
                      <Button
                        onClick={() => {
                          entryForm.resetFields();
                          setUploadedDocument(null);
                        }}
                      >
                        Formu Temizle
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </div>

            <Card className="workspace-card finance-entry-table-card" bordered={false}>
              <div className="workspace-card-header">
                <div>
                  <Text className="workspace-stat-label">Finans Kayıtları</Text>
                  <Title level={4}>Gelir &amp; Gider Geçmişi</Title>
                </div>
                <Tag icon={<StockOutlined />} className="workspace-pill">
                  {entries.length} kayıt
                </Tag>
              </div>
              <Table
                rowKey="id"
                columns={entryColumns}
                dataSource={entries}
                loading={entryLoading}
                pagination={{ pageSize: 5, hideOnSinglePage: true }}
                locale={{ emptyText: <Empty description="Kayıt bulunamadı." /> }}
                className="finance-entry-table"
              />
            </Card>
          </section>
        </>
      )}
    </main>
  );
};

export default Finance;
