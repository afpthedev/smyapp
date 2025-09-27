import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, Col, Divider, Form, Input, Row, Space, Spin, Typography, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { ArrowLeftOutlined, CameraOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { accountService, type AdminUser } from '../../services/api';
import './styles.css';

const { Title, Text } = Typography;

const initialAvatar = 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatar);
  const [account, setAccount] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let isMounted = true;

    const loadAccount = async () => {
      try {
        const response = await accountService.getProfile();
        if (!isMounted) {
          return;
        }
        setAccount(response.data);
        const imageUrl = response.data.imageUrl || initialAvatar;
        setAvatarUrl(imageUrl);
        form.setFieldsValue({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          messageApi.error('Profil bilgileri alınamadı. Lütfen oturum durumunuzu kontrol edin.');
        } else {
          messageApi.error('Profil verileri yüklenirken bir hata oluştu.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAccount();

    return () => {
      isMounted = false;
    };
  }, [form, messageApi]);

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
      setAccount(prev => (prev ? { ...prev, imageUrl: reader.result as string } : prev));
    };
    reader.readAsDataURL(file);

    return false;
  };

  const handleFormFinish = async (values: Record<string, string>) => {
    if (!account) {
      return;
    }

    try {
      setSubmitting(true);
      const payload: AdminUser = {
        ...account,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        imageUrl: avatarUrl,
        langKey: account.langKey ?? 'tr',
      };

      await accountService.updateProfile(payload);
      setAccount(payload);
      messageApi.success('Profil ayarlarınız başarıyla güncellendi.');

      if (values.currentPassword && values.newPassword) {
        await accountService.changePassword(values.currentPassword, values.newPassword);
        messageApi.success('Şifreniz güncellendi.');
      }

      form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseMessage = error.response?.data?.message;
        messageApi.error(responseMessage || 'Profil güncellenirken bir hata oluştu.');
      } else {
        messageApi.error('Profil güncellenirken bir hata oluştu.');
      }
    } finally {
      setSubmitting(false);
    }
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
      <div className="profile-toolbar">
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleBack} className="profile-back-button">
          Önceki sayfaya dön
        </Button>
      </div>
      <Card className="profile-card" bordered={false}>
        {loading ? (
          <div className="profile-loading">
            <Spin size="large" />
          </div>
        ) : (
          <>
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

            <Form layout="vertical" form={form} onFinish={handleFormFinish} className="profile-form">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Ad" name="firstName" rules={[{ required: true, message: 'Lütfen adınızı girin.' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Adınız" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Soyad" name="lastName" rules={[{ required: true, message: 'Lütfen soyadınızı girin.' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Soyadınız" size="large" />
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
                  <Button type="primary" htmlType="submit" size="large" loading={submitting}>
                    Değişiklikleri Kaydet
                  </Button>
                  <Button
                    size="large"
                    onClick={() => form.resetFields(['currentPassword', 'newPassword', 'confirmPassword'])}
                    disabled={submitting}
                  >
                    Şifre Alanlarını Temizle
                  </Button>
                </Space>
              </div>
            </Form>
          </>
        )}
      </Card>
    </main>
  );
};

export default Profile;
