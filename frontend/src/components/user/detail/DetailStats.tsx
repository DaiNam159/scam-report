import { FileText, CheckCircle, Clock } from "lucide-react";

interface DetailStatsProps {
  reportCount: number;
  verifiedReports: number;
  unverifiedReports: number;
}

export default function DetailStats({
  reportCount,
  verifiedReports,
  unverifiedReports,
}: DetailStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="group relative flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg shadow-md group-hover:scale-105 transition-transform">
          <FileText className="w-5 h-5 text-white drop-shadow" />
        </div>
        <div className="relative">
          <div className="text-2xl font-bold bg-gradient-to-br from-[#e53935] to-[#f57c00] bg-clip-text text-transparent">
            {reportCount}
          </div>
          <div className="text-xs text-gray-600 font-medium">Tổng báo cáo</div>
        </div>
      </div>

      <div className="group relative flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-md group-hover:scale-105 transition-transform">
          <CheckCircle className="w-5 h-5 text-white drop-shadow" />
        </div>
        <div className="relative">
          <div className="text-2xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {verifiedReports}
          </div>
          <div className="text-xs text-gray-600 font-medium">Đã duyệt</div>
        </div>
      </div>

      <div className="group relative flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg shadow-md group-hover:scale-105 transition-transform">
          <Clock className="w-5 h-5 text-white drop-shadow" />
        </div>
        <div className="relative">
          <div className="text-2xl font-bold bg-gradient-to-br from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            {unverifiedReports}
          </div>
          <div className="text-xs text-gray-600 font-medium">Đang chờ</div>
        </div>
      </div>
    </div>
  );
}
