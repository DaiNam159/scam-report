import { fetchNewsByTopic } from "@/services/NewsService";
import { Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  reportPending: number;
  reportApproved: number;
  userCount: number;
}

export default function MiddleSide({
  reportPending,
  reportApproved,
  userCount,
}: Props) {
  const [news, setNews] = useState<
    { title: string; link: string; pubDate?: string; contentSnippet?: string }[]
  >([]);
  useEffect(() => {
    fetchNewsByTopic("tin-moi-nhat").then(setNews);
  }, []);
  return (
    <>
      <div className="flex-shrink-0 w-full md:w-1/3">
        <div className="sticky flex flex-col gap-6 top-8">
          {/* Lưu ý an toàn */}
          <div className="p-5 bg-yellow-50 border-l-4 border-[#fbc02d] rounded-2xl text-gray-800 text-sm">
            <b>Lưu ý:</b> Không cung cấp mã OTP, mật khẩu, thông tin cá nhân cho
            bất kỳ ai. Nếu nghi ngờ bị lừa đảo, hãy báo cáo ngay!
          </div>
          {/* Thống kê nhanh */}
          <div className="flex flex-col gap-3 p-5 bg-white border border-gray-100 shadow rounded-2xl">
            <h3 className="text-base font-bold mb-2 text-[#e53935] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#43a047]" />
              Thống kê cộng đồng
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Báo cáo chờ xử lý
                </span>
                <span className="font-bold text-[#e53935]">
                  {reportPending}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Báo cáo đã xác thực
                </span>
                <span className="font-bold text-[#fbc02d]">
                  {reportApproved}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Người dùng tham gia
                </span>
                <span className="font-bold text-[#43a047]">{userCount}</span>
              </div>
            </div>
          </div>
          {/* Tin tức nổi bật */}
          <div className="p-5 bg-white border border-gray-100 shadow rounded-2xl">
            <h2 className="text-lg font-bold mb-2 text-[#e53935] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#fbc02d]" />
              Tin tức nổi bật
            </h2>
            <ul className="space-y-2 text-sm">
              {news.length > 0 ? (
                news.slice(0, 10).map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-700 hover:underline"
                      title={item.contentSnippet}
                    >
                      {item.title}
                    </a>
                    {item.pubDate && (
                      <div className="text-xs text-gray-400">
                        {new Date(item.pubDate).toLocaleDateString("vi-VN")}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <li>Đang tải tin tức...</li>
              )}
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="text-sm text-center text-gray-500">
            Cần hỗ trợ thêm? Liên hệ:{" "}
            <a
              href="mailto:support@scamreport.vn"
              className="text-[#e53935] underline"
            >
              dainam1598@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
