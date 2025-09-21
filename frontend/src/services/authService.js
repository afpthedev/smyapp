import apiService from './api';

class AuthService {
  // Login method
  async login(credentials) {
    try {
      const response = await apiService.post('/authenticate', {
        username: credentials.username,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      });

      if (response.success && response.data) {
        // JWT token'ı localStorage'a kaydet
        const token = response.data.id_token;
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', credentials.username);
        
        return {
          success: true,
          token: token,
          user: {
            username: credentials.username
          }
        };
      } else {
        return {
          success: false,
          error: response.error || 'Giriş başarısız'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Giriş sırasında bir hata oluştu'
      };
    }
  }

  // Logout method
  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('userInfo');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('jwt_token');
    const isAuth = localStorage.getItem('isAuthenticated');
    return !!(token && isAuth === 'true');
  }

  // Get current user info
  getCurrentUser() {
    if (!this.isAuthenticated()) {
      return null;
    }

    return {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('jwt_token')
    };
  }

  // Get user account info from backend
  async getAccount() {
    try {
      const response = await apiService.get('/account');
      
      if (response.success) {
        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return response;
      } else {
        // Token geçersizse logout yap
        if (response.status === 401) {
          this.logout();
        }
        return response;
      }
    } catch (error) {
      console.error('Get account error:', error);
      return {
        success: false,
        error: 'Kullanıcı bilgileri alınamadı'
      };
    }
  }

  // Validate current session
  async validateSession() {
    try {
      const response = await apiService.get('/authenticate');
      
      if (response.success) {
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Session validation error:', error);
      this.logout();
      return false;
    }
  }

  // Get JWT token
  getToken() {
    return localStorage.getItem('jwt_token');
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;