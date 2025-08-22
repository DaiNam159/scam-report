import { useEffect, useState } from "react";
import { BlacklistItem } from "@/types/BlacklistType";
import { ReportType } from "@/types/ReportType";
import { useRouter } from "next/navigation";

interface Props {
  data: BlacklistItem[];
  selectedType: ReportType;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

const PAGE_SIZE = 10;

// Map type sang label tiếng Việt
const typeLabels: Record<string, string> = {
  email_address: "Email",
  phone: "Số điện thoại",
  website: "Website",
  social: "Mạng xã hội",
  bank_account: "Tài khoản ngân hàng",
  e_wallet: "Ví điện tử",
  person_org: "Cá nhân / tổ chức",
  other: "Khác",
};

// Định nghĩa cột cho từng loại báo cáo
const getColumnsForType = (type: ReportType) => {
  switch (type) {
    case "email_address":
      return [
        { key: "email", label: "Địa chỉ Email", width: "w-1/3" },
        { key: "sender", label: "Người gửi", width: "w-1/4" },
        { key: "reportCount", label: "Số báo cáo", width: "w-1/6" },
        {
          key: "latestReport",
          label: "Gần nhất",
          width: "w-1/4",
          hiddenMobile: true,
        },
      ];
    case "phone":
      return [
        { key: "phone", label: "Số điện thoại", width: "w-1/3" },
        { key: "type", label: "Loại", width: "w-1/4" },
        { key: "reportCount", label: "Số báo cáo", width: "w-1/6" },
        {
          key: "latestReport",
          label: "Gần nhất",
          width: "w-1/4",
          hiddenMobile: true,
        },
      ];
    case "website":
      return [
        { key: "url", label: "URL Website", width: "w-1/2" },
        { key: "reportCount", label: "Số báo cáo", width: "w-1/4" },
        {
          key: "latestReport",
          label: "Gần nhất",
          width: "w-1/4",
          hiddenMobile: true,
        },
      ];
    case "social":
      return [
        { key: "platform", label: "Nền tảng", width: "w-1/5" },
        { key: "username", label: "Tên người dùng", width: "w-1/4" },
        {
          key: "profileUrl",
          label: "Profile URL",
          width: "w-1/3",
          hiddenMobile: true,
        },
        { key: "reportCount", label: "Số báo cáo", width: "w-1/6" },
      ];
    case "bank_account":
      return [
        { key: "bankName", label: "Ngân hàng", width: "w-1/4" },
        { key: "accountNumber", label: "Số tài khoản", width: "w-1/4" },
        { key: "accountHolder", label: "Chủ tài khoản", width: "w-1/4" },
        { key: "reportCount", label: "Số báo cáo", width: "w-1/6" },
        {
          key: "latestReport",
          label: "Gần nhất",
          width: "w-1/6",
          hiddenMobile: true,
        },
      ];
    case "e_wallet":
      return [
        { key: "walletType", label: "Loại ví", width: "w-1/4" },
        { key: "walletId", label: "ID ví", width: "w-1/4" },
        { key: "accountHolder", label: "Chủ ví", width: "w-1/4" },
        { key: "reportCount", label: "Số báo cáo", width: "w-1/6" },
        {
          key: "latestReport",
          label: "Gần nhất",
          width: "w-1/6",
          hiddenMobile: true,
        },
      ];
    case "person_org":
      return [
        { key: "name", label: "Tên", width: "w-1/4" },
        { key: "role", label: "Vai trò", width: "w-1/5" },
        { key: "identification", label: "CMND/CCCD", width: "w-1/5" },
        { key: "reportCount", label: "Số báo cáo", width: "w-1/6" },
        {
          key: "latestReport",
          label: "Gần nhất",
          width: "w-1/6",
          hiddenMobile: true,
        },
      ];
    default:
      return [
        { key: "value", label: "Đối tượng", width: "w-1/2" },
        { key: "reportCount", label: "Số báo cáo", width: "w-1/4" },
        {
          key: "latestReport",
          label: "Gần nhất",
          width: "w-1/4",
          hiddenMobile: true,
        },
      ];
  }
};

// Render giá trị cell dựa trên key và data
const renderCellValue = (key: string, row: BlacklistItem, type: ReportType) => {
  switch (key) {
    case "email":
      return row.email_address?.email_address || row.value;
    case "sender":
      return row.email_address?.sender_address || "N/A";
    case "phone":
      return row.phone?.phone_number || row.value;
    case "url":
      const url = row.website?.url || row.value;
      return (
        <a
          href={url.startsWith("http") ? url : `http://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-600 truncate hover:underline"
        >
          {url}
        </a>
      );
    case "platform":
      return row.social?.platform || "N/A";
    case "username":
      return row.social?.username || row.value;
    case "profileUrl":
      const profileUrl = row.social?.profile_url || row.value;
      return (
        <a
          href={
            profileUrl.startsWith("http") ? profileUrl : `http://${profileUrl}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-600 truncate hover:underline"
        >
          {profileUrl}
        </a>
      );
    case "bankName":
      return row.bank_account?.bank_name || "N/A";
    case "accountNumber":
      return row.bank_account?.account_number || row.value;
    case "accountHolder":
      return row.bank_account?.account_holder_name || "N/A";
    case "walletType":
      return row.e_wallet?.wallet_type || "N/A";
    case "walletId":
      return row.e_wallet?.wallet_id || row.value;
    case "name":
      return row.person_org?.name || row.value;
    case "role":
      return row.person_org?.role || "N/A";
    case "identification":
      return row.person_org?.identification || "N/A";
    case "type":
      return typeLabels[row.type] || row.type.replace(/_/g, " ");
    case "reportCount":
      return (
        <span className="text-[#e53935] font-bold">{row.reportCount}</span>
      );
    case "latestReport":
      return row.latestReport
        ? new Date(row.latestReport).toLocaleDateString("vi-VN")
        : "";
    case "value":
    default:
      return row.value;
  }
  if (!type) return null;
};

export default function BlacklistTable({
  data,
  selectedType,
  pagination,
  onPageChange,
}: Props) {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const columns = getColumnsForType(selectedType);

  // Sử dụng pagination từ props nếu có, fallback về local pagination
  const currentPage = pagination?.page || page;
  const totalPages =
    pagination?.totalPages || Math.ceil(data.length / PAGE_SIZE);
  const pagedData = pagination
    ? data
    : data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page khi selectedType thay đổi
  useEffect(() => {
    if (!pagination) {
      setPage(1);
    }
  }, [selectedType, pagination]);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-xs text-center text-gray-600 bg-white border border-gray-200 shadow rounded-2xl md:text-sm">
        Không có dữ liệu cho loại này.
      </div>
    );
  }

