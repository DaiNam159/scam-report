"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ReportType } from "@/types/ReportType";
import { ReportService } from "@/services/ReportService";

type Report = {
  id: number;
  reportType: ReportType;
  title: string;
  status: string;
};

const reportTypeLabels: Record<ReportType, string> = {
  email_address: "Địa chỉ email",
  person_org: "Người / Tổ chức",
  email_content: "Nội dung email",
  phone: "Số điện thoại",
  sms: "Tin nhắn SMS",
  website: "Trang web",
  social_profile: "Trang mạng xã hội",
  bank_account: "Tài khoản ngân hàng",
  e_wallet: "Ví điện tử",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await ReportService.getReport();
        // Ensure res.data is an array; fallback to empty array if not
        const data = Array.isArray(res.data) ? res.data : [];
        setReports(data);
      } catch (err) {
        console.error("Lỗi khi lấy báo cáo:", err);
        setError("Không thể tải báo cáo. Vui lòng thử lại sau.");
        setReports([]); // Ensure reports is an array even on error
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="mt-10 text-center">Đang tải...</div>;

  if (error)
    return <div className="mt-10 text-center text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Quản lý báo cáo</h2>
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Loại báo cáo
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Không có báo cáo nào
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {reportTypeLabels[report.reportType] || report.reportType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {report.title || "Không có tiêu đề"}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <select
                      value={report.status}
                      className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="approved">Đã phê duyệt</option>
                      <option value="rejected">Đã từ chối</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <button
                      onClick={() =>
                        alert(`Xem chi tiết báo cáo ID: ${report.id}`)
                      }
                      className="font-medium text-red-500 hover:text-red-700"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
