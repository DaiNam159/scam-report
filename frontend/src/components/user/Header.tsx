import Link from "next/link";

const UserHeader = () => {
  return (
    <header className="bg-white text-black px-6 shadow-md">
      <div className="flex items-center gap-4 w-full justify-between py-4 px-5 ps-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.webp" alt="Logo" className="w-20" />
        </Link>
        {/* Menu */}
        <nav className="flex space-x-6 ml-8">
          <Link
            href="/"
            className="font-semibold text-lg text-black hover:text-red-600 transition"
          >
            Trang chủ
          </Link>
          <Link
            href="/report"
            className="font-semibold text-lg text-black hover:text-red-600 transition"
          >
            Báo cáo
          </Link>
          <Link
            href="/lookup"
            className="font-semibold text-lg text-black hover:text-red-600 transition"
          >
            Tra cứu
          </Link>
          <Link
            href="/blacklist"
            className="font-semibold text-lg text-black hover:text-red-600 transition"
          >
            Danh sách đen
          </Link>
          <Link
            href="/support"
            className="font-semibold text-lg text-black hover:text-red-600 transition"
          >
            Hỗ trợ
          </Link>
        </nav>
        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded border border-red-600 text-red-600 font-semibold hover:bg-red-50 hover:text-red-700 transition"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Đăng ký
          </Link>
        </div>
      </div>
      {/* Site map & Ngày cập nhật */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-2 pb-1 px-1 text-base">
        <div className="text-gray-600 font-medium">Trang chủ / Tra cứu</div>
        <div>
          <span className="bg-black text-white px-3 py-1 rounded text-xs font-semibold">
            Cập nhật ngày 31/05/2025
          </span>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
