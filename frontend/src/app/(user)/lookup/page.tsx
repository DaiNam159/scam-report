"use client";

import LookupForm from "@/components/user/lookup/LookupForm";
import LookupResult from "@/components/user/lookup/LookupResult";
import { ShieldAlert, Search, Info } from "lucide-react";
import { useState } from "react";

export default function LookupPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/lookup?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Lỗi khi tra cứu:", err);
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <ShieldAlert className="w-14 h-14 text-[#e53935] animate-pulse mb-2" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#e53935] tracking-tight drop-shadow">
            Tra cứu thông tin lừa đảo
          </h1>
          <p className="text-gray-700 text-lg text-center mb-2 max-w-2xl">
            Kiểm tra số điện thoại, email, tài khoản ngân hàng, website, mạng xã
            hội... để phát hiện dấu hiệu lừa đảo trước khi giao dịch.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Info className="w-4 h-4" />
            <span>
              Dữ liệu tổng hợp từ cộng đồng và chuyên gia, cập nhật liên tục.
            </span>
          </div>
        </div>
        <div className="w-full mb-6">
          <LookupForm onSearch={handleSearch} />
        </div>
        <div className="w-full mb-8">
          <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-600">
            <span className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              Ví dụ: 0912345678
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              Ví dụ: scam@email.com
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              Ví dụ: http://abc.com
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              Ví dụ: 123456789 (STK ngân hàng)
            </span>
          </div>
        </div>
        <div className="w-full">
          <LookupResult loading={loading} result={result} />
        </div>
        <div className="w-full mt-10">
          <div className="bg-yellow-50 border-l-4 border-[#fbc02d] rounded-xl p-4 flex items-start gap-3">
            <Search className="w-6 h-6 text-[#fbc02d] mt-1" />
            <div className="text-gray-700 text-sm">
              <b>Lưu ý:</b> Nếu không tìm thấy thông tin, hãy luôn cảnh giác khi
              giao dịch, không cung cấp mã OTP, mật khẩu, hoặc chuyển tiền cho
              đối tượng chưa xác thực. Nếu phát hiện lừa đảo, hãy{" "}
              <a
                href="/report"
                className="text-[#e53935] font-semibold underline hover:text-red-700"
              >
                báo cáo ngay
              </a>{" "}
              để bảo vệ cộng đồng!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
