import axios from "axios";

const API_BASE = "http://localhost:5000"; // Thay bằng URL backend của bạn

// Tạo một instance mặc định
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // GỬI COOKIE TỰ ĐỘNG
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
