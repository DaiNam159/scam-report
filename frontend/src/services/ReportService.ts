import api from "@/lib/axiosInstance";
import { ReportFilters } from "@/components/admin/report/ReportFilter";
import { ReportSubmit } from "@/types/ReportType";

const reportUrl = "/report";
export class ReportService {
  static async getLastReportUpdate() {
    try {
      const res = await api.get(`${reportUrl}/update-date`);
      return res.data;
    } catch (err) {
      console.error("Error fetching last report update:", err);
      throw new Error(
        "Unable to fetch last report update. Please try again later."
      );
    }
  }
  static async submitReport(data: ReportSubmit) {
    try {
      // console.log("Submitting report with data:", data);
      // return;
      const res = await api.post(reportUrl, data);
      return res.data;
    } catch (err) {
      console.error("Lỗi khi gửi báo cáo:", err);
      throw new Error("Không thể gửi báo cáo. Vui lòng thử lại sau.");
    }
  }
  static async getReports(
    page: number = 1,
    filters?: ReportFilters,
    sortBy?: string,
    sortOrder?: "ASC" | "DESC"
  ) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "5",
      });

      // Thêm filters vào params
      if (filters?.type) params.append("type", filters.type);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters?.dateTo) params.append("dateTo", filters.dateTo);
      if (filters?.userEmail) params.append("userEmail", filters.userEmail);

      // Thêm sort vào params
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

      const response = await api.get(`${reportUrl}?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  }
  static async getReportById(id: number) {
    try {
      const res = await api.get(`${reportUrl}/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async approveReport(id: number) {
    try {
      const res = await api.put(`${reportUrl}/approve`, { id });
      return res;
    } catch (error) {
      console.log("hehehahaha: ", error);
      throw error;
    }
  }
  static async rejectReport(id: number) {
    try {
      const res = await api.put(`${reportUrl}/reject`, { id });
      return res;
    } catch (error) {
      throw error;
    }
  }
  static async deleteReport(id: number) {
    try {
      const res = await api.delete(`${reportUrl}/${id}`);
      return res;
    } catch (error) {
      throw error;
    }
  }
  static async countAllReports() {
    try {
      const res = await api.get(`${reportUrl}/count-all`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async countApprovedReport() {
    try {
      const res = await api.get(`${reportUrl}/count-approved`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async countPendingReport() {
    try {
      const res = await api.get(`${reportUrl}/count-pending`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async countRejectedReport() {
    try {
      const res = await api.get(`${reportUrl}/count-rejected`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async countTodayReport() {
    try {
      const res = await api.get(`${reportUrl}/count-today`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async relatedReports(input_text: string) {
    try {
      const res = await api.post(`${reportUrl}/related-reports`, {
        input_text,
      });
      console.log("Related reports response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching related reports:", error);
      throw error;
    }
  }
  static async checkSpamByUserMin(minutes: number) {
    try {
      const res = await api.get(`${reportUrl}/check-spam-minutes`, {
        params: { minutes },
      });
      return res.data;
    } catch (error) {
      console.error("Error checking spam by user minute:", error);
      throw error;
    }
  }
  static async getWeeklyReportStats() {
    try {
      const res = await api.get(`${reportUrl}/weekly-stats`);
      return res.data;
    } catch (error) {
      console.error("Error fetching weekly report stats:", error);
      throw error;
    }
  }

  // Lấy danh sách báo cáo của user hiện tại
  static async getMyReports(page: number = 1, status?: string) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (status && status !== "all") {
        params.append("status", status);
      }

      const response = await api.get(`${reportUrl}/my-reports?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching my reports:", error);
      throw error;
    }
  }
}
