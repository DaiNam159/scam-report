"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  FaFilter,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface Props {
  onFilter: (filters: UserFilters) => void;
  onReset: () => void;
}

export interface UserFilters {
  search?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export default function UserFilter({ onFilter, onReset }: Props) {
  const [filters, setFilters] = useState<UserFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const updatedFilters = { ...filters, search: searchValue || undefined };
      setFilters(updatedFilters);
      onFilter(updatedFilters);
    }, 400);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchValue]);

  const updateFilter = useCallback(
    (key: keyof UserFilters, value: string | boolean | undefined) => {
      if (key === "search") {
        setSearchValue((value as string) || "");
        return;
      }

      const updatedFilters = {
        ...filters,
        [key]: value === "" || value === undefined ? undefined : value,
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
    Object.values(filters).some((value) => value !== undefined) || searchValue;

  return (
    <div className="mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
            <FaFilter className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Bộ lọc người dùng</h3>
            <p className="text-xs text-gray-600">
              Tìm kiếm và lọc người dùng theo tiêu chí
            </p>
          </div>
          {hasFiltersActive && (
            <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-200 rounded-full shadow-sm">
              {Object.values(filters).filter((v) => v !== undefined).length} bộ
              lọc
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
            placeholder="Tìm kiếm theo email hoặc tên..."
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
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Trạng thái
                </label>
                <select
                  value={
                    filters.isActive === undefined
                      ? ""
                      : filters.isActive
                      ? "true"
                      : "false"
                  }
                  onChange={(e) =>
                    updateFilter(
                      "isActive",
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true"
                    )
                  }
                  className="w-full px-4 py-3 text-sm font-medium text-gray-800 transition-all bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="true">Hoạt động</option>
                  <option value="false">Vô hiệu hóa</option>
                </select>
              </div>
            </div>

            {/* Date Range Filters */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <label className="block mb-3 text-sm font-bold text-gray-800">
                Khoảng thời gian đăng ký
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
                    className="w-full px-4 py-3 text-sm font-medium text-gray-800 transition-all bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
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
                    if (value === undefined) return null;

                    let label = key;
                    let displayValue = String(value);

                    if (key === "isActive") {
                      label = "Trạng thái";
                      displayValue = value ? "Hoạt động" : "Vô hiệu hóa";
                    } else if (key === "search") {
                      label = "Tìm kiếm";
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
                            updateFilter(key as keyof UserFilters, "")
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
