import React, { useEffect, useState } from "react";
import {
  Shield,
  ShieldAlert,
  CheckCircle2,
  Globe,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { ApiResult } from "@/types/SafetyType";

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
                result.details?.risk_score === 0
                  ? "border-green-200 bg-green-50"
                  : "border-yellow-200 bg-yellow-50"
              } rounded-lg `}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2
                  className={`w-5 h-5 ${
                    result.details?.risk_score === 0
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    result.details?.risk_score === 0
                      ? "text-green-800"
                      : "text-yellow-800"
                  }`}
                >
                  {api.name}
                </span>
              </div>
              <div
                className={`text-sm ${
                  result.details?.risk_score !== undefined &&
                  result.details.risk_score < 20
                    ? "text-green-700"
                    : "text-yellow-700"
                }`}
              >
                {result.details?.risk_score !== undefined &&
                result.details.risk_score === 0
                  ? "An toàn"
                  : "Có nguy cơ"}
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
                </div>
              )}
            </div>
          )}
          {api.name === "VirusTotal" && (
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">{api.name}</span>
              </div>
              <div className="text-sm text-green-700">An toàn</div>
              {result.details && result.details?.summary && (
                <div className="mt-2 text-xs text-green-600">
                  <div>Harmless: {result.details.summary.harmless}</div>
                  <div>Undetected: {result.details.summary.undetected}</div>
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
          </div>
        )}

        {/* Chi tiết cho VirusTotal */}
        {api.name === "VirusTotal" && result.details && result.details && (
          <div className="mt-2 space-y-2 text-xs text-red-600">
            {result.details.summary && (
              <div className="p-2 border border-red-300 rounded bg-red-100/50">
                <div className="mb-1 font-semibold">Tổng quan quét:</div>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    • Malicious:{" "}
                    <span className="font-bold">
                      {result.details.summary.malicious}
                    </span>
                  </div>
                  <div>
                    • Suspicious:{" "}
                    <span className="font-bold">
                      {result.details.summary.suspicious}
                    </span>
                  </div>
                  <div>• Harmless: {result.details.summary.harmless}</div>
                  <div>• Undetected: {result.details.summary.undetected}</div>
                </div>
                <div className="mt-1 font-semibold">
                  Tổng cộng: {result.details.summary.total} nguồn
                </div>
              </div>
            )}
            {result.details.maliciousEngines &&
              result.details.maliciousEngines.length > 0 && (
                <div className="overflow-hidden border border-red-300 rounded">
                  <div className="px-2 py-1 mb-1 font-semibold bg-red-200">
                    Nguồn phát hiện mối đe dọa:
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-red-100">
                        <tr>
                          <th className="px-2 py-1 font-semibold text-left border-b border-red-300">
                            Nguồn
                          </th>
                          <th className="px-2 py-1 font-semibold text-left border-b border-red-300">
                            Kết quả
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.details.maliciousEngines.map((engine, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-red-50" : "bg-white"}
                          >
                            <td className="px-2 py-1 border-b border-red-200">
                              {engine.engine}
                            </td>
                            <td className="px-2 py-1 font-semibold border-b border-red-200">
                              {engine.result}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
  const [isImgLoading, setIsImgLoading] = useState(true);
  useEffect(() => {
    setIsImgLoading(true);
  }, [url]);
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

      {/* 2 cột: Kết quả & Ảnh */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Cột 1: Kết quả nguy cơ */}
        <div>
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
            <h4 className="font-semibold text-gray-700">
              Kết quả từ bên thứ 3
            </h4>
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
        </div>

        {/* Cột 2: Ảnh website */}
        <div className="flex flex-col items-center justify-start">
          <div className="w-full overflow-hidden border-2 border-gray-300 shadow-md rounded-xl bg-gray-50 relative min-h-[200px] flex items-center justify-center">
            {isImgLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              </div>
            )}
            <img
              src={`${
                process.env.NEXT_PUBLIC_API_URL
              }/safety/screenshot-website?url=${encodeURIComponent(url)}`}
              alt="Website screenshot"
              className={`object-contain w-full transition-opacity duration-300 ${
                isImgLoading ? "opacity-0" : "opacity-100"
              }`}
              style={{ minHeight: 200, background: "#f3f4f6" }}
              loading="lazy"
              onLoad={() => setIsImgLoading(false)}
              onError={() => setIsImgLoading(false)}
            />
          </div>
          <div className="mt-2 text-xs text-center text-gray-500">
            Ảnh chụp màn hình website
          </div>
        </div>
      </div>

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
