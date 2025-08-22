import { useState } from "react";
import { ReportType } from "@/types/ReportType";
import { ReportStatus } from "@/types/ReportType";
import { Report } from "@/models/ReportModel";
import {
  FaCheck,
  FaEye,
  FaFileAlt,
  FaTimes,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

interface Props {
  reports: Report[];
  onView: (report: Report) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  onSortChange?: (column: string, direction: "ASC" | "DESC") => void;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

const reportTypeLabels: Record<ReportType, string> = {
  email_address: "Địa chỉ email",
  person_org: "Người / Tổ chức",
  email_content: "Nội dung email",
  phone: "Số điện thoại",
  sms: "Tin nhắn SMS",
  website: "Trang web",
  social: "Trang mạng xã hội",
  bank_account: "Tài khoản ngân hàng",
  e_wallet: "Ví điện tử",
};

const getTypeLabel = (type: ReportType) => {
  return reportTypeLabels[type] || "Không xác định";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "title", label: "Tiêu đề", sortable: true },
  { key: "report_type", label: "Loại", sortable: true },
  { key: "user", label: "Người gửi", sortable: false },
  { key: "status", label: "Trạng thái", sortable: true },
  { key: "created_at", label: "Ngày tạo", sortable: true },
  { key: "actions", label: "Thao tác", sortable: false },
];

export default function ReportsTable({
  reports,
  onView,
  onDelete,
  onStatusChange,
  onSortChange,
  sortBy,
  sortOrder,
}: Props) {
  const [localSortBy, setLocalSortBy] = useState<string | undefined>(sortBy);
  const [localSortOrder, setLocalSortOrder] = useState<
    "ASC" | "DESC" | undefined
  >(sortOrder);

  const handleSort = (key: string) => {
    if (!onSortChange) return;
    let direction: "ASC" | "DESC" = "ASC";
    if (localSortBy === key) {
      direction = localSortOrder === "ASC" ? "DESC" : "ASC";
    }
    setLocalSortBy(key);
    setLocalSortOrder(direction);
    onSortChange(key, direction);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-separate border-spacing-0">
        <thead>
          <tr className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
            {columns.map((col) =>
              col.key === "actions" ? (
                <th
                  key={col.key}
                  className="px-6 py-3 font-semibold text-gray-900 uppercase text-xs border-b border-blue-200 w-[140px] min-w-[140px] max-w-[140px] text-center"
                >
                  {col.label}
                </th>
              ) : (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-xs font-semibold text-gray-900 uppercase border-b border-blue-200 select-none ${
                    col.sortable ? "cursor-pointer group" : ""
                  }`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <>
                        {localSortBy === col.key ? (
                          localSortOrder === "ASC" ? (
                            <FaSortUp className="inline w-3 h-3 text-blue-600" />
                          ) : (
                            <FaSortDown className="inline w-3 h-3 text-blue-600" />
                          )
                        ) : (
                          <FaSort className="inline w-3 h-3 text-gray-400 group-hover:text-blue-400" />
                        )}
                      </>
                    )}
                  </span>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white">
          {reports.map((report, idx) => (
            <tr
              key={report.id}
              className={`transition-colors h-[72px] ${
                idx % 2 === 0 ? "bg-white" : "bg-blue-50"
              } hover:bg-blue-100`}
            >
              <td className="sticky left-0 z-0 px-6 py-4 font-medium text-gray-900 bg-white border-b whitespace-nowrap border-blue-50 h-[72px]">
                #{report.id}
              </td>
              <td className="px-6 py-4 text-gray-900 border-b border-blue-50 h-[72px]">
                <div className="max-w-xs font-medium truncate">
                  {report.title}
                </div>
              </td>
              <td className="px-6 py-4 border-b border-blue-50 whitespace-nowrap h-[72px]">
                <span className="inline-flex px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                  {getTypeLabel(report.report_type)}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-900 border-b border-blue-50 h-[72px]">
                <div className="flex items-center h-full">
                  <div>
                    <div className="font-medium text-gray-900">
                      {report.user?.fullName || "Ẩn danh"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {report.user?.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 border-b border-blue-50 whitespace-nowrap h-[72px]">
                <div className="flex items-center h-full">
                  {renderStatusBadge(report.status)}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-900 border-b border-blue-50 whitespace-nowrap h-[72px]">
                <div className="flex items-center h-full">
                  {formatDate(report.created_at)}
                </div>
              </td>
              <td className="px-6 py-4 border-b border-blue-50 whitespace-nowrap w-[140px] min-w-[140px] max-w-[140px] text-center h-[72px]">
                <div className="flex items-center justify-center h-full">
                  <div className="grid grid-cols-2 gap-1 w-[120px]">
                    <button
                      onClick={() => onView(report)}
                      title="Xem chi tiết"
                      className="flex items-center justify-center w-8 h-8 text-blue-700 transition border border-blue-100 rounded-full bg-blue-50 hover:bg-blue-100"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        onStatusChange(report.id, ReportStatus.APPROVED)
                      }
                      title={
                        report.status === ReportStatus.PENDING
                          ? "Duyệt"
                          : report.status === ReportStatus.APPROVED
                          ? "Đã duyệt"
                          : "Duyệt"
                      }
                      disabled={report.status !== ReportStatus.PENDING}
                      className={`flex items-center justify-center transition border rounded-full w-8 h-8 ${
                        report.status === ReportStatus.PENDING
                          ? "text-green-700 border-green-100 bg-green-50 hover:bg-green-100 cursor-pointer"
                          : report.status === ReportStatus.APPROVED
                          ? "text-green-500 border-green-200 bg-green-50 cursor-not-allowed opacity-60"
                          : "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <FaCheck className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        onStatusChange(report.id, ReportStatus.REJECTED)
                      }
                      title={
                        report.status === ReportStatus.PENDING
                          ? "Từ chối"
                          : report.status === ReportStatus.REJECTED
                          ? "Đã từ chối"
                          : "Từ chối"
                      }
                      disabled={report.status !== ReportStatus.PENDING}
                      className={`flex items-center justify-center transition border rounded-full w-8 h-8 ${
                        report.status === ReportStatus.PENDING
                          ? "text-red-700 border-red-100 bg-red-50 hover:bg-red-100 cursor-pointer"
                          : report.status === ReportStatus.REJECTED
                          ? "text-red-500 border-red-200 bg-red-50 cursor-not-allowed opacity-60"
                          : "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDelete(report.id)}
                      title="Xóa"
                      className="flex items-center justify-center w-8 h-8 text-red-700 transition border border-red-100 rounded-full bg-red-50 hover:bg-red-100"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={7} className="py-12 text-center bg-white h-[200px]">
                <div className="flex flex-col items-center justify-center h-full">
                  <FaFileAlt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Không có báo cáo
                  </h3>
                  <p className="text-gray-500">Chưa có báo cáo nào được tạo.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
const renderStatusBadge = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.PENDING:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></div>
          Chờ duyệt
        </span>
      );
    case ReportStatus.APPROVED:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
          Đã duyệt
        </span>
      );
    case ReportStatus.REJECTED:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <div className="w-2 h-2 bg-red-400 rounded-full mr-1.5"></div>
          Từ chối
        </span>
      );
    default:
      return null;
  }
};
