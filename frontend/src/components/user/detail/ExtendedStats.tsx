import {
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react";

interface ExtendedStatsProps {
  totalReports: number;
  approvedReports: number;
  pendingReports: number;
  latestReport?: string;
  firstReport?: string;
}

export default function ExtendedStats({
  totalReports,
  approvedReports,
  pendingReports,
  latestReport,
  firstReport,
}: ExtendedStatsProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa rõ";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateFrequency = () => {
    if (!firstReport || !latestReport || totalReports < 2)
      return "Chưa đủ dữ liệu";

    const first = new Date(firstReport);
    const latest = new Date(latestReport);
    const diffDays = Math.floor(
      (latest.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return `${totalReports} báo cáo / ngày`;
    if (diffDays <= 7)
      return `${(totalReports / (diffDays / 7)).toFixed(1)} báo cáo / tuần`;
    if (diffDays <= 30)
      return `${(totalReports / (diffDays / 30)).toFixed(1)} báo cáo / tháng`;
    return `${(totalReports / (diffDays / 30)).toFixed(1)} báo cáo / tháng`;
  };

  const stats = [
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Tổng báo cáo",
      value: totalReports,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Đã duyệt",
      value: approvedReports,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Chờ duyệt",
      value: pendingReports,
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Báo cáo gần nhất",
      value: formatDate(latestReport),
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      isText: true,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Xuất hiện đầu tiên",
      value: formatDate(firstReport),
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      isText: true,
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Tần suất báo cáo",
      value: calculateFrequency(),
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group relative flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${stat.bgColor}`}
        >
          <div
            className={`relative p-3 bg-gradient-to-br ${stat.color} rounded-lg shadow-md group-hover:scale-105 transition-transform`}
          >
            <div className="text-white drop-shadow">{stat.icon}</div>
          </div>
          <div className="relative flex-1">
            <div
              className={`${
                stat.isText ? "text-base" : "text-2xl"
              } font-bold text-gray-800`}
            >
              {stat.value}
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
