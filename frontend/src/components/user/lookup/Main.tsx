"use client";

import GoogleSafeResult from "@/components/user/lookup/GoogleSafeResult";
import LookupForm from "@/components/user/lookup/LookupForm";
import LookupResult from "@/components/user/lookup/LookupResult";
import { ReportService } from "@/services/ReportService";
import { SafetyService } from "@/services/SafetyService";
import {
  ShieldAlert,
  Search,
  Info,
  Sparkles,
  Users,
  Lightbulb,
  Star,
  Globe,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

export default function LookupComponent() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [googleSafeResult, setGoogleSafeResult] = useState<any>(null);
  const [urlCheckResults, setUrlCheckResults] = useState<any[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>("");

  const handleSearch = async (
    query: string,
    checkContent?: boolean,
    useGoogleSafe?: boolean
  ) => {
    setLoading(true);
    setResult(null);
    setUrlCheckResults([]);
    setCurrentQuery(query);
    try {
      if (useGoogleSafe) {
        // Khởi tạo state cho cả 2 API
        const initialResults = [
          { name: "Google Safe Browsing", loading: true, result: undefined },
          { name: "IPQS", loading: true, result: undefined },
        ];
        setUrlCheckResults([...initialResults]);

        // Gọi Google Safe Browsing trước
        try {
          const safeBrowsingResult =
            await SafetyService.checkUrlWithSafeBrowsing(query);

          // Cập nhật kết quả Google Safe Browsing
          setUrlCheckResults((prev) =>
            prev.map((api) =>
              api.name === "Google Safe Browsing"
                ? { ...api, loading: false, result: safeBrowsingResult }
                : api
            )
          );

          // Delay nhỏ để user thấy được kết quả từng bước
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error("Error with Safe Browsing:", error);
          setUrlCheckResults((prev) =>
            prev.map((api) =>
              api.name === "Google Safe Browsing"
                ? {
                    ...api,
                    loading: false,
                    result: {
                      isSafe: false,
                      error: "Lỗi khi kiểm tra với Google Safe Browsing",
                    },
                  }
                : api
            )
          );
        }

        // Sau đó gọi IPQS
        try {
          const ipqsResult = await SafetyService.checkUrlWithIPQS(query);

          // Cập nhật kết quả IPQS
          setUrlCheckResults((prev) =>
            prev.map((api) =>
              api.name === "IPQS"
                ? { ...api, loading: false, result: ipqsResult }
                : api
            )
          );
        } catch (error) {
          console.error("Error with IPQS:", error);
          setUrlCheckResults((prev) =>
            prev.map((api) =>
              api.name === "IPQS"
                ? {
                    ...api,
                    loading: false,
                    result: {
                      isSafe: false,
                      error: "Lỗi khi kiểm tra với IPQS",
                    },
                  }
                : api
            )
          );
        }
      } else {
        // Tìm báo cáo liên quan
        const data = await ReportService.relatedReports(query);
        setResult(data);
      }
    } catch (err) {
      console.error("Lỗi khi tra cứu:", err);
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };
  const QUICK_TIPS = [
    "Luôn kiểm tra kỹ thông tin người nhận trước khi chuyển tiền.",
    "Không chia sẻ mã OTP, mật khẩu với bất kỳ ai.",
    "Cảnh giác với các đường link lạ gửi qua SMS, email.",
    "Ưu tiên giao dịch qua các nền tảng uy tín, có bảo hiểm.",
  ];

  const FAQS = [
    {
      q: "Nếu không tìm thấy thông tin thì sao?",
      a: "Bạn vẫn nên cảnh giác, kiểm tra thêm ở nhiều nguồn và không chuyển tiền khi chưa xác thực.",
    },
    {
      q: "Tôi có thể tra cứu nội dung tin nhắn/email không?",
      a: "Có, bạn có thể dán nội dung vào ô tra cứu và chọn chế độ kiểm tra nội dung.",
    },
    {
      q: "Dữ liệu tra cứu lấy từ đâu?",
      a: "Dữ liệu tổng hợp từ cộng đồng, chuyên gia và các nguồn tin cậy.",
    },
    {
      q: "Tôi muốn đóng góp dữ liệu thì làm thế nào?",
      a: "Bạn có thể gửi báo cáo lừa đảo bằng nút bên dưới hoặc liên hệ với chúng tôi.",
    },
  ];

  // Thêm testimonials giả lập
  const TESTIMONIALS = [
    {
      name: "Nguyễn Văn B",
      avatar: <Users className="w-8 h-8 text-[#43a047]" />,
      text: "Nhờ tra cứu trên Scam Report, tôi đã tránh được một vụ lừa đảo chuyển khoản!",
    },
    {
      name: "Lê Thị C",
      avatar: <MessageCircle className="w-8 h-8 text-[#1e88e5]" />,
      text: "Tôi rất ấn tượng với tốc độ cập nhật dữ liệu và sự hỗ trợ từ cộng đồng.",
    },
    {
      name: "Trần D",
      avatar: <Globe className="w-8 h-8 text-[#e53935]" />,
      text: "Trang web rất hữu ích, giao diện thân thiện và dễ sử dụng.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 py-10 bg-gradient-to-br from-[#fff8e1] via-[#fbe9e7] to-[#e3f2fd]">
      <div className="flex flex-col w-full max-w-6xl gap-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Cột trái: Thống kê, mẹo, testimonial */}
          <div className="flex flex-col gap-6">
            {/* Thống kê nhanh */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-[#fbc02d]" />
                <span className="font-bold text-[#e53935] text-lg">
                  Thống kê cộng đồng
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center px-4 py-2 border border-yellow-100 shadow bg-yellow-50 rounded-2xl min-w-[90px]">
                  <span className="text-lg font-bold text-[#e53935]">
                    20,000+
                  </span>
                  <span className="text-xs text-gray-600">Lượt tra cứu</span>
                </div>
                <div className="flex flex-col items-center px-4 py-2 border border-yellow-100 shadow bg-yellow-50 rounded-2xl min-w-[90px]">
                  <span className="text-lg font-bold text-[#43a047]">
                    5,000+
                  </span>
                  <span className="text-xs text-gray-600">
                    Cảnh báo phát hiện
                  </span>
                </div>
                <div className="flex flex-col items-center px-4 py-2 border border-yellow-100 shadow bg-yellow-50 rounded-2xl min-w-[90px]">
                  <span className="text-lg font-bold text-[#1e88e5]">
                    3,200+
                  </span>
                  <span className="text-xs text-gray-600">
                    Người dùng đóng góp
                  </span>
                </div>
              </div>
            </div>
            {/* Mẹo phòng tránh */}
            <div className="bg-blue-50 border-l-4 border-[#1e88e5] rounded-xl p-4 flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-[#1e88e5] mt-1" />
              <div className="text-sm text-gray-700">
                <b>Mẹo phòng tránh:</b>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  {QUICK_TIPS.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Đánh giá người dùng */}
            <div className="p-4 bg-white border border-gray-100 shadow rounded-2xl">
              <div className="font-bold text-[#e53935] mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#fbc02d]" />
                Cảm nhận người dùng
              </div>
              <ul className="space-y-3">
                {TESTIMONIALS.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0">{t.avatar}</div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {t.name}
                      </div>
                      <div className="text-sm text-gray-600">{t.text}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Cột giữa: Form tra cứu */}
          <div className="flex flex-col items-center col-span-2">
            <div className="relative flex flex-col items-center w-full p-8 overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-3xl">
              <div className="absolute pointer-events-none -top-8 -right-8 opacity-10">
                <ShieldAlert className="w-40 h-40 text-[#e53935]" />
              </div>
              <div className="flex flex-col items-center w-full">
                <Sparkles className="w-10 h-10 text-[#fbc02d] mb-2 animate-bounce" />
                <h1 className="text-xl md:text-2xl font-bold text-center mb-2 text-[#e53935] tracking-tight drop-shadow flex items-center gap-2">
                  Tra cứu thông tin lừa đảo
                </h1>
                <p className="max-w-2xl mb-2 text-sm text-center text-gray-700">
                  Kiểm tra số điện thoại, email, tài khoản ngân hàng, website,
                  mạng xã hội... để phát hiện dấu hiệu lừa đảo trước khi giao
                  dịch.
                </p>
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <Info className="w-4 h-4" />
                  <span>
                    Dữ liệu tổng hợp từ cộng đồng và chuyên gia, cập nhật liên
                    tục.
                  </span>
                </div>
                <div className="w-full mb-6">
                  <LookupForm onSearch={handleSearch} />
                </div>
                <div className="w-full mb-8">
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
                      Ví dụ: 0912345678
                    </span>
                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
                      Ví dụ: scam@email.com
                    </span>
                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
                      Ví dụ: http://abc.com
                    </span>
                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
                      Ví dụ: 123456789 (STK ngân hàng)
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  {urlCheckResults.length > 0 ? (
                    <GoogleSafeResult
                      url={currentQuery}
                      apiResults={urlCheckResults}
                    />
                  ) : (
                    <LookupResult loading={loading} result={result} />
                  )}
                </div>
                {/* Lưu ý */}
                <div className="w-full mt-10">
                  <div className="bg-yellow-50 border-l-4 border-[#fbc02d] rounded-xl p-4 flex items-start gap-3">
                    <Search className="w-6 h-6 text-[#fbc02d] mt-1" />
                    <div className="text-sm text-gray-700">
                      <b>Lưu ý:</b> Nếu không tìm thấy thông tin, hãy luôn cảnh
                      giác khi giao dịch, không cung cấp mã OTP, mật khẩu, hoặc
                      chuyển tiền cho đối tượng chưa xác thực. Nếu phát hiện lừa
                      đảo, hãy{" "}
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
                {/* Đóng góp cộng đồng */}
                <div className="flex flex-col items-center w-full mt-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-6 h-6 text-[#43a047]" />
                    <span className="font-semibold text-[#43a047]">
                      Bạn có thể đóng góp dữ liệu lừa đảo cho cộng đồng!
                    </span>
                  </div>
                  <a
                    href="/tra-cuu"
                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white font-bold shadow hover:from-[#b71c1c] hover:to-[#fbc02d] transition"
                  >
                    Gửi báo cáo lừa đảo
                  </a>
                </div>
                {/* Câu hỏi thường gặp */}
                <div className="w-full mt-8">
                  <div className="p-5 bg-white border border-gray-100 shadow rounded-2xl">
                    <h3 className="text-base font-bold mb-3 text-[#e53935] flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#e53935]" />
                      Câu hỏi thường gặp
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {FAQS.map((faq, idx) => (
                        <li key={idx}>
                          <b className="block text-gray-800">{faq.q}</b>
                          <span className="text-gray-700">{faq.a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Liên hệ hỗ trợ */}
                <div className="w-full mt-6 text-sm text-center text-gray-500">
                  Cần hỗ trợ thêm? Liên hệ:{" "}
                  <a
                    href="mailto:support@scamreport.vn"
                    className="text-[#e53935] underline"
                  >
                    support@scamreport.vn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
