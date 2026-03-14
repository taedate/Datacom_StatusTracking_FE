import axios from 'axios';
import Swal from 'sweetalert2';
import { API_CONFIG } from '@/config/api';

const apiClient = axios.create({
  ...API_CONFIG,
  withCredentials: true
});

// 1. ขาไป: แนบ Token
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

// 2. ขากลับ: ตรวจสอบสถานะ 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // ล้างข้อมูล
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userName');

      // แสดง sweet alert
      Swal.fire({
        icon: 'warning',
        title: 'เซสชันหมดอายุ',
        text: 'เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'ไปยังหน้า Login'
      }).then(() => {
        window.location.href = '/login';
      });
    }
    return Promise.reject(error);
  }
);

export const authService = {
  logout: () => apiClient.post('/logout'),
};

export default apiClient;