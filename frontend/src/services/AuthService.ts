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

export const AuthService = {
  async login(email: string, password: string) {
    try {
      const res = await api.post("/auth/login", { email, password });
      return res.data; // { message: "Login successful" }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed";
      throw new Error(msg);
    }
  },

  async register(email: string, password: string) {
    try {
      const res = await api.post("/auth/register", { email, password });
      return res.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Register failed";
      throw new Error(msg);
    }
  },

  async getProfile() {
    try {
      const res = await api.get("/auth/me");
      console.log("User profile:", res.data);
      return res.data; // { userId, email, isAdmin, ... }
    } catch (error: any) {
      throw new Error("Not authenticated");
    }
  },

  async logout() {
    try {
      const res = await api.post("/auth/logout");
      return res.data;
    } catch (error: any) {
      console.error("❌ Logout failed:", error);
      throw new Error("Logout failed");
    }
  },
};
