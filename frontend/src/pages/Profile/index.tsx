import React, { useState } from 'react';
import { Avatar, Button, Card, Col, Divider, Form, Input, Row, Space, Typography, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { CameraOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import './styles.css';

const { Title, Text } = Typography;

const initialAvatar = 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80';

const Profile: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatar);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleAvatarUpload: UploadProps['beforeUpload'] = file => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      messageApi.error('Lütfen geçerli bir görsel dosyası seçin.');
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error('Profil fotoğrafı 2MB boyutunu geçmemelidir.');
      return Upload.LIST_IGNORE;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    return false;
  };

  const handleFormFinish = () => {
    messageApi.success('Profil ayarlarınız başarıyla güncellendi.');
    form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
  };

  const passwordRules = [
    { required: true, message: 'Bu alan zorunludur.' },
    {
      min: 8,
      message: 'Şifre en az 8 karakter olmalıdır.',
    },
  ];

  return (
    <main className="profile-page">
      {contextHolder}
      <Card className="profile-card" bordered={false}>
        <div className="profile-header">
          <div className="profile-heading">
            <Text className="profile-eyebrow">Hesap Yönetimi</Text>
            <Title level={2}>Profilinizi Düzenleyin</Title>
            <Text className="profile-subtitle">
              İletişim bilgilerinizi güncelleyin, güçlü bir şifre belirleyin ve profesyonel bir profil fotoğrafı yükleyin.
            </Text>
          </div>
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-frame">
              <Avatar src={avatarUrl} size={96} icon={<UserOutlined />} alt="Kullanıcı profil fotoğrafı" />
              <Upload accept="image/*" showUploadList={false} beforeUpload={handleAvatarUpload} className="profile-avatar-upload">
                <Button type="primary" shape="circle" icon={<CameraOutlined />} aria-label="Profil fotoğrafı yükle" />
              </Upload>
            </div>
            <Text className="profile-avatar-hint">PNG, JPG veya WEBP formatı · Maksimum 2MB</Text>
          </div>
        </div>

        <Divider className="profile-divider" />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleFormFinish}
          className="profile-form"
          initialValues={{
            fullName: 'Ayşe Zorlu',
            email: 'ayse.zorlu@example.com',
          }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item label="Ad Soyad" name="fullName" rules={[{ required: true, message: 'Lütfen adınızı ve soyadınızı girin.' }]}>
                <Input prefix={<UserOutlined />} placeholder="Adınız ve soyadınız" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="E-posta"
                name="email"
                rules={[
                  { required: true, message: 'Lütfen bir e-posta adresi girin.' },
                  { type: 'email', message: 'Geçerli bir e-posta adresi girin.' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="ornek@domain.com" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <section className="profile-section">
            <div className="profile-section-header">
              <Title level={4}>Şifre Yönetimi</Title>
              <Text>Güvenliğinizi artırmak için güçlü ve benzersiz bir şifre belirleyin.</Text>
            </div>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Form.Item label="Mevcut Şifre" name="currentPassword" rules={passwordRules}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Mevcut şifreniz" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Yeni Şifre" name="newPassword" rules={passwordRules} hasFeedback>
                  <Input.Password prefix={<LockOutlined />} placeholder="Yeni şifrenizi oluşturun" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Yeni Şifre (Tekrar)"
                  name="confirmPassword"
                  dependencies={['newPassword']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Lütfen yeni şifrenizi tekrar girin.' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Şifreler eşleşmiyor.'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Yeni şifrenizi tekrar girin" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </section>

          <div className="profile-form-actions">
            <Space size={16} wrap>
              <Button type="primary" htmlType="submit" size="large">
                Değişiklikleri Kaydet
              </Button>
              <Button size="large" onClick={() => form.resetFields(['currentPassword', 'newPassword', 'confirmPassword'])}>
                Şifre Alanlarını Temizle
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </main>
  );
};

export default Profile;
