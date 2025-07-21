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
};
