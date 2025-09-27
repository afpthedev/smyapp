import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, DatePicker, Form, Input, Row, Space, Typography, message } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { publicReservationService, type PublicReservationPayload } from '../../services/api';
import './styles.css';

const { Title, Paragraph, Text } = Typography;

interface ReservationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reservationDate: Dayjs;
  notes?: string;
}

const featureHighlights = [
  {
    title: 'Dakik Planlama',
    description: 'Hizmetleriniz için uygun zaman dilimini seçin ve rezervasyonunuzu saniyeler içinde tamamlayın.',
  },
  {
    title: 'Ekip Takibi',
    description: 'Yönetici paneli ile tüm rezervasyonları ve müşteri taleplerini tek bir yerden kontrol edin.',
  },
  {
    title: 'Otomatik Bilgilendirme',
    description: 'Onaylanan işlemler için e-posta ve SMS bilgilendirmeleri ile müşterilerinizi sürekli haberdar edin.',
  },
];

const Welcome: React.FC = () => {
  const [form] = Form.useForm<ReservationFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: ReservationFormValues) => {
    const payload: PublicReservationPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      reservationDate: values.reservationDate.toISOString(),
      notes: values.notes,
    };

    try {
      setSubmitting(true);
      await publicReservationService.create(payload);
      message.success('Talebiniz başarıyla alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.');
      form.resetFields();
    } catch (error) {
      console.error('Public reservation request failed', error);
      message.error('Rezervasyon isteğiniz gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <div className="welcome-hero-content">
          <Text className="welcome-badge">Rezervasyon Yönetim Sistemi</Text>
          <Title>Modern bir rezervasyon deneyimi sunun</Title>
          <Paragraph>
            Misafirlerinizin hızlıca rezervasyon oluşturabildiği, yöneticilerin ise gelişmiş bir panel üzerinden tüm süreci takip edebildiği
            esnek bir çözüm tasarladık. Hemen rezervasyon formunu doldurarak talebinizi iletebilirsiniz.
          </Paragraph>
          <Space size={16} wrap>
            <Button
              type="primary"
              size="large"
              onClick={() => document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Rezervasyon Oluştur
            </Button>
            <Link to="/login" className="welcome-login-link">
              Yönetici girişi yap
            </Link>
          </Space>
        </div>
      </div>

      <section className="welcome-features">
        <Row gutter={[24, 24]}>
          {featureHighlights.map(feature => (
            <Col xs={24} md={8} key={feature.title}>
              <Card bordered={false} className="welcome-feature-card">
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="welcome-form-wrapper" id="reservation-form">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={12}>
            <div className="welcome-form-copy">
              <Title level={3}>Rezervasyon formunu doldurun</Title>
              <Paragraph>
                Talep ettiğiniz tarih ve iletişim bilgileriniz bize ulaştığında, rezervasyonunuzu onaylamak için sizinle iletişime
                geçeceğiz. Tüm bilgileriniz güvenli olarak saklanır ve yalnızca rezervasyon amacıyla kullanılır.
              </Paragraph>
              <ul className="welcome-benefits">
                <li>Güvenli veri aktarımı ve kayıt</li>
                <li>Hızlı dönüş yapan operasyon ekibi</li>
                <li>İhtiyaçlarınıza göre şekillenen hizmetler</li>
              </ul>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Card bordered={false} className="welcome-form-card">
              <Title level={4}>Misafir Rezervasyonu</Title>
              <Form layout="vertical" form={form} onFinish={handleSubmit} requiredMark={false}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="firstName" label="Ad" rules={[{ required: true, message: 'Lütfen adınızı girin.' }]}>
                      <Input placeholder="Örneğin Ayşe" autoComplete="given-name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="lastName" label="Soyad" rules={[{ required: true, message: 'Lütfen soyadınızı girin.' }]}>
                      <Input placeholder="Örneğin Yılmaz" autoComplete="family-name" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="email"
                  label="E-posta"
                  rules={[
                    { required: true, message: 'Lütfen e-posta adresinizi girin.' },
                    { type: 'email', message: 'Geçerli bir e-posta adresi giriniz.' },
                  ]}
                >
                  <Input placeholder="ornek@mail.com" autoComplete="email" />
                </Form.Item>
                <Form.Item name="phone" label="Telefon" rules={[{ required: true, message: 'Lütfen telefon numaranızı girin.' }]}>
                  <Input placeholder="05xx xxx xx xx" autoComplete="tel" />
                </Form.Item>
                <Form.Item
                  name="reservationDate"
                  label="Tercih Edilen Tarih"
                  rules={[{ required: true, message: 'Lütfen bir tarih seçin.' }]}
                >
                  <DatePicker
                    showTime
                    className="welcome-date-picker"
                    style={{ width: '100%' }}
                    format="DD.MM.YYYY HH:mm"
                    disabledDate={current => current && current < dayjs().startOf('day')}
                  />
                </Form.Item>
                <Form.Item name="notes" label="Notunuz (opsiyonel)">
                  <Input.TextArea rows={4} placeholder="İhtiyaçlarınızı veya tercihlerinizi buraya yazabilirsiniz." />
                </Form.Item>
                <Button type="primary" htmlType="submit" size="large" loading={submitting} block>
                  Rezervasyon Talebi Gönder
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default Welcome;
