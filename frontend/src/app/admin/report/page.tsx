"use client";

import { useEffect, useState } from "react";
import { Report } from "@/models/ReportModel";
import { ReportStatus } from "@/types/ReportType";
import ReportsTable from "@/components/admin/report/ReportsTable";
import ReportDetailModal from "@/components/admin/report/ReportDetailModal";
import { ReportService } from "@/services/ReportService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (currentPage = 1) => {
    try {
      const { data, totalPages } = await ReportService.getReports(currentPage);
      setReports(data);
      setTotalPages(totalPages);
      setPage(currentPage);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách báo cáo:", error);
    }
  };

  const handleView = (report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa báo cáo này không?")) {
      try {
        // await ReportService.delete(id);
        setReports((prev) => prev.filter((r) => r.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa báo cáo:", error);
      }
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      if (status === ReportStatus.APPROVED) {
        await ReportService.approveReport(id);
      } else if (status === ReportStatus.REJECTED) {
        await ReportService.rejectReport(id);
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
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const maxPagesToShow = 5; // Show up to 5 page numbers at a time
    const pages: (number | string)[] = [];
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-4 text-2xl font-bold text-black">Quản lý Báo cáo</h1>

      <ReportsTable
        reports={reports}
        onView={handleView}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col items-center justify-center gap-4 mt-8">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 shadow-lg rounded-xl">
          <button
            disabled={page <= 1}
            onClick={() => fetchReports(page - 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 rounded-lg shadow bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Trang trước"
          >
            <FaChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline"></span>
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <span
                  key={index}
                  className="px-3 py-1 font-semibold text-gray-400 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => fetchReports(Number(pageNum))}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg shadow transition-all duration-150 border
              ${
                page === pageNum
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500 scale-105"
                  : "bg-gray-100 text-red-500 border-gray-200 hover:bg-red-50 hover:scale-105"
              }
              focus:outline-none focus:ring-2 focus:ring-red-400`}
                  aria-current={page === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => fetchReports(page + 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 rounded-lg shadow bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Trang sau"
          >
            <span className="hidden sm:inline"></span>
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm font-medium text-gray-600">
          Trang {page} / {totalPages}
        </div>
      </div>
    </div>
  );
}
