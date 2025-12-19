"use client";
import { useEffect, useState } from "react";
import { FaBan, FaUser, FaClock, FaTrash, FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";

interface BannedUser {
  id: number;
  email: string;
  fullName: string | null;
  isBanned: boolean;
  banReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function BlacklistPage() {
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const fetchBannedUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/banned-users`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải danh sách đen");
      }

      const data = await response.json();
      setBannedUsers(data);
    } catch (error) {
      console.error("Error fetching banned users:", error);
      toast.error("Không thể tải danh sách người dùng bị cấm");
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async (id: number) => {
    if (!confirm("Bạn có chắc muốn gỡ cấm người dùng này?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/unban/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Không thể gỡ cấm");
      }

      toast.success("Đã gỡ cấm thành công");
      fetchBannedUsers();
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error("Không thể gỡ cấm người dùng");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-solid rounded-full border-r-transparent animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-xl">
              <FaBan className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Danh sách đen
              </h1>
              <p className="text-sm text-gray-600">
                Quản lý người dùng bị cấm truy cập hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        {bannedUsers.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg shadow-sm">
            <FaBan className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">Không có người dùng bị cấm</p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      Lý do
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      Ngày cấm
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bannedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 text-white bg-red-500 rounded-full">
                            <FaUser className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.fullName || "Chưa cập nhật"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.banReason || "Không có lý do"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          {new Date(user.updatedAt).toLocaleString("vi-VN")}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Tạo:{" "}
                          {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleUnban(user.id)}
                            className="flex items-center gap-2 px-3 py-2 text-green-600 transition-colors rounded-lg hover:bg-green-50"
                            title="Gỡ cấm"
                          >
                            <FaCheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Gỡ cấm</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
