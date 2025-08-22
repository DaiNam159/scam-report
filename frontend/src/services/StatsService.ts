import api from "@/lib/axiosInstance";
const baseUrl = "/stats";
export const StatsService = {
  async trackVisit() {
    try {
      const res = await api.post(`${baseUrl}/track-visit`);
      return res.data;
    } catch (error) {
      console.error("Error tracking visit:", error);
      return null;
    }
  },
  async getStats() {
    try {
      const res = await api.get(baseUrl);
      return res.data;
    } catch (error) {
      console.error("Error fetching stats:", error);
      return null;
    }
  },
  async getTotalVisits() {
    try {
      const res = await api.get(`${baseUrl}/total-visits`);
      return res.data;
    } catch (error) {
      console.error("Error fetching total visits:", error);
      return null;
    }
  },
  async getOnlineUsers() {
    try {
      const res = await api.get(`${baseUrl}/online-users`);
      return res.data;
    } catch (error) {
      console.error("Error fetching online users:", error);
      return null;
    }
  },
};
