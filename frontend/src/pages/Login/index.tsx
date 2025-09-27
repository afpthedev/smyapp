import React, {useState} from 'react';
import {Form, Input, Button, Checkbox, Card, Typography, message, Alert} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {authService} from '../../services/api';
import './styles.css';

const {Title, Text} = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      setError(null);

      // Form validasyonu
      await form.validateFields();

      // Backend bağlantısı
      const response = await authService.login(values.username, values.password);

      if (response.data) {
        // Başarılı giriş
        localStorage.setItem('token', response.data.token);
        message.success('Giriş başarılı!');
        // Ana sayfaya yönlendirme
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      if (error.isAxiosError) {
        // API hatası
        if (error.response?.status === 401) {
          setError('Kullanıcı adı veya şifre hatalı!');
        } else if (error.response?.status === 429) {
          setError('Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.');
        } else if (!error.response) {
          setError('Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.');
        } else {
          setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
      }
      message.error('Giriş başarısız!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>Admin Panel</Title>
          <Text>Please sign in to your account</Text>
        </div>

        {error && (
          <Alert
            message="Giriş Hatası"
            description={error}
            type="error"
            showIcon
            closable
            className="login-error"
            style={{marginBottom: 24}}
          />
        )}

        <Form
          name="login"
          className="login-form"
          initialValues={{remember: true}}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="username"
            rules={[
              {required: true, message: 'Lütfen kullanıcı adınızı girin!'},
              {min: 3, message: 'Kullanıcı adı en az 3 karakter olmalıdır!'},
              {max: 50, message: 'Kullanıcı adı en fazla 50 karakter olabilir!'}
            ]}
          >
            <Input
              prefix={<UserOutlined/>}
              placeholder="Kullanıcı Adı"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {required: true, message: 'Lütfen şifrenizi girin!'},
              {min: 6, message: 'Şifre en az 6 karakter olmalıdır!'},
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                message: 'Şifre en az bir harf ve bir rakam içermelidir!'
              }
            ]}
          >
            <Input
              prefix={<LockOutlined/>}
              type="password"
              placeholder="Şifre"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div className="login-options">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Beni Hatırla</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="/forgot-password">
                Şifremi Unuttum
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
              block
            >
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
