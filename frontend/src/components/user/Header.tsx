"use client";
import { AuthService } from "@/services/AuthService";
import { ReportService } from "@/services/ReportService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type DateUpdated = {
  day: number;
  month: number;
  year: number;
};
const UserHeader = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [dateUpdated, setDateUpdated] = useState<DateUpdated | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await AuthService.getProfile(); // đúng cách
        setProfile(userProfile.user); // nếu null thì set null, nếu có thì set user
      } catch (error) {
        console.warn("Không lấy được profile:", error);
        setProfile(null); // fallback nếu lỗi
      }
    };
    fetchProfile(); // Gọi hàm async trong useEffect
  }, []);
  useEffect(() => {
    const fetchDateUpdated = async () => {
      try {
        const lastUpdated = await ReportService.getLastReportUpdate();
        setDateUpdated(lastUpdated);
      } catch (error) {
        console.error("Error fetching last report update:", error);
      }
    };
    fetchDateUpdated();
  }, []);
  const handleLogout = async () => {
    await AuthService.logout().then(() => {
      setProfile(null); // Xoá profile sau khi đăng xuất
    });
  };

  return (
    <header className="px-6 text-black bg-white shadow-md">
      <div className="flex items-center justify-between w-full gap-4 px-5 py-4 ps-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.webp" alt="Logo" className="w-20" />
        </Link>
        {/* Menu */}
        <nav className="flex ml-8 space-x-6">
          <Link
            href="/"
            className="text-lg font-semibold text-black transition hover:text-red-600"
          >
            Trang chủ
          </Link>
          <Link
            href="/report"
            className="text-lg font-semibold text-black transition hover:text-red-600"
          >
            Báo cáo
          </Link>
          <Link
            href="/lookup"
            className="text-lg font-semibold text-black transition hover:text-red-600"
          >
            Tra cứu
          </Link>
          <Link
            href="/blacklist"
            className="text-lg font-semibold text-black transition hover:text-red-600"
          >
            Danh sách đen
          </Link>
          <Link
            href="/support"
            className="text-lg font-semibold text-black transition hover:text-red-600"
          >
            Hỗ trợ
          </Link>
        </nav>
        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {!profile ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 font-semibold text-red-600 transition border border-red-600 rounded hover:bg-red-50 hover:text-red-700"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 font-semibold text-white transition bg-red-600 rounded hover:bg-red-700"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <span className="px-2 font-semibold text-red-600">
                {profile.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 font-semibold text-white transition bg-red-600 rounded hover:bg-red-700"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
      {/* Site map & Ngày cập nhật */}
      <div className="flex items-center justify-between px-1 pt-2 pb-1 text-base border-t border-gray-200">
        <div className="font-medium text-gray-600">Trang chủ / Tra cứu</div>
        <div>
          <span className="px-3 py-1 text-xs font-semibold text-white bg-black rounded">
            Cập nhật ngày {dateUpdated?.day}/{dateUpdated?.month}/
            {dateUpdated?.year}
          </span>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
