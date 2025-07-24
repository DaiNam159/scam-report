import api from "@/lib/axiosInstance";

const reportUrl = "/report";
export const ReportService = {
  async submitReport(data: any) {
    try {
      const res = await api.post(reportUrl, data);
      return res.data;
    } catch (err) {
      console.error("Lỗi khi gửi báo cáo:", err);
      throw new Error("Không thể gửi báo cáo. Vui lòng thử lại sau.");
    }
  },
  async getReports(page: number = 1, limit: number = 5) {
    try {
      const res = await api.get(`${reportUrl}?page=${page}&limit=${limit}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  async getReportById(id: number) {
    try {
      const res = await api.get(`${reportUrl}/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  async approveReport(id: number) {
    try {
      const res = await api.put(`${reportUrl}/approve`, { id });
      return res;
    } catch (error) {
      console.log("hehehahaha: ", error);
      throw error;
    }
  },
  async rejectReport(id: number) {
    try {
      const res = await api.put(`${reportUrl}/reject`, { id });
      return res;
    } catch (error) {
      throw error;
    }
  },
  async deleteReport(id: number) {
    try {
      const res = await api.delete(`${reportUrl}/${id}`);
      return res;
    } catch (error) {
      throw error;
    }
  },
  async countApprovedReport() {
    try {
      const res = await api.get(`${reportUrl}/count-approved`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  async countPendingReport() {
    try {
      const res = await api.get(`${reportUrl}/count-pending`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  async relatedReports(input_text: string) {
    try {
      const res = await api.post(`${reportUrl}/related-reports`, {
        input_text,
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching related reports:", error);
      throw error;
    }
  },
};
