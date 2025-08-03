import React from "react";
import {
  Shield,
  ShieldAlert,
  CheckCircle2,
  Globe,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface GoogleSafeResultProps {
  result: {
    url: string;
    isSafe: boolean;
    matches?: any[];
    error?: string;
  };
}

const GoogleSafeResult: React.FC<GoogleSafeResultProps> = ({ result }) => {
  if (result.error) {
    return (
      <div className="flex flex-col items-center p-8 text-center bg-white border border-red-200 shadow rounded-2xl">
        <AlertTriangle className="w-12 h-12 mb-2 text-orange-500" />
        <div className="mb-2 text-xl font-bold text-orange-600">
          Không thể kiểm tra
        </div>
        <div className="mb-4 text-gray-700">{result.error}</div>
        <div className="text-sm text-gray-500">
          Vui lòng thử lại hoặc kiểm tra thủ công tính an toàn của website.
        </div>
      </div>
    );
  }

  if (result.isSafe) {
    return (
      <div className="flex flex-col items-center p-8 text-center bg-white border border-green-200 shadow rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-8 h-8 text-green-600" />
          <Globe className="w-6 h-6 text-blue-500" />
        </div>
        <div className="mb-2 text-xl font-bold text-green-600">
          Website An Toàn
        </div>
        <div className="mb-2 text-gray-700">
          <strong>{result.url}</strong>
        </div>
        <div className="mb-4 text-sm text-gray-600">
          Google Safe Browsing không phát hiện mối đe dọa nào từ website này.
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-green-600 rounded-full bg-green-50">
          <CheckCircle2 className="w-4 h-4" />
          <span>Được Google xác nhận an toàn</span>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <strong>Lưu ý:</strong> Kết quả này chỉ kiểm tra mối đe dọa kỹ thuật.
          Hãy cẩn thận với các website lừa đảo tài chính.
        </div>
      </div>
    );
  }

  // Website không an toàn
  return (
    <div className="flex flex-col items-center p-8 text-center bg-white border border-red-500 shadow-lg rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-12 h-12 text-red-600 animate-pulse" />
        <Globe className="w-8 h-8 text-gray-500" />
      </div>
      <div className="mb-2 text-2xl font-extrabold text-red-600">
        Cảnh báo: Website Nguy Hiểm!
      </div>
      <div className="mb-2 font-semibold text-gray-800">
        <strong>{result.url}</strong>
      </div>
      <div className="mb-4 text-sm text-gray-600">
        Google Safe Browsing đã phát hiện mối đe dọa từ website này.
      </div>

      {result.matches && result.matches.length > 0 && (
        <div className="w-full mb-4">
          <div className="mb-2 text-sm font-semibold text-gray-700">
            Các mối đe dọa được phát hiện:
          </div>
          <div className="space-y-2">
            {result.matches.map((match, index) => (
              <div
                key={index}
                className="p-3 border border-red-200 rounded-lg bg-red-50"
              >
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-red-700">
                    {match.threatType || "Mối đe dọa không xác định"}
                  </span>
                </div>
                {match.platformType && (
                  <div className="mt-1 text-xs text-gray-600">
                    Nền tảng: {match.platformType}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full p-4 mb-4 border border-red-200 rounded-lg bg-red-50">
        <div className="text-sm text-red-800">
          <strong>⚠️ Khuyến cáo:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Không truy cập vào website này</li>
            <li>Không nhập thông tin cá nhân</li>
            <li>Không tải xuống bất kỳ file nào</li>
            <li>Cảnh báo người khác về website này</li>
          </ul>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Kết quả từ <strong>Google Safe Browsing API</strong> - Dịch vụ bảo vệ
        chính thức của Google
      </div>
    </div>
  );
};

export default GoogleSafeResult;
