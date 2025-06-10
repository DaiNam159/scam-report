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
    <div className="grid grid-cols-3 gap-4 p-4 mb-6 text-center bg-gray-100 rounded-lg shadow">
      <div>
        <div className="text-lg font-bold text-[#e53935]">{reportCount}</div>
        <div className="text-sm text-gray-600">Tổng báo cáo</div>
      </div>
      <div>
        <div className="text-lg font-bold text-green-600">
          {verifiedReports}
        </div>
        <div className="text-sm text-gray-600">Đã xác minh</div>
      </div>
      <div>
        <div className="text-lg font-bold text-yellow-600">
          {unverifiedReports}
        </div>
        <div className="text-sm text-gray-600">Chưa xác minh</div>
      </div>
    </div>
  );
}