  const navigateToDetail = (item: BlacklistItem) => {
    const url = `/lookup/${item.value}`;
    router.push(url);
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setPage(newPage);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto bg-white border border-gray-200 shadow rounded-2xl">
        <table className="min-w-full text-xs divide-y divide-gray-200 md:text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-[#fff8e1] to-[#ffe0b2]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-2 md:px-4 py-2 md:py-3 text-left font-bold text-[#e53935] ${
                    col.hiddenMobile ? "hidden md:table-cell" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.map((row, idx) => (
              <tr
                key={row.value || idx}
                className={`
                  ${idx % 2 === 0 ? "bg-white" : "bg-[#fffde7]"}
                  hover:bg-[#fbc02d]/10 transition cursor-pointer
                `}
                onClick={() => navigateToDetail(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-2 md:px-4 py-2 font-semibold text-gray-800 break-all ${
                      col.hiddenMobile ? "hidden md:table-cell" : ""
                    }`}
                  >
                    {renderCellValue(col.key, row, selectedType)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700 font-semibold hover:bg-[#fbc02d]/30 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span className="mx-2 text-gray-700">
            Trang {currentPage} / {totalPages}
            {pagination && (
              <span className="block text-xs text-gray-500">
                ({pagination.total} kết quả)
              </span>
            )}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700 font-semibold hover:bg-[#fbc02d]/30 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
