interface Report {
  content: string;
  verified: boolean;
  date: string;
}

interface DetailReportListProps {
  reports: Report[];
}

export default function DetailReportList({ reports }: DetailReportListProps) {
  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">Danh sách báo cáo</h2>
      <ul className="space-y-4">
        {reports.map((report, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg border ${
              report.verified
                ? "border-green-400 bg-green-50"
                : "border-yellow-400 bg-yellow-50"
            }`}
          >
            <p className="text-sm text-gray-800">{report.content}</p>
            <p className="mt-1 text-xs text-gray-500">{report.date}</p>
            <p className="mt-1 text-xs font-bold">
              {report.verified ? "✅ Đã xác minh" : "⚠️ Chưa xác minh"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
