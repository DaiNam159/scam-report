"use client";
import { useEffect, useState } from "react";
import {
  FaNewspaper,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  views: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author?: {
    id: number;
    email: string;
    fullName: string;
  };
}

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");

  useEffect(() => {
    fetchNews();
  }, [filter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const url =
        filter === "ALL"
          ? `${process.env.NEXT_PUBLIC_API_URL}/news?limit=100`
          : `${process.env.NEXT_PUBLIC_API_URL}/news?status=${filter}&limit=100`;

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách tin tức");
      }

      const result = await response.json();
      setNews(result.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa tin tức này?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa tin tức");
      }

      toast.success("Đã xóa tin tức thành công");
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Không thể xóa tin tức");
    }
  };

  const toggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isFeatured: !currentStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật");
      }

      toast.success(
        !currentStatus ? "Đã đánh dấu nổi bật" : "Đã bỏ đánh dấu nổi bật"
      );
      fetchNews();
    } catch (error) {
      console.error("Error updating featured:", error);
      toast.error("Không thể cập nhật");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
            Đã xuất bản
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
            Bản nháp
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
            Lưu trữ
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-solid rounded-full border-r-transparent animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 shadow-lg bg-linear-to-br from-indigo-500 to-blue-600 rounded-xl">
              <FaNewspaper className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý tin tức
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Tạo và quản lý các bài viết tin tức
              </p>
            </div>
          </div>
          <Link
            href="/admin/tin-tuc/tao-moi"
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all shadow-lg bg-linear-to-r from-indigo-600 to-blue-600 rounded-xl hover:shadow-xl hover:from-indigo-700 hover:to-blue-700"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tạo tin tức mới</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md ${
              filter === "ALL"
                ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg"
            }`}
          >
            Tất cả ({news.length})
          </button>
          <button
            onClick={() => setFilter("PUBLISHED")}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md ${
              filter === "PUBLISHED"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Đã xuất bản
          </button>
          <button
            onClick={() => setFilter("DRAFT")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "DRAFT"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Bản nháp
          </button>
        </div>

        {/* Table */}
        {news.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg shadow-sm">
            <FaNewspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">Chưa có tin tức nào</p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      Tác giả
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      Lượt xem
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="object-cover w-16 h-16 rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-gray-900">
                                {item.title}
                              </div>
                              {item.isFeatured && (
                                <FaStar className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            {item.summary && (
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {item.summary}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item.author?.fullName || item.author?.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FaEye className="w-4 h-4" />
                          {item.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              toggleFeatured(item.id, item.isFeatured)
                            }
                            className="p-2 text-yellow-600 transition-colors rounded-lg hover:bg-yellow-50"
                            title={
                              item.isFeatured
                                ? "Bỏ nổi bật"
                                : "Đánh dấu nổi bật"
                            }
                          >
                            {item.isFeatured ? (
                              <FaStar className="w-4 h-4" />
                            ) : (
                              <FaRegStar className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            href={`/admin/tin-tuc/${item.id}`}
                            className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                            title="Chỉnh sửa"
                          >
                            <FaEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            title="Xóa"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
