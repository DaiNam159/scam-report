"use client";

import ReportSide from "@/components/user/report/ReportSide";
import MiddleSide from "@/components/user/report/MiddleSide";
import LeftSide from "@/components/user/report/LeftSide";

export default function ReportPage() {
  const FAQS = [
    {
      a: "Để báo cáo lừa đảo, bạn cần cung cấp thông tin chi tiết về hành vi lừa đảo, kèm theo bằng chứng nếu có.",
      q: "Cần cung cấp những thông tin gì khi báo cáo?",
    },
    {
      a: "Bạn có thể báo cáo qua trang web này hoặc gửi email đến địa chỉ hỗ trợ.",
      q: "Tôi có thể báo cáo lừa đảo ở đâu?",
    },
    {
      a: "Chúng tôi sẽ xem xét và xử lý báo cáo của bạn trong thời gian sớm nhất. Bạn sẽ nhận được thông báo khi có kết quả.",
      q: "Bao lâu thì tôi nhận được phản hồi sau khi báo cáo?",
    },
    {
      a: "Bạn có thể liên hệ với chúng tôi qua email hoặc số điện thoại trên trang Liên hệ.",
      q: "Tôi cần hỗ trợ thêm, làm thế nào để liên hệ?",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 py-10 bg-gradient-to-br from-[#fff8e1] via-[#fbe9e7] to-[#e3f2fd]">
      <div className="flex flex-col items-start w-full gap-8 max-w-7xl xl:gap-12 md:flex-row">
        <ReportSide />
        <MiddleSide />
        <LeftSide FAQS={FAQS} />
      </div>
    </div>
  );
}
