"use client";
import { AuthService } from "@/services/AuthService";
import { ReportService } from "@/services/ReportService";
import { User } from "@/types/UserType";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaHome,
  FaFileAlt,
  FaSearch,
  FaList,
  FaQuestionCircle,
} from "react-icons/fa";

type DateUpdated = {
  day: number;
  month: number;
  year: number;
};

const UserHeader = () => {
  const pathname = usePathname();
  const [profile, setProfile] = useState<User | null>(null);
  const [dateUpdated, setDateUpdated] = useState<DateUpdated | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await AuthService.getProfile();
        console.log("User profile:", userProfile);
        setProfile(userProfile.user);
      } catch (error) {
        console.warn("Không lấy được profile:", error);
        setProfile(null);
      }
    };
    fetchProfile();
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
      setProfile(null);
      setUserMenuOpen(false);
    });
  };

  const navigationItems = [
    {
      href: "/",
      label: "Trang chủ",
      icon: FaHome,
      active: pathname === "/",
    },
    {
      href: "/bao-cao",
      label: "Báo cáo",
      icon: FaFileAlt,
      active: pathname === "/bao-cao",
    },
    {
      href: "/tra-cuu",
      label: "Tra cứu",
      icon: FaSearch,
      active: pathname === "/tra-cuu",
    },
    {
      href: "/danh-sach-den",
      label: "Danh sách đen",
      icon: FaList,
      active: pathname === "/danh-sach-den",
    },
    {
      href: "/ho-tro",
      label: "Hỗ trợ",
      icon: FaQuestionCircle,
      active: pathname === "/ho-tro",
    },
  ];

  // Function to get current page breadcrumb
  const getCurrentPageBreadcrumb = () => {
    const currentItem = navigationItems.find((item) => item.active);
    return currentItem?.label || "Trang chủ";
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-lg">
        {/* Main Header */}
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/logo.webp"
                  alt="Logo"
                  width={64} // hoặc giá trị gốc của ảnh
                  height={64}
                  className="w-12 h-12 transition-transform sm:w-16 sm:h-16 group-hover:scale-105"
                />
                <div className="absolute inset-0 transition-opacity rounded-full opacity-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 group-hover:opacity-100"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-transparent lg:text-2xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text">
                  ScamReport
                </h1>
                <p className="text-xs text-gray-600">Báo cáo lừa đảo</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="items-center hidden space-x-1 lg:flex">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                    item.active
                      ? "bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border-b-2 border-red-600 shadow-sm"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 transition-all duration-200 ${
                      item.active
                        ? "text-red-600 scale-110"
                        : "opacity-70 group-hover:opacity-100 group-hover:scale-105"
                    }`}
                  />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Section */}
            <div className="items-center hidden gap-3 lg:flex">
              {!profile ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dang-nhap"
                    className="px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-200 border border-red-600 rounded-lg hover:bg-red-50 hover:shadow-md"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/dang-ky"
                    className="px-4 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Đăng ký
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                      {profile.fullName?.charAt(0) ||
                        profile.email?.charAt(0) ||
                        "U"}
                    </div>
                    <span className="truncate max-w-32">
                      {profile.fullName || profile.email}
                    </span>
                    <FaChevronDown
                      className={`w-3 h-3 transition-transform ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 z-50 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {profile.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {profile.email}
                        </p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-3 py-2 text-sm text-left text-red-600 transition-colors hover:bg-red-50"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 transition-colors rounded-lg lg:hidden hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Breadcrumb Bar */}
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Trang chủ</span>
                {pathname !== "/" && (
                  <>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-red-600">
                      {getCurrentPageBreadcrumb()}
                    </span>
                  </>
                )}
              </div>
              {dateUpdated && (
                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-gray-500 sm:inline">
                    Cập nhật mới nhất:
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-sm bg-gradient-to-r from-gray-800 to-gray-900">
                    {dateUpdated.day}/{dateUpdated.month}/{dateUpdated.year}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full max-w-full bg-white shadow-xl w-80">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 rounded-lg hover:text-gray-900"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4">
              {/* Mobile Navigation */}
              <nav className="mb-6 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                      item.active
                        ? "bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border-l-4 border-red-600 shadow-sm"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-all duration-200 ${
                        item.active ? "text-red-600 scale-110" : ""
                      }`}
                    />
                    {item.label}
                    {item.active && (
                      <div className="absolute w-2 h-2 bg-red-600 rounded-full right-4 animate-pulse"></div>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth */}
              {!profile ? (
                <div className="pt-6 space-y-3 border-t">
                  <Link
                    href="/dang-nhap"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center text-red-600 transition-colors border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/dang-ky"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center text-white transition-colors rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    Đăng ký
                  </Link>
                </div>
              ) : (
                <div className="pt-6 border-t">
                  <div className="flex items-center gap-3 p-4 mb-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center w-12 h-12 font-semibold text-white rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                      {profile.fullName?.charAt(0) ||
                        profile.email?.charAt(0) ||
                        "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {profile.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-center text-red-600 transition-colors border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default UserHeader;
