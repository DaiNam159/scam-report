"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTimes,
  FaTachometerAlt,
  FaFileAlt,
  FaUsers,
  FaHome,
  FaBan,
  FaNewspaper,
} from "react-icons/fa";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Navigation items
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
    {
      href: "/admin/tin-tuc",
      icon: FaNewspaper,
      label: "Quản lý tin tức",
      active: pathname?.startsWith("/admin/tin-tuc"),
    },
    {
      href: "/admin/danh-sach-den",
      icon: FaBan,
      label: "Danh sách đen",
      active: pathname === "/admin/danh-sach-den",
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-linear-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white shadow-sm rounded-xl">
            <FaTachometerAlt className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-blue-100">Quản trị hệ thống</p>
          </div>
        </div>
        <button
          className="p-2 text-white transition-colors rounded-lg lg:hidden hover:bg-blue-800"
          onClick={() => setSidebarOpen(false)}
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                item.active
                  ? "bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600 shadow-md transform scale-105"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-102"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  item.active
                    ? "text-blue-600 scale-110"
                    : "text-gray-400 group-hover:text-gray-600 group-hover:scale-105"
                }`}
              />
              <span
                className={`font-medium ${item.active ? "font-semibold" : ""}`}
              >
                {item.label}
              </span>
              {item.active && (
                <div className="flex items-center gap-1 ml-auto">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="absolute right-0 w-1 h-8 transform -translate-y-1/2 rounded-l-full top-1/2 bg-linear-to-b from-blue-400 to-blue-600"></div>
                </div>
              )}
              {!item.active && (
                <div className="ml-auto transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <Link
          href="/"
          className="flex items-center gap-3 p-3 text-gray-600 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-white group"
        >
          <FaHome className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium">Về trang chủ</span>
        </Link>
      </div>
    </div>
  );
}
