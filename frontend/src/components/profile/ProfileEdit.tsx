"use client";

import { useState, useEffect, useRef } from "react";
import { profileService, UserProfile } from "@/services/profileService";
import { FaUser, FaCamera, FaSave, FaTimes } from "react-icons/fa";

interface ProfileEditProps {
  onClose: () => void;
  onUpdated?: () => void;
}

export default function ProfileEdit({ onClose, onUpdated }: ProfileEditProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setFullName(data.fullName || "");
      setAvatarUrl(data.avatarUrl || "");
      setAvatarPreview(data.avatarUrl || "");
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalAvatarUrl = avatarUrl;

      // Upload avatar nếu có file mới
      if (avatarFile) {
        setUploading(true);
        const uploadResult = await profileService.uploadAvatar(avatarFile);
        finalAvatarUrl = uploadResult.url;
        setUploading(false);
      }

      // Update profile
      await profileService.updateProfile({
        fullName,
        avatarUrl: finalAvatarUrl,
      });

      alert("Cập nhật thông tin thành công!");
      onUpdated?.();
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Cập nhật thông tin thất bại!");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (!profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="p-8 bg-white rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <span>Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 m-4 bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Chỉnh sửa thông tin
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 transition rounded-full hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-200 rounded-full">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FaUser className="text-5xl text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
                disabled={uploading}
              >
                <FaCamera />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Email (readonly) */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex items-center justify-center flex-1 gap-2 px-4 py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading || uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  <span>{uploading ? "Đang tải..." : "Đang lưu..."}</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
