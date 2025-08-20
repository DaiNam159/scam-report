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
  async getAllUsers(page = 1, limit = 10) {
    try {
      const res = await api.get(`${UserUrl}?page=${page}&limit=${limit}`);
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
};
