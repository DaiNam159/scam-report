import api from "@/lib/axiosInstance";

const reportUrl = "/safety";
export const SafetyService = {
  async checkUrl(url: string) {
    try {
      const res = await api.get(`${reportUrl}/check-url`, {
        params: { url },
      });
      return res.data;
    } catch (err) {
      console.error("Error checking URL:", err);
      throw new Error("Unable to check URL. Please try again later.");
    }
  },
};
