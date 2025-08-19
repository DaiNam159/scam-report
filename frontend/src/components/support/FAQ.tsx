"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "Làm thế nào để báo cáo một vụ lừa đảo?",
    answer:
      'Bạn có thể báo cáo lừa đảo bằng cách truy cập trang "Báo cáo" và điền đầy đủ thông tin về vụ việc. Chúng tôi sẽ xem xét và xử lý báo cáo của bạn trong thời gian sớm nhất.',
  },
  {
    question: "Thông tin của tôi có được bảo mật không?",
    answer:
      "Chúng tôi cam kết bảo mật thông tin cá nhân của bạn theo các tiêu chuẩn bảo mật cao nhất. Thông tin chỉ được sử dụng cho mục đích xử lý báo cáo và không được chia sẻ với bên thứ ba.",
  },
  {
    question: "Mất bao lâu để xử lý một báo cáo?",
    answer:
      "Thời gian xử lý báo cáo thường từ 1-3 ngày làm việc tùy thuộc vào độ phức tạp của vụ việc. Chúng tôi sẽ thông báo cho bạn qua email về tình trạng xử lý.",
  },
  {
    question: "Tôi có thể theo dõi tình trạng báo cáo như thế nào?",
    answer:
      'Sau khi gửi báo cáo, bạn sẽ nhận được mã số theo dõi. Bạn có thể sử dụng mã này để kiểm tra tình trạng báo cáo trong trang "Theo dõi báo cáo".',
  },
];

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-3xl p-6">
      <h2 className="text-2xl font-bold text-[#e53935] mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-[#fbc02d]" />
        Câu hỏi thường gặp
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-2xl overflow-hidden shadow"
          >
            <button
              className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
              onClick={() => toggleExpanded(index)}
            >
              <span className="font-bold text-gray-800 text-base">
                {faq.question}
              </span>
              {expandedIndex === index ? (
                <ChevronUp className="w-5 h-5 text-[#e53935] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#e53935] flex-shrink-0" />
              )}
            </button>
            {expandedIndex === index && (
              <div className="px-5 pb-4 text-gray-700 font-medium bg-gray-50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
