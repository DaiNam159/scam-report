import api from "@/lib/axiosInstance";

const UserUrl = "/user";
export const UserService = {
  async countUsers() {
    try {
      const res = await api.get(`${UserUrl}/count`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    params: Record<string, any> = {}
  ) {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")
        ),
      });

      const res = await api.get(`${UserUrl}?${query.toString()}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  async updateUser(id: number, userData: any) {
    try {
      const res = await api.put(`${UserUrl}/`, { id, userData });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  async enableUser(id: number) {
    try {
      const res = await api.put(`${UserUrl}/active`, { id });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  async disableUser(id: number) {
    try {
      const res = await api.put(`${UserUrl}/disable`, { id });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteUser(id: number) {
    try {
      const res = await api.delete(`${UserUrl}/`, { data: { id } });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  async getActiveUsers() {
    // API call to get count of active users
  },

  async getInactiveUsers() {
    // API call to get count of inactive users
  },
  async getTotalUsers() {
    // API call to get total count of users
  },
};
