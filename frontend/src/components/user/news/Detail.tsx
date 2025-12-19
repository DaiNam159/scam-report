"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaClock, FaEye, FaUser, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  views: number;
  publishedAt: string;
  author?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export default function NewsDetailComponent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchNews();
    }
  }, [slug]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/slug/${slug}`
      );

      if (!response.ok) {
        throw new Error("Không thể tải tin tức");
      }

      const data = await response.json();
      setNews(data);

      // Set document title
      if (data.title) {
        document.title = `${data.title} - Scam Report`;
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      router.push("/tin-tuc");
    } finally {
      setLoading(false);
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

  if (!news) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 bg-linear-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-4xl px-4 mx-auto">
        {/* Back Button */}
        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 text-[#e53935] transition-all hover:bg-red-50 rounded-xl font-semibold"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách tin tức</span>
        </Link>

        {/* Article */}
        <article className="overflow-hidden bg-white border-2 border-gray-100 shadow-xl rounded-2xl">
          {/* Featured Image */}
          {news.imageUrl && (
            <div className="relative h-112">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="p-10">
            {/* Title */}
            <h1 className="mb-6 text-5xl font-bold bg-linear-to-r from-[#e53935] to-[#ff6f00] bg-clip-text text-transparent leading-tight">
              {news.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 text-sm text-gray-600 border-b">
              {news.author?.fullName && (
                <div className="flex items-center gap-2">
                  <FaUser className="w-4 h-4" />
                  <span>{news.author.fullName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                <span>
                  {new Date(news.publishedAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaEye className="w-4 h-4" />
                <span>{news.views} lượt xem</span>
              </div>
            </div>

            {/* Summary */}
            {news.summary && (
              <div className="p-4 mb-6 border-l-4 border-blue-500 rounded bg-blue-50">
                <p className="text-lg italic text-gray-700">{news.summary}</p>
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-a:text-blue-600 prose-img:rounded-lg prose-img:shadow-lg prose-strong:text-gray-900 prose-li:text-gray-900"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        </article>

        {/* Related or CTA */}
        <div className="p-8 mt-12 text-center bg-linear-to-r from-[#e53935] to-[#ff6f00] rounded-2xl shadow-2xl">
          <h3 className="mb-3 text-2xl font-bold text-white">
            🚨 Cần báo cáo lừa đảo?
          </h3>
          <p className="mb-6 text-lg text-white/90">
            Nếu bạn gặp phải tình huống lừa đảo, hãy báo cáo ngay để bảo vệ cộng
            đồng
          </p>
          <Link
            href="/bao-cao"
            className="inline-block px-8 py-4 text-[#e53935] font-bold transition-all bg-white rounded-xl hover:bg-gray-50 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Tạo báo cáo ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
