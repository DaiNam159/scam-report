import { ReportFormProps, ReportType } from "@/types/ReportType";
import React, { useState } from "react";

// Đảm bảo typeConfig có đủ key cho tất cả giá trị của ReportType
const typeConfig: Record<
  ReportType,
  {
    titleLabel: string;
    targetLabel: string;
    targetPlaceholder: string;
    targetType: string;
    contentLabel: string;
    evidenceLabel: string;
  }
> = {
  email_content: {
    titleLabel: "Nội dung email",
    targetLabel: "Email gửi đến / gửi đi",
    targetPlaceholder: "ví dụ: example@gmail.com",
    targetType: "email",
    contentLabel: "Nội dung email",
    evidenceLabel: "Link bằng chứng (ảnh, video...)",
  },
  email_address: {
    titleLabel: "Địa chỉ email",
    targetLabel: "Địa chỉ email nghi ngờ",
    targetPlaceholder: "ví dụ: scammer@example.com",
    targetType: "email",
    contentLabel: "Mô tả hành vi nghi ngờ",
    evidenceLabel: "Link bằng chứng (ảnh, video...)",
  },
  sms: {
    titleLabel: "Tin nhắn SMS",
    targetLabel: "Số điện thoại gửi tin nhắn",
    targetPlaceholder: "ví dụ: 0912345678",
    targetType: "tel",
    contentLabel: "Nội dung tin nhắn",
    evidenceLabel: "Ảnh chụp tin nhắn / video",
  },
  phone_number: {
    titleLabel: "Số điện thoại",
    targetLabel: "Số điện thoại nghi ngờ",
    targetPlaceholder: "ví dụ: 0987654321",
    targetType: "tel",
    contentLabel: "Mô tả cuộc gọi / hành vi",
    evidenceLabel: "Bằng chứng (ghi âm, ảnh...)",
  },
  person: {
    titleLabel: "Tên người / tổ chức",
    targetLabel: "Tên người / tổ chức bị tố cáo",
    targetPlaceholder: "ví dụ: Nguyễn Văn A",
    targetType: "text",
    contentLabel: "Hành vi lừa đảo / mô tả chi tiết",
    evidenceLabel: "Bằng chứng liên quan",
  },
  website: {
    titleLabel: "Địa chỉ trang web",
    targetLabel: "Địa chỉ trang web",
    targetPlaceholder: "ví dụ: http://example.com",
    targetType: "url",
    contentLabel: "Mô tả hành vi giả mạo",
    evidenceLabel: "Ảnh / video ghi lại",
  },
  social_profile: {
    titleLabel: "Trang mạng xã hội",
    targetLabel: "Link trang cá nhân",
    targetPlaceholder: "ví dụ: https://facebook.com/abc123",
    targetType: "url",
    contentLabel: "Mô tả hành vi vi phạm",
    evidenceLabel: "Ảnh chụp đoạn chat / bằng chứng khác",
  },
  bank_account: {
    titleLabel: "Số tài khoản ngân hàng",
    targetLabel: "Số tài khoản ngân hàng",
    targetPlaceholder: "ví dụ: 123456789",
    targetType: "text",
    contentLabel: "Mô tả hành vi lừa đảo liên quan tài khoản ngân hàng",
    evidenceLabel: "Bằng chứng chuyển khoản, ảnh, video...",
  },
  e_wallet: {
    titleLabel: "Ví điện tử",
    targetLabel: "Ví điện tử/SĐT ví",
    targetPlaceholder: "ví dụ: ZaloPay: 0987654321",
    targetType: "text",
    contentLabel: "Mô tả hành vi lừa đảo liên quan ví điện tử",
    evidenceLabel: "Bằng chứng chuyển tiền, ảnh, video...",
  },
};

const ReportForm: React.FC<ReportFormProps> = ({ type }) => {
  const config = typeConfig[type];
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    content: "",
    evidenceUrl: "",
    contact: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dữ liệu gửi:", formData);
    // Gửi formData tới server...
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl p-8 mx-auto space-y-6 bg-white border border-gray-100 shadow-lg rounded-3xl"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-[#e53935] tracking-tight drop-shadow">
        Báo cáo: <span className="text-black">{config.titleLabel}</span>
      </h2>

      <div>
        <label className="block mb-1 font-bold text-gray-700">Tiêu đề</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
          placeholder="Nhập tiêu đề ngắn gọn"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          {config.targetLabel}
        </label>
        <input
          type={config.targetType}
          name="target"
          value={formData.target}
          onChange={handleChange}
          placeholder={config.targetPlaceholder}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          {config.contentLabel}
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
          placeholder="Mô tả chi tiết vụ việc, diễn biến, số tiền, thời gian, v.v..."
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          {config.evidenceLabel}
        </label>
        <input
          type="url"
          name="evidenceUrl"
          value={formData.evidenceUrl}
          onChange={handleChange}
          placeholder="Link Google Drive, imgur, YouTube..."
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Thông tin liên hệ (nếu muốn phản hồi)
        </label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Email hoặc số điện thoại"
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 font-bold text-lg rounded-xl bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white shadow hover:from-[#b71c1c] hover:to-[#fbc02d] transition"
      >
        Gửi báo cáo
      </button>
    </form>
  );
};

export default ReportForm;
