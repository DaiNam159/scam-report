"use client";
import React, { useState } from "react";
import { Send, Users } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="sticky p-6 bg-white border border-gray-100 shadow-lg rounded-3xl top-8">
      <h2 className="text-2xl font-bold text-[#e53935] mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-[#43a047]" />
        Liên hệ hỗ trợ
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Họ và tên
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] bg-white text-gray-800 font-medium transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] bg-white text-gray-800 font-medium transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Chủ đề
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] bg-white text-gray-800 font-medium transition-colors"
            required
          >
            <option value="">Chọn chủ đề</option>
            <option value="report">Báo cáo lừa đảo</option>
            <option value="account">Vấn đề tài khoản</option>
            <option value="technical">Hỗ trợ kỹ thuật</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-bold text-gray-700"
          >
            Nội dung
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] bg-white text-gray-800 font-medium resize-none transition-colors"
            placeholder="Mô tả chi tiết vấn đề của bạn..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#e53935] to-[#fbc02d] hover:from-[#b71c1c] hover:to-[#fbc02d] text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Send className="w-5 h-5" />
          <span>Gửi yêu cầu hỗ trợ</span>
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-[#fbc02d] rounded-2xl">
        <p className="text-sm font-medium text-gray-700">
          <b>Lưu ý:</b> Chúng tôi sẽ phản hồi trong vòng 24 giờ. Để được hỗ trợ
          nhanh hơn, hãy mô tả chi tiết vấn đề bạn gặp phải.
        </p>
      </div>
    </div>
  );
}
