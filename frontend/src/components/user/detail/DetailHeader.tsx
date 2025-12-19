import {
  ShieldAlert,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Calendar,
  Hash,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DetailHeaderProps {
  value: string;
  type: string;
  reportCount?: number;
  latestReport?: string;
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    email_address: "Email",
    phone: "Số điện thoại",
    website: "Website",
    social: "Mạng xã hội",
    bank_account: "Tài khoản ngân hàng",
    e_wallet: "Ví điện tử",
    person_org: "Cá nhân/Tổ chức",
  };
  return labels[type] || type.replace(/_/g, " ");
};

export default function DetailHeader({
  value,
  type,
  reportCount,
  latestReport,
}: DetailHeaderProps) {
  const router = useRouter();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa rõ";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cảnh báo lừa đảo - ${value}`,
          text: `Đối tượng lừa đảo: ${value}`,
          url: url,
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Đã sao chép link!");
    }
  };

  return (
    <div className="relative p-5 mb-5 overflow-hidden border shadow-lg bg-white/80 backdrop-blur-xl border-white/50 rounded-xl group">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-linear-to-br from-[#e53935] via-[#f57c00] to-[#fbc02d]" />
      </div>

      {/* Decorative circles */}
      <div className="absolute w-24 h-24 rounded-full -top-6 -right-6 bg-linear-to-br from-red-400/20 to-orange-400/20 blur-2xl" />
      <div className="absolute w-24 h-24 rounded-full -bottom-6 -left-6 bg-linear-to-br from-yellow-400/20 to-red-400/20 blur-2xl" />

      <div className="relative">
        {/* Back and Share buttons */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white transition-all rounded-lg shadow-sm bg-linear-to-r from-blue-500 to-cyan-500 hover:shadow-md hover:scale-105"
          >
            <Share2 className="w-3.5 h-3.5" />
            Chia sẻ
          </button>
        </div>

        <div className="flex flex-col items-start gap-3 md:flex-row">
          <div className="relative p-2.5 transition-transform duration-300 shadow-md bg-linear-to-br from-red-500 to-orange-500 rounded-lg group-hover:scale-105">
            <ShieldAlert className="text-white w-7 h-7 drop-shadow-lg animate-pulse" />
            <div className="absolute inset-0 rounded-lg bg-white/20 backdrop-blur-sm" />
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-[#e53935] via-[#f57c00] to-[#fbc02d] bg-clip-text text-transparent tracking-tight">
                Chi tiết đối tượng lừa đảo
              </h1>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-2 bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full shadow-sm">
              <AlertTriangle className="w-3.5 h-3.5 text-[#fbc02d]" />
              <span className="text-xs font-semibold text-gray-800">
                {getTypeLabel(type)}
              </span>
            </div>

            {/* Value Box */}
            <div className="p-3 mb-2 transition-all border rounded-lg shadow-sm bg-linear-to-br from-red-50 via-orange-50 to-yellow-50 border-red-200/50 hover:shadow-md">
              <p className="flex items-center gap-1 mb-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                Giá trị bị báo cáo:
              </p>
              <p className="text-base md:text-lg font-bold bg-linear-to-r from-[#e53935] to-[#f57c00] bg-clip-text text-transparent break-all">
                {value}
              </p>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-1.5">
              {reportCount !== undefined && (
                <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <Hash className="w-3 h-3 text-red-500" />
                  <span>{reportCount} báo cáo</span>
                </div>
              )}
              {latestReport && (
                <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <Calendar className="w-3 h-3 text-orange-500" />
                  <span>{formatDate(latestReport)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
