import api from "@/lib/axiosInstance";

export interface UserProfile {
  id: number;
  email: string;
  emailVerified: boolean;
  fullName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  gender?: string;
  idNumber?: string;
  organization?: string;
  address?: string;
  city?: string;
  country?: string;
  birthDate?: string;
  bio?: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface UpdateProfileData {
  fullName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  gender?: string;
  idNumber?: string;
  organization?: string;
  address?: string;
  city?: string;
  country?: string;
  birthDate?: string;
  bio?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get("/profile");
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await api.put("/profile", data);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<{ url: string; public_id: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.post("/profile/change-password", data);
    return response.data;
  },
};
