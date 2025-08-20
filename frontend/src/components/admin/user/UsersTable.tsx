import { useState } from "react";
import {
  FaCheck,
  FaEdit,
  FaUsers,
  FaTimes,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserCheck,
  FaUser,
} from "react-icons/fa";

interface User {
  id: number;
  email: string;
  fullName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
  onSortChange?: (column: string, direction: "ASC" | "DESC") => void;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "name", label: "Tên", sortable: true },
  { key: "isActive", label: "Trạng thái", sortable: true },
  { key: "createdAt", label: "Ngày tạo", sortable: true },
  { key: "actions", label: "Thao tác", sortable: false },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function UsersTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  onSortChange,
  sortBy,
  sortOrder,
}: Props) {
  const [localSortBy, setLocalSortBy] = useState<string | undefined>(sortBy);
  const [localSortOrder, setLocalSortOrder] = useState<
    "ASC" | "DESC" | undefined
  >(sortOrder);

  const handleSort = (key: string) => {
    if (!onSortChange) return;
    let direction: "ASC" | "DESC" = "ASC";
    if (localSortBy === key) {
      direction = localSortOrder === "ASC" ? "DESC" : "ASC";
    }
    setLocalSortBy(key);
    setLocalSortOrder(direction);
    onSortChange(key, direction);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-separate border-spacing-0">
        <thead>
          <tr className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
            {columns.map((col) =>
              col.key === "actions" ? (
                <th
                  key={col.key}
                  className="px-6 py-3 font-semibold text-gray-900 uppercase text-xs border-b border-blue-200 w-[140px] min-w-[140px] max-w-[140px] text-center"
                >
                  {col.label}
                </th>
              ) : (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-xs font-semibold text-gray-900 uppercase border-b border-blue-200 select-none ${
                    col.sortable ? "cursor-pointer group" : ""
                  }`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <>
                        {localSortBy === col.key ? (
                          localSortOrder === "ASC" ? (
                            <FaSortUp className="inline w-3 h-3 text-blue-600" />
                          ) : (
                            <FaSortDown className="inline w-3 h-3 text-blue-600" />
                          )
                        ) : (
                          <FaSort className="inline w-3 h-3 text-gray-400 group-hover:text-blue-400" />
                        )}
                      </>
                    )}
                  </span>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white">
          {users.map((user, idx) => (
            <tr
              key={user.id}
              className={`transition-colors h-[72px] ${
                idx % 2 === 0 ? "bg-white" : "bg-blue-50"
              } hover:bg-blue-100`}
            >
              <td className="sticky left-0 z-0 px-6 py-4 font-medium text-gray-900 bg-white border-b whitespace-nowrap border-blue-50 h-[72px]">
                #{user.id}
              </td>
              <td className="px-6 py-4 text-gray-900 border-b border-blue-50 h-[72px]">
                <div className="max-w-xs font-medium truncate">
                  {user.email}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-900 border-b border-blue-50 h-[72px]">
                <div className="max-w-xs truncate">
                  {user.fullName || "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 border-b border-blue-50 whitespace-nowrap h-[72px]">
                <div className="flex items-center h-full">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-1.5 ${
                        user.isActive ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                    {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-900 border-b border-blue-50 whitespace-nowrap h-[72px]">
                <div className="flex items-center h-full">
                  {formatDate(user.createdAt)}
                </div>
              </td>
              <td className="px-6 py-4 border-b border-blue-50 whitespace-nowrap w-[140px] min-w-[140px] max-w-[140px] text-center h-[72px]">
                <div className="flex items-center justify-center h-full">
                  <div className="grid grid-cols-2 gap-1 w-[120px]">
                    <button
                      onClick={() => onEdit(user)}
                      title="Chỉnh sửa"
                      className="flex items-center justify-center w-8 h-8 text-blue-700 transition border border-blue-100 rounded-full bg-blue-50 hover:bg-blue-100"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>

                    {user.isActive ? (
                      <button
                        onClick={() => onToggleStatus(user.id, false)}
                        title="Vô hiệu hóa"
                        className="flex items-center justify-center w-8 h-8 text-orange-700 transition border border-orange-100 rounded-full bg-orange-50 hover:bg-orange-100"
                      >
                        <FaUser className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(user.id, true)}
                        title="Kích hoạt"
                        className="flex items-center justify-center w-8 h-8 text-green-700 transition border border-green-100 rounded-full bg-green-50 hover:bg-green-100"
                      >
                        <FaUserCheck className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(user.id)}
                      title="Xóa"
                      className="flex items-center justify-center w-8 h-8 col-span-2 text-red-700 transition border border-red-100 rounded-full bg-red-50 hover:bg-red-100"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="py-12 text-center bg-white h-[200px]">
                <div className="flex flex-col items-center justify-center h-full">
                  <FaUsers className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Không có người dùng
                  </h3>
                  <p className="text-gray-500">
                    Chưa có người dùng nào được tạo.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
