import axios from 'axios';
import Swal from 'sweetalert2';
import { API_CONFIG } from '@/config/api';

const apiClient = axios.create(API_CONFIG);

// Add token to Authorization header if exists
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle 401, 403 globally
    if (error.response?.status === 401) {
      // Clear session data
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Show alert immediately
      alert('เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
      
      // Redirect to login
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      console.warn('Forbidden - access denied');
    }
    return Promise.reject(error);
  }
);

export const sentRepairService = {
  // Get detail
  getDetail: (id) => apiClient.get(`/get-sent-repair-detail/${id}`),
  
  // Create new
  create: (payload) => apiClient.post('/create-sent-repair', payload),
  
  // Update existing
  update: (payload) => apiClient.post('/update-sent-repair', payload),
  
  // Delete
  delete: (id) => apiClient.post('/delete-sent-repair', { caseSId: id }),
  
  // Print PDF
  print: (id) => apiClient.get(`/print-sent-repair/${id}`, {
    responseType: 'blob',
    headers: { Accept: 'application/pdf' }
  }),

  // Dashboard API endpoints
  getStatistics: () => apiClient.get('/dashboard/statistics'),
  
  getRecentActivities: (limit = 10, offset = 0) => 
    apiClient.get('/dashboard/recent-activities', { 
      params: { limit, offset } 
    }),
};

export default apiClient;
