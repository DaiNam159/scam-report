import { Report } from "@/models/ReportModel";
import { JSX, useState } from "react";

interface Props {
  report: Report;
  getStatusBadgeColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export default function MyReportCard({
  report,
  getStatusBadgeColor,
  getStatusText,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const getReportTypeText = (type: string) => {
    const types: Record<string, string> = {
      email_address: "Địa chỉ Email",
      person_org: "Người/Tổ chức",
      email_content: "Nội dung Email",
      phone: "Số điện thoại",
      sms: "Tin nhắn SMS",
      website: "Website",
      social: "Mạng xã hội",
      bank_account: "Tài khoản ngân hàng",
      e_wallet: "Ví điện tử",
    };
    return types[type] || type;
  };

  const getReportTypeIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      email_address: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      phone: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      website: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      bank_account: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      social: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      ),
    };
    return (
      icons[type] || (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-700 rounded-lg bg-blue-50">
                  {getReportTypeIcon(report.report_type)}
                  <span>{getReportTypeText(report.report_type)}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusBadgeColor(
                    report.status
                  )}`}
                >
                  {getStatusText(report.status)}
                </span>
              </div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 truncate">
                {report.title}
              </h3>
              <p className="text-sm text-gray-500">
                <span className="font-medium">ID:</span> #{report.id} •{" "}
                <span className="font-medium">Gửi lúc:</span>{" "}
                {formatDate(report.created_at)}
              </p>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex-shrink-0 p-2 transition-colors rounded-lg hover:bg-gray-100"
              title={expanded ? "Thu gọn" : "Xem chi tiết"}
            >
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                  expanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? "max-h-[2000px]" : "max-h-0"
          }`}
        >
          <div className="p-5 space-y-4 bg-gray-50">
            {/* Description */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-700">
                Mô tả:
              </h4>
              <p className="text-sm leading-relaxed text-gray-600">
                {report.description || "Không có mô tả"}
              </p>
            </div>

            {/* Evidence */}
            {report.evidence && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Bằng chứng:
                </h4>
                <button
                  onClick={() => setShowImageModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Xem bằng chứng
                </button>
              </div>
            )}

            {/* Contact */}
            {report.contact && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Thông tin liên hệ:
                </h4>
                <p className="text-sm text-gray-600">{report.contact}</p>
              </div>
            )}

            {/* Updated at */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Cập nhật lần cuối:</span>{" "}
                {formatDate(report.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && report.evidence && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-200 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden duration-200 bg-white shadow-2xl rounded-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Bằng chứng báo cáo
              </h3>

              <button
                onClick={() => setShowImageModal(false)}
                className="absolute p-2 text-white transition-all duration-200 rounded-lg top-3 right-3 hover:bg-white/20 hover:rotate-90"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="bg-white rounded-xl shadow-inner overflow-hidden max-h-[70vh]">
                <div className="overflow-auto max-h-[70vh] flex items-center justify-center p-4">
                  <img
                    src={report.evidence}
                    alt="Bằng chứng"
                    className="h-auto max-w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Mẹo:</span> Click bên ngoài để
                  đóng
                </div>
                <a
                  href={report.evidence}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Mở tab mới
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
