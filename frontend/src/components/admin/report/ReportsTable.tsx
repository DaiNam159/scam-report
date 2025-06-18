import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ReportType } from "@/types/ReportType";
import { ReportStatus } from "@/types/ReportType";
import { Report } from "@/models/ReportModel";

interface Props {
  reports: Report[];
  onView: (report: any) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
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

const statusLabels: Record<ReportStatus, string> = {
  [ReportStatus.PENDING]: "Chờ xử lý",
  [ReportStatus.APPROVED]: "Đã phê duyệt",
  [ReportStatus.REJECTED]: "Đã từ chối",
};

export default function ReportsTable({
  reports,
  onView,
  onDelete,
  onStatusChange,
}: Props) {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
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
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {report.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {reportTypeLabels[report.report_type as ReportType] ||
                    report.report_type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {report.title || "Không có tiêu đề"}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <select
                    value={report.status}
                    onChange={(e) => onStatusChange(report.id, e.target.value)}
                    className={`px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium ${
                      report.status === ReportStatus.PENDING
                        ? "text-yellow-600 bg-yellow-50"
                        : report.status === ReportStatus.APPROVED
                        ? "text-green-600 bg-green-50"
                        : "text-red-600 bg-red-50"
                    }`}
                  >
                    <option value={ReportStatus.PENDING} disabled>
                      {statusLabels[ReportStatus.PENDING]}
                    </option>
                    <option value={ReportStatus.APPROVED}>
                      {statusLabels[ReportStatus.APPROVED]}
                    </option>
                    <option value={ReportStatus.REJECTED}>
                      {statusLabels[ReportStatus.REJECTED]}
                    </option>
                  </select>
                </td>
                <td className="flex px-6 py-4 space-x-2 text-sm whitespace-nowrap">
                  <button
                    onClick={() => onView(report)}
                    className="flex items-center text-red-500 hover:text-red-700"
                    title="Xem chi tiết"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(report.id)}
                    className="flex items-center text-red-500 hover:text-red-700"
                    title="Xóa báo cáo"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
