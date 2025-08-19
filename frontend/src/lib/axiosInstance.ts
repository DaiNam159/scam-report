import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; // Sửa port cho phù hợp với NestJS

// Tạo một instance mặc định
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // GỬI COOKIE TỰ ĐỘNG
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout 10 giây
});

// Request interceptor để thêm authorization header nếu cần
api.interceptors.request.use(
  (config) => {
    // Có thể thêm token vào header ở đây nếu cần
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi chung
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response?.status === 401) {
      // Xử lý lỗi unauthorized
      console.error("Unauthorized access");
    } else if (error.response?.status === 403) {
      // Xử lý lỗi forbidden
      console.error("Forbidden access");
    }

    return Promise.reject(error);
  }
);

export default api;
