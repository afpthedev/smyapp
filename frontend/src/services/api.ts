import axios, { type AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8080/api';
const API_BASE_URL = API_URL.replace(/\/?api\/?$/, '');

const api = axios.create({
  baseURL: API_URL,
});

api.defaults.headers.common.Accept = 'application/json';

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'OTHER';

export interface Business {
  id: number;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export interface OfferedService {
  id: number;
  name: string;
  description?: string;
  duration?: number;
  price?: number;
  business?: Business;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  business?: Business;
}

export interface Reservation {
  id: number;
  date: string;
  status: ReservationStatus;
  notes?: string;
  service?: OfferedService;
  customer?: Customer;
  business?: Business;
}

export interface ReservationCreateInput {
  date: string;
  status: ReservationStatus;
  notes?: string;
  serviceId?: number;
  customerId?: number;
  businessId?: number;
}

export interface PublicReservationPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reservationDate: string;
  notes?: string;
  offeredServiceId?: number;
  businessId?: number;
}

export interface Payment {
  id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  reservation?: Reservation;
  customer?: Customer;
  business?: Business;
}

export interface AdminUser {
  id?: number;
  login: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: string[];
}

export const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return undefined;
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${base}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
};

export const fetchAvatar = async (url: string) => {
  const response = await api.get(url, { responseType: 'blob' });
  return URL.createObjectURL(response.data);
};

interface ListParams {
  page?: number;
  size?: number;
  sort?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

const parseTotal = <T>(response: AxiosResponse<T[]>): number => {
  const raw = response.headers?.['x-total-count'];
  const total = raw ? Number(raw) : response.data.length;
  return Number.isNaN(total) ? response.data.length : total;
};

type QueryParams = ListParams & Record<string, unknown>;

export interface ReservationApprovalInput {
  notes?: string;
}

export const authService = {
  async login(username: string, password: string, rememberMe = false) {
    const response = await api.post<{ id_token: string }>('/authenticate', { username, password, rememberMe });
    return response.data.id_token;
  },
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  },
};

export const accountService = {
  getProfile() {
    return api.get<AdminUser>('/account');
  },
  updateProfile(payload: AdminUser) {
    return api.post<void>('/account', payload);
  },
  changePassword(currentPassword: string, newPassword: string) {
    return api.post<void>('/account/change-password', { currentPassword, newPassword });
  },
  updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<AdminUser>('/account/avatar', formData);
  },
};

export const reservationService = {
  async list(params: QueryParams = {}) {
    const response = await api.get<Reservation[]>('/reservations', { params });
    return {
      items: response.data,
      total: parseTotal(response),
    } satisfies PaginatedResponse<Reservation>;
  },
  async create(payload: ReservationCreateInput) {
    const response = await api.post<Reservation>('/reservations', payload);
    return response.data;
  },
  async approve(id: number, payload?: ReservationApprovalInput) {
    const response = await api.post<Reservation>(`/reservations/${id}/approve`, payload ?? {});
    return response.data;
  },
};

export const reservationApi = {
  report(params: Record<string, unknown>) {
    return api.get('/reservations/report', { params });
  },
  upcoming(params?: QueryParams) {
    return api.get('/reservations/upcoming', { params });
  },
};

export const businessService = {
  async list(params: QueryParams = {}) {
    const response = await api.get<Business[]>('/businesses', { params });
    return {
      items: response.data,
      total: parseTotal(response),
    } satisfies PaginatedResponse<Business>;
  },
};

export const customerApi = {
  list(params?: QueryParams) {
    return api.get('/customers', { params });
  },
  reservations(customerId: number, params?: QueryParams) {
    return api.get(`/customers/${customerId}/reservations`, { params });
  },
  reservationSummary(customerId: number) {
    return api.get(`/customers/${customerId}/reservations/summary`);
  },
};

export const paymentService = {
  async list(params: QueryParams = {}) {
    const response = await api.get<Payment[]>('/payments', { params });
    return {
      items: response.data,
      total: parseTotal(response),
    } satisfies PaginatedResponse<Payment>;
  },
};

export const publicReservationService = {
  create(payload: PublicReservationPayload) {
    return api.post('/public/reservations', payload);
  },
};

export default api;
