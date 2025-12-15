import { AlertTriangle, Shield, AlertCircle } from "lucide-react";

interface RiskLevelProps {
  reportCount: number;
}

export default function RiskLevel({ reportCount }: RiskLevelProps) {
  const getRiskLevel = (count: number) => {
    if (count >= 5) {
      return {
        level: "Nguy cơ cao",
        color: "red",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        icon: <AlertTriangle className="w-5 h-5" />,
        description:
          "Đối tượng này đã được nhiều người dùng báo cáo trong thời gian gần đây. Người dùng cần cẩn trọng khi tương tác.",
      };
    } else if (count >= 2) {
      return {
        level: "Nguy cơ trung bình",
        color: "orange",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-700",
        icon: <AlertCircle className="w-5 h-5" />,
        description:
          "Đối tượng này đã có một số báo cáo. Nên kiểm tra kỹ trước khi tương tác.",
      };
    } else {
      return {
        level: "Nguy cơ thấp",
        color: "yellow",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-700",
        icon: <Shield className="w-5 h-5" />,
        description:
          "Đối tượng này có ít báo cáo. Vẫn nên thận trọng khi giao dịch.",
      };
    }
  };

  const risk = getRiskLevel(reportCount);

  return (
    <div
      className={`p-4 mb-5 border ${risk.borderColor} ${risk.bgColor} rounded-xl shadow-sm`}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div className={`p-1.5 bg-white rounded-lg ${risk.textColor}`}>
          {risk.icon}
        </div>
        <div>
          <h3 className={`text-base font-bold ${risk.textColor}`}>
            {risk.level}
          </h3>
          <p className="text-xs text-gray-600">
            Dựa trên {reportCount} báo cáo
          </p>
        </div>
      </div>
      <p className={`text-sm ${risk.textColor} leading-snug`}>
        {risk.description}
      </p>
    </div>
  );
}
