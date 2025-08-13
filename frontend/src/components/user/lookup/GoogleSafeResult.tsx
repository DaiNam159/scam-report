import React from "react";
import {
  Shield,
  ShieldAlert,
  CheckCircle2,
  Globe,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";

// interface GoogleSafeResultProps {
//   result: {
//     url: string;
//     isSafe: boolean;
//     matches?: any[];
//     error?: string;
//   };
// }

// const GoogleSafeResult: React.FC<GoogleSafeResultProps> = ({ result }) => {
//   if (result.error) {
//     return (
//       <div className="flex flex-col items-center p-8 text-center bg-white border border-red-200 shadow rounded-2xl">
//         <AlertTriangle className="w-12 h-12 mb-2 text-orange-500" />
//         <div className="mb-2 text-xl font-bold text-orange-600">
//           Không thể kiểm tra
//         </div>
//         <div className="mb-4 text-gray-700">{result.error}</div>
//         <div className="text-sm text-gray-500">
//           Vui lòng thử lại hoặc kiểm tra thủ công tính an toàn của website.
//         </div>
//       </div>
//     );
//   }

//   if (result.isSafe) {
//     return (
//       <div className="flex flex-col items-center p-8 text-center bg-white border border-green-200 shadow rounded-2xl">
//         <div className="flex items-center gap-2 mb-4">
//           <Shield className="w-8 h-8 text-green-600" />
//           <Globe className="w-6 h-6 text-blue-500" />
//         </div>
//         <div className="mb-2 text-xl font-bold text-green-600">
//           Website An Toàn
//         </div>
//         <div className="mb-2 text-gray-700">
//           <strong>{result.url}</strong>
//         </div>
//         <div className="mb-4 text-sm text-gray-600">
//           Google Safe Browsing không phát hiện mối đe dọa nào từ website này.
//         </div>
//         <div className="flex items-center gap-2 px-4 py-2 text-xs text-green-600 rounded-full bg-green-50">
//           <CheckCircle2 className="w-4 h-4" />
//           <span>Được Google xác nhận an toàn</span>
//         </div>
//         <div className="mt-4 text-xs text-gray-500">
//           <strong>Lưu ý:</strong> Kết quả này chỉ kiểm tra mối đe dọa kỹ thuật.
//           Hãy cẩn thận với các website lừa đảo tài chính.
//         </div>
//       </div>
//     );
//   }

//   // Website không an toàn
//   return (
//     <div className="flex flex-col items-center p-8 text-center bg-white border border-red-500 shadow-lg rounded-2xl">
//       <div className="flex items-center gap-2 mb-4">
//         <ShieldAlert className="w-12 h-12 text-red-600 animate-pulse" />
//         <Globe className="w-8 h-8 text-gray-500" />
//       </div>
//       <div className="mb-2 text-2xl font-extrabold text-red-600">
//         Cảnh báo: Website Nguy Hiểm!
//       </div>
//       <div className="mb-2 font-semibold text-gray-800">
//         <strong>{result.url}</strong>
//       </div>
//       <div className="mb-4 text-sm text-gray-600">
//         Google Safe Browsing đã phát hiện mối đe dọa từ website này.
//       </div>

//       {result.matches && result.matches.length > 0 && (
//         <div className="w-full mb-4">
//           <div className="mb-2 text-sm font-semibold text-gray-700">
//             Các mối đe dọa được phát hiện:
//           </div>
//           <div className="space-y-2">
//             {result.matches.map((match, index) => (
//               <div
//                 key={index}
//                 className="p-3 border border-red-200 rounded-lg bg-red-50"
//               >
//                 <div className="flex items-center gap-2 text-sm">
//                   <AlertTriangle className="w-4 h-4 text-red-500" />
//                   <span className="font-semibold text-red-700">
//                     {match.threatType || "Mối đe dọa không xác định"}
//                   </span>
//                 </div>
//                 {match.platformType && (
//                   <div className="mt-1 text-xs text-gray-600">
//                     Nền tảng: {match.platformType}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="w-full p-4 mb-4 border border-red-200 rounded-lg bg-red-50">
//         <div className="text-sm text-red-800">
//           <strong>⚠️ Khuyến cáo:</strong>
//           <ul className="mt-2 space-y-1 list-disc list-inside">
//             <li>Không truy cập vào website này</li>
//             <li>Không nhập thông tin cá nhân</li>
//             <li>Không tải xuống bất kỳ file nào</li>
//             <li>Cảnh báo người khác về website này</li>
//           </ul>
//         </div>
//       </div>

//       <div className="text-xs text-gray-500">
//         Kết quả từ <strong>Google Safe Browsing API</strong> - Dịch vụ bảo vệ
//         chính thức của Google
//       </div>
//     </div>
//   );
// };

interface ApiResult {
  name: string;
  loading: boolean;
  result?: {
    isSafe: boolean;
    matches?: any[];
    error?: string;
    details?: any;
  };
}

interface GoogleSafeResultProps {
  url: string;
  apiResults: ApiResult[];
}
const GoogleSafeResult: React.FC<GoogleSafeResultProps> = ({
  url,
  apiResults,
}) => {
  const renderApiResult = (api: ApiResult) => {
    if (api.loading) {
      return (
        <div className="flex items-center gap-3 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <div>
            <div className="font-semibold text-blue-800">
              Đang kiểm tra với {api.name}
            </div>
            <div className="text-sm text-blue-600">Vui lòng chờ...</div>
          </div>
        </div>
      );
    }

    if (!api.result) return null;

    const { result } = api;

    if (result.error) {
      return (
        <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">{api.name}</span>
          </div>
          <div className="text-sm text-orange-700">{result.error}</div>
        </div>
      );
    }

    if (result.isSafe) {
      return (
        <>
          {api.name === "Google Safe Browsing" && (
            <div
              className={`p-4 border rounded-lg ${
                result?.matches?.length === 0
                  ? "border-gray-300 bg-gray-50" // Không tìm thấy
                  : "border-green-200 bg-green-50" // An toàn
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2
                  className={`w-5 h-5 ${
                    result?.matches?.length === 0
                      ? "text-gray-500"
                      : "text-green-600"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    result?.matches?.length === 0
                      ? "text-gray-800"
                      : "text-green-800"
                  }`}
                >
                  {api.name}
                </span>
              </div>

              {result?.matches?.length === 0 ? (
                <div className="text-sm text-gray-700">
                  Không tìm thấy trong cơ sở dữ liệu
                </div>
              ) : (
                <div className="text-sm text-green-700">An toàn</div>
              )}
            </div>
          )}
          {api.name === "IPQS" && (
            <div
              className={`p-4 border ${
                result.details.risk_score === 0
                  ? "border-green-200 bg-green-50"
                  : "border-yellow-200 bg-yellow-50"
              } rounded-lg `}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2
                  className={`w-5 h-5 ${
                    result.details.risk_score === 0
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    result.details.risk_score === 0
                      ? "text-green-800"
                      : "text-yellow-800"
                  }`}
                >
                  {api.name}
                </span>
              </div>
              <div
                className={`text-sm ${
                  result.details.risk_score < 20
                    ? "text-green-700"
                    : "text-yellow-700"
                }`}
              >
                {result.details.risk_score === 0 ? "An toàn" : "Có nguy cơ"}
              </div>
              {result.details && (
                <div
                  className={`mt-2 text-xs ${
                    result.details.risk_score === 0
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  <div>Risk Score: {result.details.risk_score || 0}/100</div>
                  {result.details.country && (
                    <div>Quốc gia: {result.details.country}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      );
    }

    // Website không an toàn
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-red-800">{api.name}</span>
        </div>
        <div className="mb-2 text-sm text-red-700">Phát hiện mối đe dọa</div>

        {/* Chi tiết cho Google Safe Browsing */}
        {api.name === "Google Safe Browsing" &&
          result.matches &&
          result.matches.length > 0 && (
            <div className="mt-2">
              {result.matches.map((match, index) => (
                <div key={index} className="mb-1 text-xs text-red-600">
                  • {match.threatType || "Mối đe dọa không xác định"}
                </div>
              ))}
            </div>
          )}

        {/* Chi tiết cho IPQS */}
        {api.name === "IPQS" && result.details && (
          <div className="mt-2 space-y-1 text-xs text-red-600">
            <div>Risk Score: {result.details.risk_score || 0}/100</div>
            {result.details.malware && <div>• Malware detected</div>}
            {result.details.phishing && <div>• Phishing detected</div>}
            {result.details.suspicious && <div>• Suspicious activity</div>}
            {result.details.country && (
              <div>Quốc gia: {result.details.country}</div>
            )}
          </div>
        )}
      </div>
    );
  };

  const overallSafe = apiResults
    .filter((api) => !api.loading && api.result)
    .every((api) => api.result!.isSafe);

  const hasErrors = apiResults.some((api) => api.result?.error);
  const isLoading = apiResults.some((api) => api.loading);

  return (
    <div className="p-6 bg-white border border-gray-200 shadow rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Globe className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Kiểm tra tính an toàn của URL
          </h3>
          <div className="text-sm text-gray-600 break-all">{url}</div>
        </div>
      </div>

      {/* Kết quả tổng quan */}
      {!isLoading && (
        <div
          className={`p-4 rounded-lg mb-4 ${
            overallSafe
              ? "bg-green-50 border border-green-200"
              : hasErrors
              ? "bg-orange-50 border border-orange-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {overallSafe ? (
              <>
                <Shield className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">
                  Website An Toàn
                </span>
              </>
            ) : hasErrors ? (
              <>
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <span className="font-bold text-orange-800">
                  Không thể xác định hoàn toàn
                </span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-6 h-6 text-red-600" />
                <span className="font-bold text-red-800">
                  Cảnh báo: Website Nguy Hiểm!
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Kết quả từng API */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Kết quả từ bên thứ 3</h4>
        {apiResults.map((api, index) => (
          <div key={index}>{renderApiResult(api)}</div>
        ))}
      </div>

      {/* Khuyến cáo khi có mối đe dọa */}
      {!isLoading && !overallSafe && !hasErrors && (
        <div className="p-4 mt-4 border border-red-200 rounded-lg bg-red-50">
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
      )}

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Kiểm tra được thực hiện bởi các dịch vụ bảo mật uy tín</span>
          <div className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            <span>Powered by Google & IPQS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleSafeResult;
