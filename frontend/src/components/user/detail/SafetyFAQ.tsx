import { HelpCircle, Shield, AlertTriangle, Info } from "lucide-react";

export default function SafetyFAQ() {
  const faqs = [
    {
      question: "Tại sao đối tượng này bị đưa vào danh sách đen?",
      answer:
        "Đối tượng này đã nhận được nhiều báo cáo từ người dùng về các hành vi lừa đảo, gian lận hoặc các hoạt động đáng ngờ khác.",
      icon: <HelpCircle className="w-5 h-5 text-blue-600" />,
    },
    {
      question: "Tôi nên làm gì nếu nhận được tin nhắn từ đối tượng này?",
      answer:
        "Không phản hồi, không cung cấp thông tin cá nhân hoặc chuyển tiền. Hãy báo cáo ngay cho cơ quan chức năng và chặn liên lạc.",
      icon: <Shield className="w-5 h-5 text-green-600" />,
    },
    {
      question: "Cách nhận biết email/tin nhắn lừa đảo?",
      answer:
        "Kiểm tra địa chỉ người gửi, lỗi chính tả, yêu cầu cấp bách, link đáng ngờ, và không bao giờ cung cấp thông tin nhạy cảm qua email/tin nhắn.",
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
    },
    {
      question: "Tôi có thể làm gì để bảo vệ bản thân?",
      answer:
        "Luôn xác minh thông tin trước khi giao dịch, không chia sẻ thông tin cá nhân, sử dụng xác thực 2 yếu tố, và cập nhật kiến thức về các thủ đoạn lừa đảo mới.",
      icon: <Info className="w-5 h-5 text-purple-600" />,
    },
  ];

  return (
    <div className="p-5 mb-5 bg-white/80 backdrop-blur-sm border border-white/50 shadow-md rounded-xl">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-blue-600" />
        Câu hỏi thường gặp
      </h3>
      <div className="space-y-2.5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-200"
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">{faq.icon}</div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-0.5">
                  {faq.question}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg">
        <p className="text-xs text-gray-700">
          <strong className="text-red-700">Lưu ý:</strong> Nếu bạn đã bị lừa
          đảo, hãy liên hệ ngay với cơ quan công an địa phương để được hỗ trợ.
        </p>
      </div>
    </div>
  );
}
