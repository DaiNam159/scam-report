"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaArrowLeft,
  FaSave,
  FaPhone,
  FaVenusMars,
  FaIdCard,
  FaBuilding,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaBirthdayCake,
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "sonner";
import { profileService } from "@/services/profileService";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    emailVerified: false,
    avatarUrl: "" as string | undefined,
    phoneNumber: "",
    gender: "",
    idNumber: "",
    organization: "",
    address: "",
    city: "",
    country: "",
    birthDate: "",
    bio: "",
  });
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    idNumber: "",
    organization: "",
    address: "",
    city: "",
    country: "",
    birthDate: "",
    bio: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    loadProfile();
  }, []);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile({
        fullName: data.fullName || "",
        email: data.email || "",
        emailVerified: data.emailVerified || false,
        avatarUrl: data.avatarUrl,
        phoneNumber: data.phoneNumber || "",
        gender: data.gender || "",
        idNumber: data.idNumber || "",
        organization: data.organization || "",
        address: data.address || "",
        city: data.city || "",
        country: data.country || "",
        birthDate: data.birthDate || "",
        bio: data.bio || "",
      });
      setFormData({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        gender: data.gender || "",
        idNumber: data.idNumber || "",
        organization: data.organization || "",
        address: data.address || "",
        city: data.city || "",
        country: data.country || "",
        birthDate: data.birthDate || "",
        bio: data.bio || "",
      });
      setAvatarPreview(data.avatarUrl || "");
    } catch (error) {
      toast.error("Không thể tải thông tin cá nhân");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    setUploading(true);
    try {
      const uploadResult = await profileService.uploadAvatar(file);
      setAvatarPreview(uploadResult.url);

      // Update profile immediately with new avatar
      await profileService.updateProfile({ avatarUrl: uploadResult.url });
      toast.success("Cập nhật ảnh đại diện thành công!");

      // Reload profile to get updated data
      await loadProfile();
    } catch (error) {
      toast.error("Không thể tải ảnh lên");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }

    setSaving(true);
    try {
      await profileService.updateProfile(formData);
      toast.success("Cập nhật thông tin thành công!");
      await loadProfile();
      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể cập nhật thông tin"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    if (cooldownTime > 0) {
      toast.warning(`Vui lòng đợi ${cooldownTime} giây trước khi gửi lại`);
      return;
    }

    setSendingVerification(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/email-verification/resend`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Email xác minh đã được gửi! Vui lòng kiểm tra hộp thư.");
        setCooldownTime(60); // Start 60 second cooldown
      } else {
        toast.error("Không thể gửi email xác minh");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setSendingVerification(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!passwordData.currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu hiện tại");
      return;
    }

    setChangingPassword(true);
    try {
      await profileService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Đổi mật khẩu thành công!");

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordSection(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể đổi mật khẩu");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-all duration-200 rounded-lg hover:bg-gray-100"
              >
                <FaArrowLeft />
                <span className="hidden sm:inline">Quay lại</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Thông tin cá nhân
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <div className="text-center">
                <div className="relative inline-block group">
                  <div className="relative w-48 h-48 mx-auto overflow-hidden border-4 border-gray-200 rounded-full">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-6xl font-bold text-white bg-gradient-to-r from-red-500 to-orange-500">
                        {formData.fullName?.charAt(0) ||
                          profile.email?.charAt(0) ||
                          "U"}
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-12 h-12 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute bottom-2 right-2 p-3 bg-red-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-red-700 transition-all duration-200 transform hover:scale-110 ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaCamera className="text-xl" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Nhấp vào biểu tượng camera để thay đổi ảnh đại diện
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Kích thước tối đa: 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white shadow-lg sm:p-8 rounded-2xl">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Thông tin chi tiết
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <FaUser className="inline mr-2 text-gray-500" />
                    Họ và tên <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Nhập họ và tên"
                    className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Email - Read Only with Verification Status */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <FaEnvelope className="inline mr-2 text-gray-500" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 text-gray-500 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                    />
                  </div>

                  {/* Email Verification Status */}
                  {profile.emailVerified ? (
                    <div className="flex items-center gap-2 p-3 mt-2 border-l-4 border-green-500 bg-green-50 rounded-xl">
                      <FaCheckCircle className="text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Email đã được xác minh
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 mt-2 border-l-4 border-orange-500 bg-orange-50 rounded-xl">
                      <div className="flex items-start gap-2 mb-2">
                        <FaExclamationTriangle className="flex-shrink-0 mt-0.5 text-orange-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-800">
                            Email chưa được xác minh
                          </p>
                          <p className="mt-1 text-xs text-orange-700">
                            Vui lòng xác minh email để tăng độ tin cậy của tài
                            khoản
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleResendVerification}
                        disabled={sendingVerification || cooldownTime > 0}
                        className={`mt-2 w-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-lg ${
                          sendingVerification || cooldownTime > 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow hover:shadow-lg"
                        }`}
                      >
                        {sendingVerification ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                            Đang gửi...
                          </span>
                        ) : cooldownTime > 0 ? (
                          `Vui lòng đợi ${cooldownTime}s`
                        ) : (
                          "Gửi email xác minh"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <FaPhone className="inline mr-2 text-gray-500" />
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Gender & Birth Date - Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <FaVenusMars className="inline mr-2 text-gray-500" />
                      Giới tính
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <FaBirthdayCake className="inline mr-2 text-gray-500" />
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                        setFormData({ ...formData, birthDate: e.target.value })
                      }
                      className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* ID Number */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <FaIdCard className="inline mr-2 text-gray-500" />
                    CCCD/CMND
                  </label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, idNumber: e.target.value })
                    }
                    placeholder="Nhập số CCCD/CMND"
                    className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Thông tin này giúp xác minh danh tính của bạn
                  </p>
                </div>

                {/* Organization */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <FaBuilding className="inline mr-2 text-gray-500" />
                    Tổ chức/Công ty
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    placeholder="Nhập tên tổ chức/công ty (nếu có)"
                    className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <FaMapMarkerAlt className="inline mr-2 text-gray-500" />
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Nhập địa chỉ"
                    className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* City & Country - Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <FaCity className="inline mr-2 text-gray-500" />
                      Thành phố
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Nhập thành phố"
                      className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <FaGlobe className="inline mr-2 text-gray-500" />
                      Quốc gia
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      placeholder="Nhập quốc gia"
                      className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <FaFileAlt className="inline mr-2 text-gray-500" />
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Viết vài dòng giới thiệu về bản thân..."
                    rows={4}
                    className="w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-6 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform ${
                      saving || uploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:-translate-y-0.5"
                    }`}
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={saving || uploading}
                    className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Section */}
            <div className="p-6 mt-6 bg-white shadow-lg sm:p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Đổi mật khẩu
                </h2>
                <button
                  onClick={() => {
                    setShowPasswordSection(!showPasswordSection);
                    if (!showPasswordSection) {
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-200 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  {showPasswordSection ? "Hủy bỏ" : "Đổi mật khẩu"}
                </button>
              </div>

              {showPasswordSection && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <FaLock className="inline mr-2 text-gray-500" />
                      Mật khẩu hiện tại <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full px-4 py-3 pr-12 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <FaEyeSlash className="w-5 h-5" />
                        ) : (
                          <FaEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <FaLock className="inline mr-2 text-gray-500" />
                      Mật khẩu mới <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        className="w-full px-4 py-3 pr-12 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <FaEyeSlash className="w-5 h-5" />
                        ) : (
                          <FaEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {passwordData.newPassword &&
                      passwordData.newPassword.length < 6 && (
                        <p className="mt-1 text-xs text-red-600">
                          Mật khẩu phải có ít nhất 6 ký tự
                        </p>
                      )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <FaLock className="inline mr-2 text-gray-500" />
                      Xác nhận mật khẩu mới{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full px-4 py-3 pr-12 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="w-5 h-5" />
                        ) : (
                          <FaEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {passwordData.confirmPassword &&
                      passwordData.newPassword !==
                        passwordData.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">
                          Mật khẩu xác nhận không khớp
                        </p>
                      )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={
                        changingPassword ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword ||
                        passwordData.newPassword.length < 6 ||
                        passwordData.newPassword !==
                          passwordData.confirmPassword
                      }
                      className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform ${
                        changingPassword ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword ||
                        passwordData.newPassword.length < 6 ||
                        passwordData.newPassword !==
                          passwordData.confirmPassword
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
                      }`}
                    >
                      {changingPassword ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          <span>Đang xử lý...</span>
                        </>
                      ) : (
                        <>
                          <FaLock />
                          <span>Đổi mật khẩu</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Password Requirements Info */}
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-xl">
                    <h4 className="mb-2 text-sm font-semibold text-blue-900">
                      Yêu cầu mật khẩu:
                    </h4>
                    <ul className="space-y-1 text-xs text-blue-800">
                      <li>• Tối thiểu 6 ký tự</li>
                      <li>• Không được trùng với mật khẩu hiện tại</li>
                      <li>
                        • Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự
                        đặc biệt
                      </li>
                    </ul>
                  </div>
                </form>
              )}
            </div>

            {/* Info Card */}
            <div className="p-6 mt-6 border-l-4 border-red-500 bg-red-50 rounded-xl">
              <h3 className="mb-2 font-semibold text-red-900">
                Lưu ý quan trọng
              </h3>
              <ul className="space-y-1 text-sm text-red-800">
                <li>
                  • Thông tin cá nhân giúp hệ thống xác minh và liên hệ khi cần
                  thiết
                </li>
                <li>
                  • CCCD/CMND chỉ dùng để xác minh danh tính, không chia sẻ công
                  khai
                </li>
                <li>• Email không thể thay đổi sau khi đã đăng ký</li>
                <li>
                  • Ảnh đại diện và họ tên sẽ hiển thị công khai trên hệ thống
                </li>
                <li>
                  • Thông tin càng đầy đủ, độ tin cậy của báo cáo càng cao
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
