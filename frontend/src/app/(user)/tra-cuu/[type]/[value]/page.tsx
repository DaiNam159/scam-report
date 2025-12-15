"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DetailHeader from "@/components/user/detail/DetailHeader";
import DetailReportList from "@/components/user/detail/DetailReportList";
import RiskLevel from "@/components/user/detail/RiskLevel";
import ExtendedStats from "@/components/user/detail/ExtendedStats";
import ExtendedInfo from "@/components/user/detail/ExtendedInfo";
import InteractionButtons from "@/components/user/detail/InteractionButtons";
import SafetyFAQ from "@/components/user/detail/SafetyFAQ";
import { BlacklistService } from "@/services/BlacklistService";
import { BlackListDetailType } from "@/types/BlackListDetailType";
import { ReportType } from "@/types/ReportType";

export default function DetailPage() {
  const params = useParams<{ type: string; value: string }>();

  const [details, setDetails] = useState<BlackListDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!params?.type || !params?.value) {
        setError("Thiếu thông tin tra cứu");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const type = decodeURIComponent(params.type);
        const value = decodeURIComponent(params.value);

        const data = await BlacklistService.getBlacklistDetails(
          type as ReportType,
          value
        );
        setDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [params]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#fff8e1] via-[#fbe9e7] to-[#e3f2fd]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-200 border-t-[#e53935] rounded-full animate-spin" />
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full border-r-orange-400 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1s" }}
          />
        </div>
        <p className="mt-6 text-xl font-bold bg-gradient-to-r from-[#e53935] to-[#f57c00] bg-clip-text text-transparent animate-pulse">
          Đang tải...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-4 text-center text-red-600 rounded-lg bg-red-50">
          {error}
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg">Không tìm thấy thông tin</div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-[#fff8e1] via-[#fbe9e7] to-[#e3f2fd] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating shapes */}
        <div className="absolute w-32 h-32 rounded-full top-20 left-10 bg-gradient-to-br from-red-300/10 to-orange-300/10 blur-2xl" />
        <div className="absolute w-40 h-40 rounded-full top-40 right-20 bg-gradient-to-br from-yellow-300/10 to-amber-300/10 blur-3xl" />
        <div className="absolute rounded-full bottom-32 left-20 w-36 h-36 bg-gradient-to-br from-blue-300/10 to-cyan-300/10 blur-2xl" />
        <div className="absolute rounded-full bottom-20 right-32 w-28 h-28 bg-gradient-to-br from-pink-300/10 to-purple-300/10 blur-2xl" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* Header Section */}
        <DetailHeader
          value={details.blacklistItem.value}
          type={details.blacklistItem.type}
          reportCount={details.blacklistItem.reportCount}
          latestReport={details.blacklistItem.latestReport}
        />

        {/* Risk Level Analysis */}
        <RiskLevel reportCount={details.reportStats.totalReports} />

        {/* Extended Statistics - 6 metrics */}
        <ExtendedStats
          totalReports={details.reportStats.totalReports}
          approvedReports={details.reportStats.approvedReports}
          pendingReports={details.reportStats.pendingReports}
          latestReport={details.blacklistItem.latestReport}
          firstReport={
            details.reportList.length > 0
              ? details.reportList[details.reportList.length - 1]?.created_at
              : undefined
          }
        />

        {/* Extended Information based on type */}
        <ExtendedInfo
          type={details.blacklistItem.type}
          value={details.blacklistItem.value}
        />

        {/* Interaction Buttons */}
        <InteractionButtons
          value={details.blacklistItem.value}
          type={details.blacklistItem.type}
        />

        {/* Reports List */}
        <DetailReportList reports={details.reportList} />

        {/* Safety FAQ */}
        <SafetyFAQ />
      </div>
    </div>
  );
}
