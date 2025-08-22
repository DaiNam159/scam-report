import api from "@/lib/axiosInstance";

export const AuthService = {
  async login(email: string, password: string) {
    try {
      const res = await api.post("/auth/login", { email, password });
      return res.data; // { message: "Login successful" }
    } catch (e) {
      throw e;
    }
  },

  async register(email: string, password: string) {
    try {
      const res = await api.post("/auth/register", { email, password });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  async getProfile() {
    try {
      const res = await api.get("/auth/me");
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      const res = await api.post("/auth/logout");
      return res.data;
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Logout failed");
    }
  },
};
