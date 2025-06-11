"use client";

import BlacklistFilter from "@/components/user/blacklist/BlacklistFilter";
import BlacklistTable from "@/components/user/blacklist/BlacklistTable";
import { useEffect, useState } from "react";
import type { ReportType } from "@/types/ReportType";
import { BlacklistItem } from "@/types/BlacklistType";
import { ShieldAlert, Users, Info, Sparkles } from "lucide-react";

export default function BlacklistPage() {
  const [type, setType] = useState<ReportType>("email_address");
  const [data, setData] = useState<BlacklistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Thống kê giả lập
  const STATS = [
    {
      label: "Tổng mục bị báo cáo",
      value: 1280,
      icon: <ShieldAlert className="w-6 h-6 text-[#e53935] animate-pulse" />,
    },
    {
      label: "Lượt báo cáo",
      value: 23456,
      icon: <Sparkles className="w-6 h-6 text-[#fbc02d]" />,
    },
    {
      label: "Người dùng đóng góp",
      value: 3200,
      icon: <Users className="w-6 h-6 text-[#43a047]" />,
    },
  ];

  // FAQ giả lập
  const FAQS = [
    {
      q: "Danh sách đen này lấy từ đâu?",
      a: "Dữ liệu tổng hợp từ cộng đồng, chuyên gia và các nguồn tin cậy.",
    },
    {
      q: "Nếu tôi phát hiện nhầm lẫn thì làm sao?",
      a: "Bạn có thể gửi báo cáo phản hồi hoặc liên hệ với chúng tôi để được hỗ trợ.",
    },
    {
      q: "Tôi có thể đóng góp thêm dữ liệu không?",
      a: "Bạn có thể gửi báo cáo lừa đảo mới bằng nút bên dưới.",
    },
  ];

  useEffect(() => {
    const fetchBlacklist = async () => {
      setLoading(true);
      try {
        // Đảm bảo type và fakeData đồng bộ với filter
        const fakeData: BlacklistItem[] = [
          {
            value: "scammer@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "scammzxcer@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "scammera@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "scammerx@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "scammerc@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "sczammer@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "scamsdzmer@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "scammser@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "scammfer@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "scamazmer@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "scammxer@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "scammerb@email.com",
            type: "email_address",
            reportCount: 12,
            latestReport: "01/06/2024",
          },
          {
            value: "0912345678",
            type: "phone_number",
            reportCount: 8,
            latestReport: "30/05/2024",
          },
          {
            value: "http://luadao.com",
            type: "website",
            reportCount: 15,
            latestReport: "29/05/2024",
          },
          {
            value: "facebook.com/fakeprofile",
            type: "social_profile",
            reportCount: 6,
            latestReport: "28/05/2024",
          },
          {
            value: "123456789",
            type: "bank_account",
            reportCount: 10,
            latestReport: "27/05/2024",
          },
          {
            value: "ZaloPay: 0987654321",
            type: "e_wallet",
            reportCount: 4,
            latestReport: "26/05/2024",
          },
          {
            value: "Nguyễn Văn Lừa",
            type: "person",
            reportCount: 7,
            latestReport: "25/05/2024",
          },
        ];
        // Nếu filter chỉ cho phép 4 loại đầu, hãy loại bỏ các loại không có trong filter
        const allowedTypes = [
          "email_address",
          "phone_number",
          "website",
          "social_profile",
          "bank_account",
          "e_wallet",
          "person",
        ];
        // Đảm bảo type luôn nằm trong allowedTypes, nếu không thì fallback về loại đầu tiên
        const safeType = allowedTypes.includes(type) ? type : allowedTypes[0];
        // Đảm bảo kiểu type nhất quán (ReportType là union type string)
        setData(
          fakeData.filter((row) => String(row.type) === String(safeType))
        );
      } catch (err) {
        console.error("Lỗi khi lấy danh sách đen:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlacklist();
  }, [type]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 py-10 bg-gradient-to-br from-[#fff8e1] via-[#fbe9e7] to-[#e3f2fd]">
      <div className="flex flex-col w-full max-w-5xl gap-8">
        {/* Banner + Thống kê */}
        <div className="relative flex flex-col items-center gap-6 p-8 overflow-hidden bg-white border border-gray-100 shadow-xl md:flex-row rounded-3xl">
          <div className="flex flex-col items-center flex-1 md:items-start">
            <ShieldAlert className="w-14 h-14 text-[#e53935] animate-pulse mb-2" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-center md:text-left mb-2 text-[#e53935] tracking-tight drop-shadow">
              Danh sách đen lừa đảo
            </h1>
            <p className="max-w-2xl mb-2 text-lg text-center text-gray-700 md:text-left">
              Tổng hợp các tài khoản ngân hàng, số điện thoại, email, website...
              đã bị cộng đồng báo cáo lừa đảo nhiều lần. Hãy kiểm tra trước khi
              giao dịch!
            </p>
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
              <Info className="w-4 h-4" />
              <span>
                Dữ liệu được kiểm duyệt và cập nhật liên tục từ cộng đồng.
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-4 md:flex-col">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-2xl shadow min-w-[120px]"
              >
                {stat.icon}
                <div>
                  <div className="font-bold text-lg text-[#e53935]">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bộ lọc */}
        <div className="flex flex-col items-center w-full gap-4 p-4 bg-white border border-gray-100 shadow rounded-2xl md:flex-row">
          <BlacklistFilter selectedType={type} onChange={setType} />
          <div className="flex flex-wrap justify-end flex-1 gap-2 text-xs text-gray-500">
            <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
              Ví dụ: scam@email.com
            </span>
            <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
              Ví dụ: 0912345678
            </span>
            <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
              Ví dụ: http://luadao.com
            </span>
          </div>
        </div>
        {/* Bảng dữ liệu */}
        <div className="w-full p-4 bg-white border border-gray-100 shadow-lg rounded-2xl">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <span className="animate-spin rounded-full border-4 border-[#e53935] border-t-transparent w-8 h-8 mr-3"></span>
              <span className="text-lg text-[#e53935] font-semibold">
                Đang tải dữ liệu...
              </span>
            </div>
          ) : (
            <BlacklistTable data={data} />
          )}
        </div>
        {/* FAQ + Đóng góp */}
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1 p-5 bg-white border border-gray-100 shadow rounded-2xl">
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
          <div className="flex-1 flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#e53935]/90 to-[#fbc02d]/90 rounded-2xl shadow text-white">
            <Sparkles className="w-8 h-8 mb-2 text-white" />
            <div className="mb-2 text-lg font-bold">Đóng góp cho cộng đồng</div>
            <div className="mb-4 text-sm text-center">
              Nếu bạn phát hiện thông tin lừa đảo mới, hãy gửi báo cáo để bảo vệ
              cộng đồng!
            </div>
            <a
              href="/report"
              className="inline-block px-6 py-3 rounded-xl bg-white text-[#e53935] font-bold shadow hover:bg-gray-100 transition"
            >
              Gửi báo cáo lừa đảo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
