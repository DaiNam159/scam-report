import { ReportType } from "@/types/ReportType";
import { BlacklistItem } from "@/types/BlacklistType";
import api from "@/lib/axiosInstance";

export interface BlacklistParams {
  type?: ReportType;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "reportCount" | "latestReport" | "value";
  sortOrder?: "asc" | "desc";
}

export interface BlacklistResponse {
  data: BlacklistItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BlacklistStats {
  totalItems: number;
  totalReports: number;
  totalUsers: number;
}

export const BlacklistService = {
  async getBlacklist(params: BlacklistParams = {}): Promise<BlacklistResponse> {
    try {
      const response = await api.get("/blacklist", { params });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching blacklist:", error);

      // Xử lý các loại lỗi khác nhau
      if (error.response?.status === 404) {
        throw new Error("Không tìm thấy dữ liệu blacklist.");
      } else if (error.response?.status >= 500) {
        throw new Error("Lỗi server. Vui lòng thử lại sau.");
      } else if (error.code === "NETWORK_ERROR") {
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      }

      throw new Error("Không thể tải danh sách đen. Vui lòng thử lại sau.");
    }
  },

  async getBlacklistStats(): Promise<BlacklistStats> {
    try {
      const response = await api.get("/blacklist/stats");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching blacklist stats:", error);

      // Trả về dữ liệu mặc định nếu API lỗi
      return {
        totalItems: 0,
        totalReports: 0,
        totalUsers: 0,
      };
    }
  },

  async searchBlacklist(
    query: string,
    type?: ReportType
  ): Promise<BlacklistItem[]> {
    try {
      const params: BlacklistParams = {
        search: query,
        limit: 50, // Giới hạn kết quả tìm kiếm
      };

      if (type) {
        params.type = type;
      }

      const response = await this.getBlacklist(params);
      return response.data;
    } catch (error) {
      console.error("Error searching blacklist:", error);
      throw new Error("Không thể tìm kiếm. Vui lòng thử lại sau.");
    }
  },
};
