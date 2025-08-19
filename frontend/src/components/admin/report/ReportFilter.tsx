"use client";

import { ReportType, ReportStatus } from "@/types/ReportType";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  FaFilter,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface Props {
  onFilter: (filters: ReportFilters) => void;
  onReset: () => void;
}

export interface ReportFilters {
  type?: ReportType;
  status?: ReportStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  userEmail?: string;
}

const reportTypes = [
  { value: "email_address", label: "Địa chỉ email" },
  { value: "person_org", label: "Người / Tổ chức" },
  { value: "email_content", label: "Nội dung email" },
  { value: "phone", label: "Số điện thoại" },
  { value: "sms", label: "Tin nhắn SMS" },
  { value: "website", label: "Trang web" },

  { value: "social", label: "Trang mạng xã hội" },
  { value: "bank_account", label: "Tài khoản ngân hàng" },
  { value: "e_wallet", label: "Ví điện tử" },
];

const reportStatuses = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

export default function ReportFilter({ onFilter, onReset }: Props) {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(""); // Local state cho search input
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Đảm bảo khi filters thay đổi từ bên ngoài (reset), searchValue cũng được cập nhật lại
  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

  // Debounce search để tránh call API liên tục
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Gộp searchValue vào filters và chỉ gọi onFilter nếu có thay đổi thực sự
      const updatedFilters = { ...filters, search: searchValue || undefined };
      setFilters(updatedFilters);
      onFilter(updatedFilters);
    }, 400);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // Khi thay đổi các filter khác ngoài search
  const updateFilter = useCallback(
    (key: keyof ReportFilters, value: string) => {
      if (key === "search") {
        setSearchValue(value);
        return;
      }
      // Nếu filter khác search thay đổi, giữ nguyên searchValue hiện tại
      const updatedFilters = {
        ...filters,
        [key]: value || undefined,
        search: searchValue || undefined,
      };
      setFilters(updatedFilters);
      onFilter(updatedFilters);
    },
    [filters, onFilter, searchValue]
  );

  const resetAllFilters = useCallback(() => {
    setFilters({});
    setSearchValue("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onReset();
  }, [onReset]);

  const hasFiltersActive =
    Object.values(filters).some((value) => value) || searchValue;

  return (
    <div className="mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
            <FaFilter className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Bộ lọc báo cáo</h3>
            <p className="text-xs text-gray-600">
              Tìm kiếm và lọc báo cáo theo tiêu chí
            </p>
          </div>
          {hasFiltersActive && (
            <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-200 rounded-full shadow-sm">
              {Object.values(filters).filter((v) => v).length} bộ lọc
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasFiltersActive && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-700 transition-all duration-200 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 hover:border-red-300 hover:shadow-md"
            >
              <FaTimes className="w-3 h-3" />
              Xóa bộ lọc
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300 hover:shadow-md"
          >
            {isExpanded ? (
              <>
                <FaChevronUp className="w-3 h-3" />
                Thu gọn
              </>
            ) : (
              <>
                <FaChevronDown className="w-3 h-3" />
                Mở rộng
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="relative">
          <FaSearch className="absolute w-4 h-4 text-blue-500 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề, mô tả, người dùng..."
            className="w-full py-3 pl-10 pr-10 text-sm font-medium text-gray-800 transition-all bg-white border-2 border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute p-1 text-gray-400 transition-colors transform -translate-y-1/2 rounded-full right-3 top-1/2 hover:text-red-500 hover:bg-red-50"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          )}
          {/* Loading indicator when debouncing */}
          {searchValue && searchValue !== filters.search && (
            <div className="absolute transform -translate-y-1/2 right-8 top-1/2">
              <div className="w-3 h-3 border border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="space-y-6">
            {/* Primary Filters Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Report Type Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Loại báo cáo
                </label>
                <select
                  value={filters.type || ""}
                  onChange={(e) => updateFilter("type", e.target.value)}
                  className="w-full px-4 py-3 text-sm font-medium text-gray-800 transition-all bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                >
                  <option value="">Tất cả loại báo cáo</option>
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Trạng thái
                </label>
                <select
                  value={filters.status || ""}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className="w-full px-4 py-3 text-sm font-medium text-gray-800 transition-all bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                >
                  <option value="">Tất cả trạng thái</option>
                  {reportStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Email Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Email người báo cáo
                </label>
                <input
                  type="email"
                  value={filters.userEmail || ""}
                  onChange={(e) => updateFilter("userEmail", e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 text-sm font-medium text-gray-800 transition-all bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                />
              </div>
            </div>

            {/* Date Range Filters */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <label className="block mb-3 text-sm font-bold text-gray-800">
                Khoảng thời gian
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom || ""}
                    onChange={(e) => updateFilter("dateFrom", e.target.value)}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-800 transition-all bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo || ""}
                    onChange={(e) => updateFilter("dateTo", e.target.value)}
                    className="px-4 py-3 text-sm font-medium text-gray-800 transition-all bg-white border-2 border-gray-300 rounded-lg shadow-sm text-gray-800w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Filter Summary */}
            {hasFiltersActive && (
              <div className="p-4 border-2 border-blue-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                <h4 className="flex items-center gap-2 mb-3 text-sm font-bold text-blue-900">
                  <FaFilter className="w-3 h-3" />
                  Bộ lọc đang áp dụng:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null;

                    let label = key;
                    let displayValue = value;

                    if (key === "type") {
                      const type = reportTypes.find((t) => t.value === value);
                      label = "Loại";
                      displayValue = type?.label || value;
                    } else if (key === "status") {
                      const status = reportStatuses.find(
                        (s) => s.value === value
                      );
                      label = "Trạng thái";
                      displayValue = status?.label || value;
                    } else if (key === "search") {
                      label = "Tìm kiếm";
                    } else if (key === "userEmail") {
                      label = "Email";
                    } else if (key === "dateFrom") {
                      label = "Từ";
                    } else if (key === "dateTo") {
                      label = "Đến";
                    }

                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-800 transition-colors bg-blue-100 border border-blue-300 rounded-full shadow-sm hover:bg-blue-200"
                      >
                        <span className="font-bold">{label}:</span>
                        <span className="truncate max-w-20">
                          {displayValue}
                        </span>
                        <button
                          onClick={() =>
                            updateFilter(key as keyof ReportFilters, "")
                          }
                          className="ml-1 text-blue-700 hover:text-red-600 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                        >
                          <FaTimes className="w-2 h-2" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
