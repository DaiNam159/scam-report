"use client";

import BlacklistFilter from "@/components/user/blacklist/BlacklistFilter";
import BlacklistTable from "@/components/user/blacklist/BlacklistTable";
import { useEffect, useState, useCallback } from "react";
import type { ReportType } from "@/types/ReportType";
import { BlacklistItem } from "@/types/BlacklistType";
import { ShieldAlert, Users, Info, Sparkles } from "lucide-react";
import { BlacklistService, BlacklistStats } from "@/services/BlacklistService";

export default function BlacklistComponent() {
  const [type, setType] = useState<ReportType>("email_address");
  const [data, setData] = useState<BlacklistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<BlacklistStats>({
    totalItems: 1280,
    totalReports: 23456,
    totalUsers: 3200,
  });
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // FAQ giả lập
  const FAQS = [
    {
      q: "Danh sách đen này lấy từ đâu?",
      a: "Dữ liệu tổng hợp từ cộng đồng, chuyên gia và các nguồn tin cậy.",
    },
    {
      q: "Nếu tôi phát hiện nhầm lẫn thì làm sao?",
      a: "Bạn có thể gửi báo cáo phản hồi hoặc liên hệ với chúng tôi để được hỗ trợ.",
    },
    {
      q: "Tôi có thể đóng góp thêm dữ liệu không?",
      a: "Bạn có thể gửi báo cáo lừa đảo mới bằng nút bên dưới.",
    },
  ];

  // Load thống kê khi component mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await BlacklistService.getBlacklistStats();
        setStats(statsData);
      } catch (error) {
        console.error("Error loading stats:", error);
        // Giữ nguyên stats mặc định nếu API lỗi
      }
    };

    loadStats();
  }, []);

  // Load blacklist khi type hoặc search thay đổi
  useEffect(() => {
    const fetchBlacklist = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await BlacklistService.getBlacklist({
          type,
          search: searchQuery || undefined,
          page: 1,
          limit: 10,
          sortBy: "reportCount",
          sortOrder: "desc",
        });

        setData(response.data);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách đen:", err);
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");

        // Fallback to fake data nếu API lỗi

        const allowedTypes = [
          "email_address",
          "phone",
          "website",
          "social",
          "bank_account",
          "e_wallet",
          "person_org",
        ];

        const safeType = allowedTypes.includes(type) ? type : allowedTypes[0];
        const filteredData = data.filter(
          (row) => String(row.type) === String(safeType)
        );
        setData(filteredData);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    fetchBlacklist();
  }, [type, searchQuery]);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    try {
      const response = await BlacklistService.getBlacklist({
        type,
        search: searchQuery || undefined,
        page: newPage,
        limit: pagination.limit,
        sortBy: "reportCount",
        sortOrder: "desc",
      });

      setData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Lỗi khi tải trang:", err);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(!!query);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset về trang đầu khi search
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 py-10 bg-gradient-to-br from-[#fff8e1] via-[#fbe9e7] to-[#e3f2fd]">
      <div className="flex flex-col w-full max-w-5xl gap-8">
        {/* Banner + Thống kê */}
        <div className="relative flex flex-col items-center gap-6 p-8 overflow-hidden bg-white border border-gray-100 shadow-xl md:flex-row rounded-3xl">
          <div className="flex flex-col items-center flex-1 md:items-start">
            <ShieldAlert className="w-14 h-14 text-[#e53935] animate-pulse mb-2" />
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left mb-2 text-[#e53935] tracking-tight drop-shadow">
              Danh sách đen lừa đảo
            </h1>
            <p className="max-w-2xl mb-2 text-lg text-center text-gray-700 md:text-left">
              Tổng hợp các tài khoản ngân hàng, số điện thoại, email, website...
              đã bị cộng đồng báo cáo lừa đảo nhiều lần. Hãy kiểm tra trước khi
              giao dịch!
            </p>
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
              <Info className="w-4 h-4" />
              <span>
                Dữ liệu được kiểm duyệt và cập nhật liên tục từ cộng đồng.
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-4 md:flex-col">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-2xl shadow min-w-[120px]">
              <ShieldAlert className="w-6 h-6 text-[#e53935] animate-pulse" />
              <div>
                <div className="font-bold text-lg text-[#e53935]">
                  {stats.totalItems.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Tổng mục bị báo cáo</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-2xl shadow min-w-[120px]">
              <Sparkles className="w-6 h-6 text-[#fbc02d]" />
              <div>
                <div className="font-bold text-lg text-[#e53935]">
                  {stats.totalReports.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Lượt báo cáo</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-2xl shadow min-w-[120px]">
              <Users className="w-6 h-6 text-[#43a047]" />
              <div>
                <div className="font-bold text-lg text-[#e53935]">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Người dùng đóng góp</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-col items-center w-full gap-4 p-4 bg-white border border-gray-100 shadow rounded-2xl md:flex-row">
          <div className="w-full md:w-auto">
            <BlacklistFilter
              selectedType={type}
              onChange={setType}
              onSearch={handleSearch}
              searchValue={searchQuery}
            />
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="flex flex-col gap-2 text-xs text-gray-600">
              <span className="font-medium">
                Kết quả tìm kiếm cho: &quot;{searchQuery}&quot;
              </span>
              {pagination.total > 0 && (
                <span>Tìm thấy {pagination.total} kết quả</span>
              )}
            </div>
          )}

          {/* Ví dụ - chỉ hiện khi không search */}
          {!searchQuery && (
            <div className="flex flex-wrap justify-end flex-1 gap-2 text-xs text-gray-500">
              <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
                Ví dụ: scam@email.com
              </span>
              <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
                Ví dụ: 0912345678
              </span>
              <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
                Ví dụ: http://luadao.com
              </span>
            </div>
          )}
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-2xl">
            <div className="flex items-center gap-2 text-red-600">
              <Info className="w-5 h-5" />
              <span className="font-semibold">Có lỗi xảy ra:</span>
            </div>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Bảng dữ liệu */}
        <div className="w-full p-4 bg-white border border-gray-100 shadow-lg rounded-2xl">
          {loading || isSearching ? (
            <div className="flex items-center justify-center py-10">
              <span className="animate-spin rounded-full border-4 border-[#e53935] border-t-transparent w-8 h-8 mr-3"></span>
              <span className="text-lg text-[#e53935] font-semibold">
                {isSearching ? "Đang tìm kiếm..." : "Đang tải dữ liệu..."}
              </span>
            </div>
          ) : (
            <BlacklistTable
              data={data}
              selectedType={type}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* FAQ + Đóng góp */}
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1 p-5 bg-white border border-gray-100 shadow rounded-2xl">
            <h3 className="text-base font-bold mb-3 text-[#e53935] flex items-center gap-2">
              <Info className="w-5 h-5 text-[#e53935]" />
              Câu hỏi thường gặp
            </h3>
            <ul className="space-y-2 text-sm">
              {FAQS.map((faq, idx) => (
                <li key={idx}>
                  <b className="block text-gray-800">{faq.q}</b>
                  <span className="text-gray-700">{faq.a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#e53935]/90 to-[#fbc02d]/90 rounded-2xl shadow text-white">
            <Sparkles className="w-8 h-8 mb-2 text-white" />
            <div className="mb-2 text-lg font-bold">Đóng góp cho cộng đồng</div>
            <div className="mb-4 text-sm text-center">
              Nếu bạn phát hiện thông tin lừa đảo mới, hãy gửi báo cáo để bảo vệ
              cộng đồng!
            </div>
            <a
              href="/bao-cao"
              className="inline-block px-6 py-3 rounded-xl bg-white text-[#e53935] font-bold shadow hover:bg-gray-100 transition"
            >
              Gửi báo cáo lừa đảo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
