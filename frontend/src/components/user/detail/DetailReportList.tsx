import { ReportResponse } from "@/types/ReportType";
import {
  Calendar,
  Phone,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";

export default function DetailReportList({
  reports,
}: {
  reports: ReportResponse[];
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          text: "Đã duyệt",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          badgeBg: "bg-green-100",
        };
      case "pending":
        return {
          icon: <Clock className="w-5 h-5" />,
          text: "Đang chờ xử lý",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-700",
          badgeBg: "bg-yellow-100",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-5 h-5" />,
          text: "Đã từ chối",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          badgeBg: "bg-red-100",
        };
      default:
        return {
          icon: <FileText className="w-5 h-5" />,
          text: status,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
          badgeBg: "bg-gray-100",
        };
    }
  };

  return (
    <div className="relative p-6 bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-100/20 to-orange-100/20 rounded-full blur-2xl -z-10" />

      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg shadow-md">
          <FileText className="w-5 h-5 text-white drop-shadow" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#e53935] to-[#f57c00] bg-clip-text text-transparent">
          Danh sách báo cáo
        </h2>
      </div>

      {reports.length === 0 ? (
        <div className="py-12 text-center">
          <div className="inline-flex p-5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-3">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            Chưa có báo cáo nào
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => {
            const statusConfig = getStatusConfig(report.status);
            return (
              <li
                key={report.id}
                className={`group relative p-5 rounded-xl border ${statusConfig.borderColor} ${statusConfig.bgColor} shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1 leading-snug">
                      {report.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.badgeBg} ${statusConfig.textColor} whitespace-nowrap shadow-sm`}
                    >
                      {statusConfig.icon}
                      {statusConfig.text}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                    {report.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg shadow-sm">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">
                        {formatDate(report.created_at)}
                      </span>
                    </div>

                    {report.contact && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg shadow-sm">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-700">
                          {report.contact}
                        </span>
                      </div>
                    )}

                    {report.evidence && (
                      <a
                        href={report.evidence}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 border-0 rounded-lg text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Xem bằng chứng</span>
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
