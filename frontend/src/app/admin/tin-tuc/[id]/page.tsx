"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaImage } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";
import dynamic from "next/dynamic";
import TipTapEditor from "../../../../components/TipTapEditor";

export default function NewsEditorPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = params?.id && params.id !== "tao-moi";
  const newsId = isEdit ? Number(params.id) : null;

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit && newsId) {
      fetchNews();
    }
  }, [newsId]);

  const fetchNews = async () => {
    try {
      setLoadingData(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/${newsId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải tin tức");
      }

      const data = await response.json();
      setFormData({
        title: data.title,
        summary: data.summary || "",
        content: data.content,
        imageUrl: data.imageUrl || "",
        status: data.status,
        isFeatured: data.isFeatured,
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Không thể tải tin tức");
      router.push("/admin/tin-tuc");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Vui lòng điền đầy đủ tiêu đề và nội dung");
      return;
    }

    try {
      setLoading(true);
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/news/${newsId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/news`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Không thể lưu tin tức");
      }

      toast.success(isEdit ? "Đã cập nhật tin tức" : "Đã tạo tin tức mới");
      router.push("/admin/tin-tuc");
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error("Không thể lưu tin tức");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/tin-tuc"
            className="p-3 transition-all bg-white border border-gray-200 shadow-md rounded-xl hover:bg-indigo-50 hover:shadow-lg"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text">
              {isEdit ? "Chỉnh sửa tin tức" : "Tạo tin tức mới"}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isEdit ? "Cập nhật thông tin tin tức" : "Thêm bài viết mới"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl"
        >
          <div className="space-y-8">
            {/* Title */}
            <div>
              <label className="block mb-3 text-sm font-bold text-gray-800">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-5 py-4 text-lg font-semibold text-gray-900 placeholder-gray-400 transition-all border-2 border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                placeholder="Nhập tiêu đề bài viết..."
                required
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-800">
                <FaImage className="text-blue-600" />
                Hình ảnh đại diện
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-5 py-4 text-gray-900 placeholder-gray-400 transition-all border-2 border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-4">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="object-cover w-full border-4 border-blue-100 shadow-lg max-h-96 rounded-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Summary */}
            <div>
              <label className="block mb-3 text-sm font-bold text-gray-800">
                Tóm tắt
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                rows={3}
                className="w-full px-5 py-4 text-gray-900 placeholder-gray-400 transition-all border-2 border-gray-200 resize-none bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                placeholder="Tóm tắt ngắn gọn về bài viết..."
              />
            </div>

            {/* Content with TipTap Editor */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-800">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <TipTapEditor
                content={formData.content}
                onChange={(content: string) =>
                  setFormData({ ...formData, content })
                }
                placeholder="Viết nội dung bài viết... (Click vào nút 🖼️ để thêm ảnh)"
              />
              <p className="mt-2 text-xs text-gray-500">
                💡 Click vào nút <FaImage className="inline" /> để upload ảnh từ
                máy tính. Ảnh sẽ được lưu trên Cloudinary.
              </p>
            </div>

            {/* Status and Featured */}
            <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
              <div>
                <label className="block mb-3 text-sm font-bold text-gray-800">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full px-5 py-4 font-semibold text-gray-900 transition-all border-2 border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                >
                  <option value="DRAFT">📝 Bản nháp</option>
                  <option value="PUBLISHED">✅ Xuất bản</option>
                  <option value="ARCHIVED">📦 Lưu trữ</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="flex items-center w-full gap-3 p-5 border-2 border-yellow-200 bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-6 h-6 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="text-sm font-bold text-gray-800 cursor-pointer"
                  >
                    ⭐ Nổi bật
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-8 border-t-2 border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-3 px-10 py-4 text-lg font-bold text-white transition-all shadow-lg bg-linear-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="w-5 h-5" />
                {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
              </button>
              <Link
                href="/admin/tin-tuc"
                className="px-10 py-4 text-lg font-bold text-gray-700 transition-all bg-white border-2 border-gray-300 shadow-md rounded-xl hover:bg-gray-50 hover:shadow-lg"
              >
                Hủy
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
