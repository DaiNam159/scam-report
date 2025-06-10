"use client";

import BlacklistFilter from "@/components/user/blacklist/BlacklistFilter";
import BlacklistTable from "@/components/user/blacklist/BlacklistTable";
import { useEffect, useState } from "react";
import type { ReportType } from "@/types/ReportType";
import { BlacklistItem } from "@/types/BlacklistType";

export default function BlacklistPage() {
  const [type, setType] = useState<ReportType>("email_address");
  const [data, setData] = useState<BlacklistItem[]>([]);
  const [loading, setLoading] = useState(false);

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
    <div className="flex flex-col items-center justify-center min-h-screen px-2 py-10 bg-gray-100">
      <div className="flex flex-col items-center w-full max-w-3xl p-8 bg-white border border-gray-100 shadow-lg rounded-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-[#e53935] tracking-tight drop-shadow">
          Danh sách đen
        </h1>
        <p className="max-w-2xl mb-8 text-lg text-center text-gray-700">
          Tổng hợp các tài khoản ngân hàng, số điện thoại, email, website... đã
          bị cộng đồng báo cáo lừa đảo nhiều lần. Hãy kiểm tra trước khi giao
          dịch!
        </p>
        <div className="w-full mb-8">
          <BlacklistFilter selectedType={type} onChange={setType} />
        </div>
        <div className="w-full">
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
      </div>
    </div>
  );
}
