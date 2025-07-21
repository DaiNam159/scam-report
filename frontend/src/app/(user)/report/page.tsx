"use client";

import ReportSide from "@/components/user/report/ReportSide";
import MiddleSide from "@/components/user/report/MiddleSide";
import LeftSide from "@/components/user/report/LeftSide";
import { useEffect, useState } from "react";
import { ReportService } from "@/services/ReportService";
import { UserService } from "@/services/UserService";

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

  const [reportApproved, setReportApproved] = useState(1);
  const [reportPending, setReportPending] = useState(1);
  const [userCount, setUserCount] = useState(1);
  const fetchReportStats = async () => {
    try {
      const approveReport = await ReportService.countApprovedReport();

      const pendingReport = await ReportService.countPendingReport();
      const userCount = await UserService.countUsers();
      setReportApproved(approveReport);
      setReportPending(pendingReport);
      setUserCount(userCount);
    } catch (error) {
      console.error("Error fetching report stats:", error);
    }
  };
  useEffect(() => {
    fetchReportStats();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 py-10 bg-gradient-to-br from-[#fff8e1] via-[#fbe9e7] to-[#e3f2fd]">
      <div className="flex flex-col items-start w-full gap-8 max-w-7xl xl:gap-12 md:flex-row">
        <ReportSide />
        <MiddleSide
          reportApproved={reportApproved}
          reportPending={reportPending}
          userCount={userCount}
        />
        <LeftSide FAQS={FAQS} />
      </div>
    </div>
  );
}
