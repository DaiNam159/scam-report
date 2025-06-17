"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthService } from "@/services/AuthService";
import Link from "next/link";
import { FaBars, FaTimes, FaTachometerAlt, FaFileAlt } from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await AuthService.getProfile();
        if (!res.isLoggedIn || !res.user.isAdmin) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      } catch (err) {
        router.push("/login");
      }
    };
    fetchProfile();
  }, [router]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        Đang tải...
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:inset-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="mt-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center px-4 py-2 hover:bg-gray-700"
          >
            <FaTachometerAlt className="mr-2" /> Bảng điều khiển
          </Link>
          <Link
            href="/admin/report"
            className="flex items-center px-4 py-2 hover:bg-gray-700"
          >
            <FaFileAlt className="mr-2" /> Quản lý báo cáo
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <button
            className="text-gray-800 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={async () => {
                await AuthService.logout();
                router.push("/login");
              }}
              className="px-4 py-2 text-white transition bg-red-500 rounded-md hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
