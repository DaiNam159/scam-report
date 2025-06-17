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
  async getReport() {
    try {
      const res = await api.get(reportUrl);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};
