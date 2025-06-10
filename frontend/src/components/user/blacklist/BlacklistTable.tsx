import { useState } from "react";
import { BlacklistItem } from "@/types/BlacklistType";
import { Inspect, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface Props {
  data: BlacklistItem[];
}

const PAGE_SIZE = 10;

export default function BlacklistTable({ data }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const router = useRouter();
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600 bg-white border border-gray-200 shadow rounded-2xl">
        Không có dữ liệu cho loại này.
      </div>
    );
  }

  const navigateToDetail = (item: BlacklistItem) => {
    const url = `/lookup/${item.value}`;
    router.push(url);
  };
  return (
    <div>
      <div className="overflow-x-auto bg-white border border-gray-200 shadow rounded-2xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-[#fff8e1] to-[#ffe0b2]">
              <th className="px-4 py-3 text-left font-bold text-[#e53935]">
                STT
              </th>
              <th className="px-4 py-3 text-left font-bold text-[#e53935]">
                Đối tượng
              </th>
              <th className="px-4 py-3 text-left font-bold text-[#e53935]">
                Loại
              </th>
              <th className="px-4 py-3 text-left font-bold text-[#e53935]">
                Số lần báo cáo
              </th>
              <th className="px-4 py-3 text-left font-bold text-[#e53935]">
                Gần nhất
              </th>
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
                <td className="px-4 py-2">
                  {(page - 1) * PAGE_SIZE + idx + 1}
                </td>
                <td className="px-4 py-2 font-semibold text-gray-800">
                  {row.value}
                </td>
                <td className="px-4 py-2 capitalize text-[#e53935] font-semibold">
                  {row.type.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-2 text-[#e53935] font-bold">
                  {row.reportCount}
                </td>
                <td className="px-4 py-2 text-gray-500">{row.latestReport}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700 font-semibold hover:bg-[#fbc02d]/30 disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Trước
          </button>
          <span className="mx-2 text-gray-700">
            Trang {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700 font-semibold hover:bg-[#fbc02d]/30 disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
