import api from "@/lib/axiosInstance";

const reportUrl = "/safety";
export const SafetyService = {
  async checkUrlWithSafeBrowsing(url: string) {
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
  async checkUrlWithIPQS(url: string) {
    try {
      const response = await api.get("/safety/check-url-ipqs", {
        params: { url },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async checkUrlWithVirustotal(url: string) {
    try {
      const response = await api.get("/safety/check-url-vitrustotal", {
        params: { url },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
