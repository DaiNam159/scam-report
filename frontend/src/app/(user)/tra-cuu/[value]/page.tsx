"use client";

import { useParams } from "next/navigation";
import DetailHeader from "@/components/user/detail/DetailHeader";
import DetailStats from "@/components/user/detail/DetailStats";
import DetailReportList from "@/components/user/detail/DetailReportList";

export default function DetailPage() {
  const { value } = useParams();

  // Fake data - sau này lấy từ API theo value
  const fakeData = {
    value: decodeURIComponent(value as string),
    type: "email_address",
    reportCount: 5,
    verifiedReports: 3,
    unverifiedReports: 2,
    reports: [
      {
        content: "Đã lừa tôi chuyển tiền đặt cọc mua hàng",
        verified: true,
        date: "05/06/2024",
      },
      {
        content: "Yêu cầu gửi mã OTP để đăng nhập",
        verified: false,
        date: "04/06/2024",
      },
      {
        content: "Giả danh người quen yêu cầu chuyển tiền",
        verified: true,
        date: "02/06/2024",
      },
      {
        content: "Gửi link độc hại giả mạo ngân hàng",
        verified: false,
        date: "01/06/2024",
      },
      {
        content: "Lừa mua hàng qua Shopee nhưng không gửi hàng",
        verified: true,
        date: "30/05/2024",
      },
    ],
  };

  return (
    <div className="flex justify-center min-h-screen px-4 py-10 bg-gray-100">
      <div className="w-full max-w-3xl p-8 bg-white shadow-md rounded-xl">
        <DetailHeader value={fakeData.value} type={fakeData.type} />
        <DetailStats
          reportCount={fakeData.reportCount}
          verifiedReports={fakeData.verifiedReports}
          unverifiedReports={fakeData.unverifiedReports}
        />
        <DetailReportList reports={fakeData.reports} />
      </div>
    </div>
  );
}
