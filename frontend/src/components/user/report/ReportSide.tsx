import { JSX, useState } from "react";
import ReportForm from "./ReportForm";
import { ReportType } from "@/types/ReportType";
import {
  Mail,
  Smartphone,
  User,
  Globe,
  Users,
  CreditCard,
  MessageCircle,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
export default function ReportSide() {
  const REPORT_TYPES: ReportType[] = [
    "email_content",
    "email_address",
    "sms",
    "phone",
    "person_org",
    "website",
    "social_profile",
    "bank_account",
    "e_wallet",
  ];

  const TYPE_ICONS: Record<ReportType, JSX.Element> = {
    email_content: <Mail className="inline w-5 h-5 mr-2 text-[#e53935]" />,
    email_address: <Mail className="inline w-5 h-5 mr-2 text-[#e53935]" />,
    sms: <MessageCircle className="inline w-5 h-5 mr-2 text-[#fbc02d]" />,
    phone: <Smartphone className="inline w-5 h-5 mr-2 text-[#fbc02d]" />,
    person_org: <User className="inline w-5 h-5 mr-2 text-[#43a047]" />,
    website: <Globe className="inline w-5 h-5 mr-2 text-[#1e88e5]" />,
    social_profile: <Users className="inline w-5 h-5 mr-2 text-[#8e24aa]" />,
    bank_account: <CreditCard className="inline w-5 h-5 mr-2 text-[#6d4c41]" />,
    e_wallet: <CreditCard className="inline w-5 h-5 mr-2 text-[#6d4c41]" />,
  };
  const [typeReport, setTypeReport] = useState<ReportType>("email_content");
  const handleTypeChange = (type: ReportType) => {
    setTypeReport(type);
  };
  function getTypeLabel(type: string) {
    switch (type) {
      case "email_content":
        return "Nội dung email lừa đảo";
      case "email_address":
        return "Địa chỉ email lừa đảo";
      case "sms":
        return "Tin nhắn lừa đảo (SMS)";
      case "phone_number":
        return "Số điện thoại lừa đảo";
      case "person":
        return "Người lừa đảo";
      case "website":
        return "Website lừa đảo";
      case "social_profile":
        return "Hồ sơ mạng xã hội lừa đảo";
      case "bank_account":
        return "Tài khoản ngân hàng lừa đảo";
      case "e_wallet":
        return "Ví điện tử lừa đảo";
      default:
        return "Loại báo cáo không xác định";
    }
  }
  return (
    <>
      <div className="w-full md:w-2/3">
        <div className="relative flex flex-col items-center w-full p-8 overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-3xl">
          <div className="absolute pointer-events-none -top-8 -right-8 opacity-10">
            <ShieldAlert className="w-40 h-40 text-[#e53935]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[#e53935] tracking-tight drop-shadow flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#fbc02d]" />
            Báo cáo lừa đảo
          </h1>
          <p className="mb-6 text-base text-center text-gray-700 md:text-lg">
            Chung tay bảo vệ cộng đồng khỏi các hành vi lừa đảo công nghệ. Hãy
            gửi báo cáo của bạn ngay!
          </p>
          <div className="w-full max-w-xs mb-6">
            <label className="block mb-2 text-base font-semibold text-left text-gray-700">
              Loại báo cáo
            </label>
            <select
              value={typeReport}
              onChange={(e) => handleTypeChange(e.target.value as ReportType)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black text-lg shadow"
            >
              {REPORT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {getTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap justify-center w-full gap-2 mb-6">
            {REPORT_TYPES.map((type) => (
              <span
                key={type}
                className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 cursor-pointer transition ${
                  typeReport === type
                    ? "bg-[#e53935] text-white border-[#e53935]"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
                onClick={() => handleTypeChange(type)}
              >
                {TYPE_ICONS[type]}
                {type.replace(/_/g, " ").toUpperCase()}
              </span>
            ))}
          </div>
          <div className="w-full mb-8">
            <div className="p-4 bg-yellow-50 border-l-4 border-[#fbc02d] rounded mb-2 text-gray-800 text-sm">
              <b>Hướng dẫn:</b> Hãy điền đầy đủ và chính xác thông tin để tăng
              hiệu quả cảnh báo. Ưu tiên gửi kèm bằng chứng (ảnh, video, link,
              v.v).
            </div>
          </div>
          <div className="w-full">
            <ReportForm type={typeReport} />
          </div>
        </div>
      </div>
    </>
  );
}
