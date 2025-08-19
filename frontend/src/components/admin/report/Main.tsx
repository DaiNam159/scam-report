"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Report } from "@/models/ReportModel";
import { ReportStatus } from "@/types/ReportType";
import ReportsTable from "@/components/admin/report/ReportsTable";
import ReportDetailModal from "@/components/admin/report/ReportDetailModal";
import ReportFilter, {
  ReportFilters,
} from "@/components/admin/report/ReportFilter";
import { ReportService } from "@/services/ReportService";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFileAlt,
  FaEye,
  FaUsers,
} from "react-icons/fa";

export default function AdminReportComponent() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [totalPendingReports, setTotalPendingReports] = useState(0);
  const [totalApprovedReports, setTotalApprovedReports] = useState(0);
  const [filters, setFilters] = useState<ReportFilters>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [lastValidPagination, setLastValidPagination] = useState<{
    page: number;
    totalPages: number;
    pageNumbers: (number | string)[];
  }>({
    page: 1,
    totalPages: 1,
    pageNumbers: [],
  });
  useEffect(() => {
    fetchReports();
    fetchTotalReports();
    fetchTotalPendingReports();
    fetchTotalApprovedReports();
  }, []);

  const fetchReports = useCallback(
    async (
      currentPage = 1,
      filterParams?: ReportFilters,
      sortKey = sortBy,
      sortDir = sortOrder
    ) => {
      try {
        setIsFiltering(true);
        // Không set isLoading để tránh flash loading state
        const { data, total, limit } = await ReportService.getReports(
          currentPage,
          filterParams,
          sortKey,
          sortDir
        );

        // Batch update để tránh multiple re-renders
        setReports(data);
        const newTotalPages = Math.ceil(total / limit);
        setTotalPages(newTotalPages);
        setPage(currentPage);
        setLastValidPagination({
          page: currentPage,
          totalPages: newTotalPages,
          pageNumbers: calculatePageNumbers(currentPage, newTotalPages),
        });
      } catch (error) {
        console.error("Lỗi khi lấy danh sách báo cáo:", error);
      } finally {
        // Thêm delay nhỏ để smooth transition
        setTimeout(() => {
          setIsFiltering(false);
        }, 100);
      }
    },
    [sortBy, sortOrder]
  );

  const fetchTotalReports = async () => {
    try {
      const total = await ReportService.countAllReports();
      setTotalReports(total);
    } catch (error) {
      console.error("Lỗi khi lấy tổng số báo cáo:", error);
    }
  };

  const fetchTotalPendingReports = async () => {
    try {
      const total = await ReportService.countPendingReport();
      setTotalPendingReports(total);
    } catch (error) {
      console.error("Lỗi khi lấy tổng số báo cáo chờ duyệt:", error);
    }
  };

  const fetchTotalApprovedReports = async () => {
    try {
      const total = await ReportService.countApprovedReport();
      setTotalApprovedReports(total);
    } catch (error) {
      console.error("Lỗi khi lấy tổng số báo cáo đã duyệt:", error);
    }
  };

  const handleView = useCallback((report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa báo cáo này không?")) {
      try {
        await ReportService.deleteReport(id);
        setReports((prev) => prev.filter((r) => r.id !== id));
        setTotalPendingReports((prev) => prev - 1);
      } catch (error) {
        console.error("Lỗi khi xóa báo cáo:", error);
      }
    }
  }, []);

  const handleStatusChange = useCallback(async (id: number, status: string) => {
    try {
      if (status === ReportStatus.APPROVED) {
        await ReportService.approveReport(id);
        setTotalPendingReports((prev) => prev - 1);
        setTotalApprovedReports((prev) => prev + 1);
      } else if (status === ReportStatus.REJECTED) {
        await ReportService.rejectReport(id);
        setTotalPendingReports((prev) => prev - 1);
      } else {
        return;
      }
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: status as ReportStatus } : r
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  }, []);

  const handleFilter = useCallback(
    (newFilters: ReportFilters) => {
      setFilters(newFilters);
      setPage(1);
      fetchReports(1, newFilters);
    },
    [fetchReports]
  );

  const handleResetFilter = useCallback(() => {
    setFilters({});
    setPage(1);
    fetchReports(1, {});
  }, [fetchReports]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchReports(newPage, filters);
    },
    [fetchReports, filters]
  );

  const handleSortChange = useCallback(
    (column: string, direction: "ASC" | "DESC") => {
      setSortBy(column);
      setSortOrder(direction);
      fetchReports(page, filters, column, direction);
    },
    [page, filters, fetchReports]
  );

  // Memoize pagination để tránh re-calculation
  const calculatePageNumbers = useCallback(
    (currentPage: number, totalPagesCount: number): (number | string)[] => {
      const maxPagesToShow = 5;
      const pages: (number | string)[] = [];
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPagesCount, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPagesCount) {
        if (endPage < totalPagesCount - 1) pages.push("...");
        pages.push(totalPagesCount);
      }

      return pages;
    },
    []
  );
  // Memoize pagination với fallback
  const calculatedPageNumbers = useMemo((): (number | string)[] => {
    if (isFiltering) {
      return lastValidPagination.pageNumbers;
    }
    return calculatePageNumbers(page, totalPages);
  }, [page, totalPages, isFiltering, lastValidPagination.pageNumbers]);
  // Sử dụng current hoặc last valid values
  const displayPage = isFiltering ? lastValidPagination.page : page;
  const displayTotalPages = isFiltering
    ? lastValidPagination.totalPages
    : totalPages;
  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FaFileAlt className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Quản lý Báo cáo
          </h1>
        </div>
        <p className="text-sm text-gray-600 md:text-base">
          Xem xét và quản lý các báo cáo lừa đảo từ người dùng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng báo cáo</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaFileAlt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-orange-600">
                {totalPendingReports}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FaEye className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">
                {totalApprovedReports}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaUsers className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Filter */}
      <ReportFilter onFilter={handleFilter} onReset={handleResetFilter} />

      {/* Reports Table with fixed height */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div
          className="transition-opacity duration-200 ease-in-out"
          style={{
            minHeight: "600px",
            opacity: isFiltering ? 0.6 : 1,
          }}
        >
          {isFiltering ? (
            // Skeleton với cấu trúc table thật
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-separate border-spacing-0">
                <thead>
                  <tr className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-300 uppercase border-b border-blue-200">
                      <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-300 uppercase border-b border-blue-200">
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-300 uppercase border-b border-blue-200">
                      <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-300 uppercase border-b border-blue-200">
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-300 uppercase border-b border-blue-200">
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-300 uppercase border-b border-blue-200">
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-300 uppercase border-b border-blue-200 w-[140px]">
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {[...Array(8)].map((_, i) => (
                    <tr key={i} className="h-[72px]">
                      <td className="px-6 py-4 border-b border-blue-50 h-[72px]">
                        <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 border-b border-blue-50 h-[72px]">
                        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 border-b border-blue-50 h-[72px]">
                        <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 border-b border-blue-50 h-[72px]">
                        <div className="space-y-1">
                          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-32 h-2 bg-gray-100 rounded animate-pulse"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-blue-50 h-[72px]">
                        <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 border-b border-blue-50 h-[72px]">
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 border-b border-blue-50 w-[140px] h-[72px]">
                        <div className="flex items-center justify-center h-full">
                          <div className="grid grid-cols-2 gap-1 w-[120px]">
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ReportsTable
              reports={reports}
              onView={handleView}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onSortChange={handleSortChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Pagination Controls - LUÔN HIỂN THỊ VỚI GIÁ TRỊ ỔN ĐỊNH */}
      <div className="flex flex-col items-center justify-center gap-4 mt-8">
        <div
          className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 shadow-sm rounded-xl"
          style={{
            opacity: isFiltering ? 0.6 : 1,
            pointerEvents: isFiltering ? "none" : "auto",
          }}
        >
          <button
            disabled={displayPage <= 1 || isFiltering}
            onClick={() => handlePageChange(displayPage - 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200"
            aria-label="Trang trước"
          >
            <FaChevronLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Trước</span>
          </button>

          <div className="flex items-center gap-1 mx-4">
            {calculatedPageNumbers.map((pageNum, index) =>
              pageNum === "..." ? (
                <span
                  key={`${pageNum}-${index}`}
                  className="px-3 py-2 text-sm font-medium text-gray-400 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`${pageNum}-${index}`}
                  onClick={() =>
                    !isFiltering && handlePageChange(Number(pageNum))
                  }
                  disabled={isFiltering}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border
                  ${
                    displayPage === pageNum
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200"
                  }`}
                  aria-current={displayPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          <button
            disabled={displayPage >= displayTotalPages || isFiltering}
            onClick={() => handlePageChange(displayPage + 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200"
            aria-label="Trang sau"
          >
            <span className="hidden sm:inline">Sau</span>
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div
          className="text-sm font-medium text-gray-500"
          style={{
            opacity: isFiltering ? 0.6 : 1,
          }}
        >
          {isFiltering ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
              <span>Đang tải trang {displayPage}...</span>
            </div>
          ) : (
            <>
              Hiển thị trang {displayPage} / {displayTotalPages}
              {Object.values(filters).some((v) => v) && (
                <span className="ml-2 text-blue-600">(đã lọc)</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
