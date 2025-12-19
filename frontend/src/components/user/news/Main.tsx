"use client";
import { useEffect, useState } from "react";
import { FaNewspaper, FaClock, FaEye, FaUser } from "react-icons/fa";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  views: number;
  publishedAt: string;
  author?: {
    id: number;
    fullName: string;
  };
}

export default function NewsListComponent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  useEffect(() => {
    document.title = "Tin tức & Cảnh báo - Scam Report";
  }, []);

  useEffect(() => {
    fetchNews();
    fetchFeatured();
  }, [page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/published?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error("Không thể tải tin tức");
      }

      const result = await response.json();
      setNews(result.data || []);
      setTotal(result.total || 0);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/featured?limit=3`
      );

      if (response.ok) {
        const data = await response.json();
        setFeaturedNews(data || []);
      }
    } catch (error) {
      console.error("Error fetching featured news:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) {
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
    <div className="min-h-screen py-12 bg-linear-to-br from-orange-50 via-white to-red-50">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-linear-to-br from-[#e53935] to-[#ff6f00] rounded-2xl shadow-xl">
            <FaNewspaper className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-3 text-5xl font-bold bg-linear-to-r from-[#e53935] to-[#ff6f00] bg-clip-text text-transparent">
            Tin tức & Cảnh báo
          </h1>
          <p className="text-xl font-medium text-gray-700">
            Cập nhật thông tin và cảnh báo lừa đảo mới nhất
          </p>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-linear-to-r from-[#e53935] to-[#fbc02d] rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">
                🔥 Tin nổi bật
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {featuredNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/tin-tuc/${item.slug}`}
                  className="group overflow-hidden transition-all bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#e53935]"
                >
                  {item.imageUrl && (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-4 py-1.5 text-xs font-bold text-white bg-linear-to-r from-[#fbc02d] to-[#ff6f00] rounded-full shadow-lg">
                          ⭐ NỔI BẬT
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.summary && (
                      <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                        {item.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {new Date(item.publishedAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaEye className="w-3 h-3" />
                        {item.views}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All News */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-linear-to-r from-[#e53935] to-[#fbc02d] rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">Tất cả tin tức</h2>
          </div>
          {news.length === 0 ? (
            <div className="py-16 text-center bg-white shadow-lg rounded-2xl">
              <FaNewspaper className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-600">
                Chưa có tin tức nào
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/tin-tuc/${item.slug}`}
                    className="group overflow-hidden transition-all bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                  >
                    {item.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="object-cover w-full h-full transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.summary && (
                        <p className="mb-3 text-sm text-gray-600 line-clamp-3">
                          {item.summary}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          {new Date(item.publishedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaEye className="w-3 h-3" />
                          {item.views}
                        </div>
                      </div>
                      {item.author?.fullName && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <FaUser className="w-3 h-3" />
                          {item.author.fullName}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
