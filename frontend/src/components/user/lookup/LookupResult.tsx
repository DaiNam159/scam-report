import { ShieldAlert, CheckCircle2, Loader2, Info } from "lucide-react";

interface LookupResultProps {
  loading: boolean;
  result: any;
}

const LookupResult = ({ loading, result }: LookupResultProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin w-8 h-8 text-[#e53935] mr-2" />
        <span className="text-lg text-[#e53935] font-semibold">
          Đang tra cứu...
        </span>
      </div>
    );
  }

  if (!result) return null;

  if (result.found === false) {
    return (
      <div className="flex flex-col items-center p-8 text-center bg-white border border-gray-200 shadow rounded-2xl">
        <CheckCircle2 className="w-12 h-12 text-[#388e3c] mb-2" />
        <div className="text-xl font-bold text-[#388e3c] mb-2">
          Không phát hiện dấu hiệu lừa đảo!
        </div>
        <div className="mb-2 text-gray-700">
          Đối tượng bạn tra cứu chưa có trong hệ thống cảnh báo.
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Info className="w-4 h-4" />
          <span>
            Hãy luôn cảnh giác khi giao dịch, không cung cấp mã OTP, mật khẩu,
            hoặc chuyển tiền cho đối tượng chưa xác thực.
          </span>
        </div>
      </div>
    );
  }

  // Nếu có kết quả lừa đảo
  return (
    <div className="bg-white border border-[#e53935] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
      <ShieldAlert className="w-14 h-14 text-[#e53935] mb-2 animate-pulse" />
      <div className="text-2xl font-extrabold text-[#e53935] mb-2">
        Cảnh báo: Đã phát hiện lừa đảo!
      </div>
      {result.type && (
        <span className="inline-block bg-[#fbc02d] text-[#b71c1c] font-semibold px-4 py-1 rounded-full mb-2 text-sm">
          {result.type}
        </span>
      )}
      <div className="mb-2 font-semibold text-gray-800">
        {result.detail || "Đối tượng này đã bị báo cáo lừa đảo trên hệ thống."}
      </div>
      {result.count && (
        <div className="mb-2 text-base text-gray-600">
          Số lần bị báo cáo:{" "}
          <span className="font-bold text-[#e53935]">{result.count}</span>
        </div>
      )}
      {result.lastReport && (
        <div className="mb-2 text-sm text-gray-500">
          Báo cáo gần nhất: {result.lastReport}
        </div>
      )}
      <div className="mt-4">
        <a
          href="/report"
          className="inline-block bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white font-semibold px-6 py-2 rounded-xl shadow hover:from-[#b71c1c] hover:to-[#fbc02d] transition"
        >
          Báo cáo thêm hoặc xem chi tiết
        </a>
      </div>
    </div>
  );
};

export default LookupResult;
