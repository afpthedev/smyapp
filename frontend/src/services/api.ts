import axios, { type AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
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

export const reservationService = {
  async list(params?: ListParams): Promise<PaginatedResponse<Reservation>> {
    const response = await api.get<Reservation[]>('/reservations', { params });
    return { items: response.data, total: parseTotal(response) };
  },
  async create(payload: ReservationCreateInput): Promise<Reservation> {
    const response = await api.post<Reservation>('/reservations', {
      date: payload.date,
      status: payload.status,
      notes: payload.notes,
      service: payload.serviceId ? { id: payload.serviceId } : undefined,
      customer: payload.customerId ? { id: payload.customerId } : undefined,
      business: payload.businessId ? { id: payload.businessId } : undefined,
    });
    return response.data;
  },
};

export const customerService = {
  async list(params?: ListParams): Promise<PaginatedResponse<Customer>> {
    const response = await api.get<Customer[]>('/customers', { params });
    return { items: response.data, total: parseTotal(response) };
  },
};

export const paymentService = {
  async list(params?: ListParams): Promise<PaginatedResponse<Payment>> {
    const response = await api.get<Payment[]>('/payments', { params });
    return { items: response.data, total: parseTotal(response) };
  },
};

export const businessService = {
  async list(params?: ListParams): Promise<PaginatedResponse<Business>> {
    const response = await api.get<Business[]>('/businesses', { params });
    return { items: response.data, total: parseTotal(response) };
  },
};

export const accountService = {
  getProfile() {
    return api.get<AdminUser>('/account');
  },
  updateProfile(payload: AdminUser) {
    return api.post('/account', payload);
  },
  changePassword(currentPassword: string, newPassword: string) {
    return api.post('/account/change-password', { currentPassword, newPassword });
  },
};

export const publicReservationService = {
  async create(payload: PublicReservationPayload): Promise<Reservation> {
    const response = await api.post<Reservation>('/public/reservations', payload);
    return response.data;
  },
};

export default api;
