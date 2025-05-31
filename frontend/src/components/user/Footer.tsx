import Link from "next/link";

const UserFooter = () => (
  <footer className="bg-gradient-to-r from-[#fff8f6] to-[#fffde7] border-t border-gray-100 mt-20 pt-12 pb-6 px-4 text-gray-700">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
      {/* Logo & Slogan */}
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo.webp"
            alt="Logo"
            className="w-14 h-14 rounded-full shadow"
          />
          <span className="font-extrabold text-2xl text-[#e53935]">
            Scam Report
          </span>
        </div>
        <span className="text-base text-gray-600 mt-2 font-medium">
          Báo cáo & Cảnh báo lừa đảo trực tuyến
          <br />
          Vì một cộng đồng mạng an toàn!
        </span>
      </div>
      {/* Menu */}
      <div>
        <div className="font-semibold text-[#e53935] mb-3 text-lg">
          Liên kết
        </div>
        <nav className="flex flex-col gap-2 text-base font-medium">
          <Link href="/" className="hover:text-[#e53935] transition">
            Trang chủ
          </Link>
          <Link href="/report" className="hover:text-[#e53935] transition">
            Báo cáo lừa đảo
          </Link>
          <Link href="/lookup" className="hover:text-[#e53935] transition">
            Tra cứu
          </Link>
          <Link href="/blacklist" className="hover:text-[#e53935] transition">
            Danh sách đen
          </Link>
          <Link href="/news" className="hover:text-[#e53935] transition">
            Tin tức
          </Link>
          <Link href="/support" className="hover:text-[#e53935] transition">
            Hỗ trợ
          </Link>
        </nav>
      </div>
      {/* Contact */}
      <div>
        <div className="font-semibold text-[#e53935] mb-3 text-lg">Liên hệ</div>
        <div className="text-base mb-1">
          Email:{" "}
          <a
            href="mailto:support@scamreport.vn"
            className="text-[#e53935] hover:underline"
          >
            support@scamreport.vn
          </a>
        </div>
        <div className="text-base mb-1">
          Địa chỉ: 123 Đường An Toàn, Quận 1, TP.HCM
        </div>
        <div className="text-base mb-1">
          Hotline:{" "}
          <a href="tel:19001234" className="text-[#e53935] hover:underline">
            1900 1234
          </a>
        </div>
        <div className="flex gap-3 mt-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
          >
            <img
              src="/facebook-brands.svg"
              alt="Facebook"
              className="w-7 h-7 opacity-80 hover:opacity-100 transition"
            />
          </a>
          <a
            href="https://zalo.me"
            target="_blank"
            rel="noopener"
            aria-label="Zalo"
          >
            <img
              src="/zalo-seeklogo.svg"
              alt="Zalo"
              className="w-7 h-7 opacity-80 hover:opacity-100 transition"
            />
          </a>
        </div>
      </div>
      {/* Policy */}
      <div>
        <div className="font-semibold text-[#e53935] mb-3 text-lg">
          Chính sách
        </div>
        <nav className="flex flex-col gap-2 text-base font-medium">
          <Link href="/privacy" className="hover:text-[#e53935] transition">
            Chính sách bảo mật
          </Link>
          <Link href="/terms" className="hover:text-[#e53935] transition">
            Điều khoản sử dụng
          </Link>
        </nav>
        <div className="mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-[#e53935]">Scam Report</span>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-10 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
      Một sản phẩm vì cộng đồng | Thiết kế hiện đại, bảo mật & thân thiện người
      dùng.
    </div>
  </footer>
);

export default UserFooter;
