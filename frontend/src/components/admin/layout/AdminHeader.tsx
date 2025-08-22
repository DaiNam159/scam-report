"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaTachometerAlt,
  FaFileAlt,
  FaUsers,
  FaSignOutAlt,
  FaBell,
  FaChevronDown,
} from "react-icons/fa";

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  userDropdownOpen: boolean;
  setUserDropdownOpen: (open: boolean) => void;
  adminUser: any;
  onLogout: () => void;
}

export default function AdminHeader({
  setSidebarOpen,
  userDropdownOpen,
  setUserDropdownOpen,
  adminUser,
  onLogout,
}: AdminHeaderProps) {
  const pathname = usePathname();

  // Navigation items for getting page title
  const navigationItems = [
    {
      href: "/admin/dashboard",
      icon: FaTachometerAlt,
      label: "Bảng điều khiển",
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/bao-cao",
      icon: FaFileAlt,
      label: "Quản lý báo cáo",
      active: pathname === "/admin/bao-cao",
    },
    {
      href: "/admin/nguoi-dung",
      icon: FaUsers,
      label: "Quản lý người dùng",
      active: pathname === "/admin/nguoi-dung",
    },
  ];

  // Get page title based on current path
  const getPageTitle = () => {
    const currentItem = navigationItems.find((item) => item.active);
    return currentItem?.label || "Admin Dashboard";
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-600 transition-colors rounded-lg lg:hidden hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars size={20} />
          </button>

          {/* Page Title */}
          <div className="relative">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              {navigationItems.find((item) => item.active)?.icon && (
                <div className="p-2 rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-indigo-600">
                  {React.createElement(
                    navigationItems.find((item) => item.active)!.icon,
                    {
                      className: "w-5 h-5 text-white",
                    }
                  )}
                </div>
              )}
              {getPageTitle()}
            </h2>
            <p className="hidden text-sm text-gray-500 sm:block">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
            <FaBell size={18} />
            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1 animate-pulse"></span>
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-3 p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                  {adminUser?.fullName?.charAt(0) ||
                    adminUser?.email?.charAt(0) ||
                    "A"}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {adminUser?.fullName || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Quản trị viên</p>
                </div>
              </div>
              <FaChevronDown
                className={`w-3 h-3 transition-transform ${
                  userDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 z-50 w-56 mt-2 bg-white border border-gray-200 shadow-lg top-full rounded-xl">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                      {adminUser?.fullName?.charAt(0) ||
                        adminUser?.email?.charAt(0) ||
                        "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {adminUser?.fullName || adminUser?.email || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {adminUser?.email}
                      </p>
                      <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                        Quản trị viên
                      </span>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 sm:px-6">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/admin/dashboard"
            className="font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            Trang chủ
          </Link>
          <span className="text-gray-400">/</span>
          <span className="px-2 py-1 font-semibold text-blue-700 rounded-md bg-blue-50">
            {getPageTitle()}
          </span>
        </div>
      </div>
    </header>
  );
}
