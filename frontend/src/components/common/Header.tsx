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
      <header className="sticky top-0 z-[9999] bg-white border-b border-gray-200 shadow-lg">
        {/* Main Header */}
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 lg:px-8 lg:py-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center flex-shrink-0 min-w-0 gap-1 sm:gap-2 lg:gap-3 group"
            >
              <div className="relative flex-shrink-0">
                <Image
                  src="/logo.webp"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="w-8 h-8 transition-transform sm:w-10 sm:h-10 lg:w-16 lg:h-16 group-hover:scale-105"
                />
                <div className="absolute inset-0 transition-opacity rounded-full opacity-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 group-hover:opacity-100"></div>
              </div>
              <div className="hidden min-w-0 sm:block">
                <h1 className="text-base font-bold text-transparent truncate sm:text-lg lg:text-2xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text">
                  ScamReport
                </h1>
                <p className="hidden text-xs text-gray-600 lg:block">
                  Báo cáo lừa đảo
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="items-center hidden space-x-1 lg:flex">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-2 px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
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
            <div className="items-center flex-shrink-0 hidden gap-2 lg:gap-3 lg:flex">
              {!profile ? (
                <div className="flex items-center gap-2 lg:gap-3">
                  <Link
                    href="/dang-nhap"
                    className="px-3 py-2 text-sm font-semibold text-red-600 transition-all duration-200 border border-red-600 rounded-lg lg:px-4 hover:bg-red-50 hover:shadow-md whitespace-nowrap"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/dang-ky"
                    className="px-3 lg:px-4 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
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
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                      {profile.fullName?.charAt(0) ||
                        profile.email?.charAt(0) ||
                        "U"}
                    </div>
                    <span className="truncate max-w-24 lg:max-w-32">
                      {profile.fullName || profile.email}
                    </span>
                    <FaChevronDown
                      className={`w-3 h-3 transition-transform flex-shrink-0 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 z-[10000] w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
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

            {/* Mobile Auth + Menu Section */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Mobile Auth Buttons - Show when not logged in */}
              {!profile && (
                <div className="flex items-center gap-1">
                  <Link
                    href="/dang-nhap"
                    className="px-2 py-1 text-xs font-semibold text-red-600 transition-all duration-200 border border-red-600 rounded hover:bg-red-50 whitespace-nowrap"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}

              {/* Mobile User Avatar - Show when logged in */}
              {profile && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white rounded-full w-7 h-7 bg-gradient-to-r from-red-500 to-orange-500">
                    {profile.fullName?.charAt(0) ||
                      profile.email?.charAt(0) ||
                      "U"}
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex-shrink-0 p-2 text-gray-600 transition-colors rounded-lg hover:text-gray-900 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb Bar */}
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between px-3 py-1 sm:px-4 sm:py-2 lg:px-8">
              <div className="flex-1 min-w-0 text-xs text-gray-600 truncate sm:text-sm">
                <span className="font-medium">Trang chủ</span>
                {pathname !== "/" && (
                  <>
                    <span className="mx-1 sm:mx-2">/</span>
                    <span className="font-semibold text-red-600 truncate">
                      {getCurrentPageBreadcrumb()}
                    </span>
                  </>
                )}
              </div>
              {dateUpdated && (
                <div className="flex items-center flex-shrink-0 gap-1 sm:gap-2">
                  <span className="hidden text-xs text-gray-500 sm:inline">
                    Cập nhật:
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold text-white rounded-full shadow-sm bg-gradient-to-r from-gray-800 to-gray-900 whitespace-nowrap">
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
        <div className="fixed inset-0 z-[10000] lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full max-w-full bg-white shadow-xl w-72 sm:w-80">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.webp"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    ScamReport
                  </h3>
                  <p className="text-xs text-gray-600">Menu</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-white/50"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="h-full p-4 pb-20 overflow-y-auto">
              {/* Mobile User Info - Show at top when logged in */}
              {profile && (
                <div className="p-4 mb-6 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 font-semibold text-white rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                      {profile.fullName?.charAt(0) ||
                        profile.email?.charAt(0) ||
                        "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {profile.fullName || "Người dùng"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                      className={`w-5 h-5 transition-all duration-200 flex-shrink-0 ${
                        item.active ? "text-red-600 scale-110" : ""
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                    {item.active && (
                      <div className="absolute w-2 h-2 bg-red-600 rounded-full right-4 animate-pulse"></div>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Actions */}
              <div className="pt-6 space-y-3 border-t border-gray-200">
                {!profile ? (
                  <>
                    <Link
                      href="/dang-nhap"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-3 text-center text-red-600 transition-colors border border-red-600 rounded-lg hover:bg-red-50"
                    >
                      <span className="font-semibold">Đăng nhập</span>
                    </Link>
                    <Link
                      href="/dang-ky"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-3 text-center text-white transition-colors rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      <span className="font-semibold">Đăng ký</span>
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 text-center text-red-600 transition-colors border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    <span className="font-semibold">Đăng xuất</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default UserHeader;
