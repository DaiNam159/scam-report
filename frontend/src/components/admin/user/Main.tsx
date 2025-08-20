"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { UserService } from "@/services/UserService";
import UserFilter, { UserFilters } from "@/components/admin/user/UserFilter";
import UsersTable from "@/components/admin/user/UsersTable";
import {
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaUserCheck,
  FaUser,
} from "react-icons/fa";

interface User {
  id: number;
  email: string;
  name?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export default function UserManagementComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [totalInactiveUsers, setTotalInactiveUsers] = useState(0);
  const [filters, setFilters] = useState<UserFilters>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [lastValidPagination, setLastValidPagination] = useState<{
    page: number;
    totalPages: number;
    pageNumbers: (number | string)[];
  }>({
    page: 1,
    totalPages: 1,
    pageNumbers: [],
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = useCallback(
    async (
      currentPage = 1,
      filterParams?: UserFilters,
      sortKey = sortBy,
      sortDir = sortOrder
    ) => {
      try {
        setIsFiltering(true);
        const data = await UserService.getAllUsers(currentPage, limit, {
          ...filterParams,
          sortBy: sortKey,
          sortOrder: sortDir,
        });

        setUsers(data.data);
        const newTotalPages = Math.ceil(data.total / limit);
        setTotalPages(newTotalPages);
        setPage(currentPage);
        setLastValidPagination({
          page: currentPage,
          totalPages: newTotalPages,
          pageNumbers: calculatePageNumbers(currentPage, newTotalPages),
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setTimeout(() => {
          setIsFiltering(false);
        }, 100);
      }
    },
    [sortBy, sortOrder, limit]
  );
  useEffect(() => {
    if (users.length === 0) return;
    console.log("Users fetched:", users);
  }, [users]);
  const fetchStats = async () => {
    try {
      const data = await UserService.getAllUsers(1, 9999);
      console.log("Fetched user stats:", data);
      const activeUsers = data.data.filter(
        (user: User) => user.isActive
      ).length;
      const inactiveUsers = data.data.filter(
        (user: User) => !user.isActive
      ).length;

      setTotalUsers(data.total);
      setTotalActiveUsers(activeUsers);
      setTotalInactiveUsers(inactiveUsers);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email,
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await UserService.updateUser(selectedUser.id, editForm);
      setIsEditDialogOpen(false);
      fetchUsers(page, filters);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      await UserService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setTotalUsers((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }, []);

  const handleToggleStatus = useCallback(
    async (id: number, isActive: boolean) => {
      try {
        if (isActive) {
          await UserService.enableUser(id);
          setTotalActiveUsers((prev) => prev + 1);
          setTotalInactiveUsers((prev) => prev - 1);
        } else {
          await UserService.disableUser(id);
          setTotalActiveUsers((prev) => prev - 1);
          setTotalInactiveUsers((prev) => prev + 1);
        }
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isActive } : u))
        );
      } catch (error) {
        console.error("Error toggling user status:", error);
      }
    },
    []
  );

  const handleFilter = useCallback(
    (newFilters: UserFilters) => {
      setFilters(newFilters);
      setPage(1);
      fetchUsers(1, newFilters);
    },
    [fetchUsers]
  );

  const handleResetFilter = useCallback(() => {
    setFilters({});
    setPage(1);
    fetchUsers(1, {});
  }, [fetchUsers]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchUsers(newPage, filters);
    },
    [fetchUsers, filters]
  );

  const handleSortChange = useCallback(
    (column: string, direction: "ASC" | "DESC") => {
      setSortBy(column);
      setSortOrder(direction);
      fetchUsers(page, filters, column, direction);
    },
    [page, filters, fetchUsers]
  );

  const calculatePageNumbers = useCallback(
    (currentPage: number, totalPagesCount: number): (number | string)[] => {
      const maxPagesToShow = 5;
      const pages: (number | string)[] = [];
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPagesCount, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPagesCount) {
        if (endPage < totalPagesCount - 1) pages.push("...");
        pages.push(totalPagesCount);
      }

      return pages;
    },
    []
  );

  const calculatedPageNumbers = useMemo((): (number | string)[] => {
    if (isFiltering) {
      return lastValidPagination.pageNumbers;
    }
    return calculatePageNumbers(page, totalPages);
  }, [
    page,
    totalPages,
    isFiltering,
    lastValidPagination.pageNumbers,
    calculatePageNumbers,
  ]);

  const displayPage = isFiltering ? lastValidPagination.page : page;
  const displayTotalPages = isFiltering
    ? lastValidPagination.totalPages
    : totalPages;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-solid rounded-full border-r-transparent animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FaUsers className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Quản lý người dùng
          </h1>
        </div>
        <p className="text-sm text-gray-600 md:text-base">
          Quản lý thông tin người dùng và quyền truy cập hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng người dùng
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {totalActiveUsers}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaUserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vô hiệu hóa</p>
              <p className="text-2xl font-bold text-red-600">
                {totalInactiveUsers}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaUser className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* User Filter */}
      <UserFilter onFilter={handleFilter} onReset={handleResetFilter} />

      {/* Users Table with fixed height */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div
          className="transition-opacity duration-200 ease-in-out"
          style={{
            minHeight: "600px",
            opacity: isFiltering ? 0.6 : 1,
          }}
        >
          {isFiltering ? (
            // Skeleton loading
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-separate border-spacing-0">
                <thead>
                  <tr className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                    {[...Array(6)].map((_, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-xs font-semibold text-gray-300 uppercase border-b border-blue-200"
                      >
                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {[...Array(8)].map((_, i) => (
                    <tr key={i} className="h-[72px]">
                      {[...Array(6)].map((_, j) => (
                        <td
                          key={j}
                          className="px-6 py-4 border-b border-blue-50 h-[72px]"
                        >
                          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <UsersTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onSortChange={handleSortChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setIsEditDialogOpen(false)}
            />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Chỉnh sửa người dùng
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Tên
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Nhập tên người dùng"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    placeholder="Nhập email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col items-center justify-center gap-4 mt-8">
        <div
          className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 shadow-sm rounded-xl"
          style={{
            opacity: isFiltering ? 0.6 : 1,
            pointerEvents: isFiltering ? "none" : "auto",
          }}
        >
          <button
            disabled={displayPage <= 1 || isFiltering}
            onClick={() => handlePageChange(displayPage - 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200"
            aria-label="Trang trước"
          >
            <FaChevronLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Trước</span>
          </button>

          <div className="flex items-center gap-1 mx-4">
            {calculatedPageNumbers.map((pageNum, index) =>
              pageNum === "..." ? (
                <span
                  key={`${pageNum}-${index}`}
                  className="px-3 py-2 text-sm font-medium text-gray-400 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`${pageNum}-${index}`}
                  onClick={() =>
                    !isFiltering && handlePageChange(Number(pageNum))
                  }
                  disabled={isFiltering}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border
                  ${
                    displayPage === pageNum
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200"
                  }`}
                  aria-current={displayPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          <button
            disabled={displayPage >= displayTotalPages || isFiltering}
            onClick={() => handlePageChange(displayPage + 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200"
            aria-label="Trang sau"
          >
            <span className="hidden sm:inline">Sau</span>
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div
          className="text-sm font-medium text-gray-500"
          style={{
            opacity: isFiltering ? 0.6 : 1,
          }}
        >
          {isFiltering ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
              <span>Đang tải trang {displayPage}...</span>
            </div>
          ) : (
            <>
              Hiển thị trang {displayPage} / {displayTotalPages}
              {Object.values(filters).some((v) => v !== undefined) && (
                <span className="ml-2 text-blue-600">(đã lọc)</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
