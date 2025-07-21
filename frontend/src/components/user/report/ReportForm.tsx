import { ReportService } from "@/services/ReportService";
import { ReportType } from "@/types/ReportType";
import { ReportFormProps } from "@/types/ReportType";
import React, { useState } from "react";

// Configuration for type-specific fields
const typeConfig: Record<
  ReportType,
  {
    titleLabel: string;
    fields: {
      label: string;
      name: string;
      type: string;
      placeholder: string;
      required?: boolean;
    }[];
  }
> = {
  email_address: {
    titleLabel: "Địa chỉ email",
    fields: [
      {
        label: "Địa chỉ email nghi ngờ",
        name: "emailAddress",
        type: "email",
        placeholder: "ví dụ: scammer@example.com",
        required: true,
      },
    ],
  },
  person_org: {
    titleLabel: "Người / Tổ chức",
    fields: [
      {
        label: "Tên người / tổ chức",
        name: "name",
        type: "text",
        placeholder: "ví dụ: Nguyễn Văn A",
        required: true,
      },
      {
        label: "Vai trò",
        name: "role",
        type: "text",
        placeholder: "ví dụ: Giám đốc, Nhân viên",
      },
      {
        label: "Thông tin định danh",
        name: "identification",
        type: "text",
        placeholder: "ví dụ: CMND, Mã số thuế",
      },
      {
        label: "Địa chỉ",
        name: "address",
        type: "text",
        placeholder: "ví dụ: 331 QL1A, Phường An Phú Đông, Quận 12, TP.HCM",
        required: false,
      },
      {
        label: "Số điện thoại",
        name: "phoneNumber",
        type: "tel",
        placeholder: "ví dụ: 0912345678",
        required: false,
      },
      {
        label: "Địa chỉ email",
        name: "emailAddress",
        type: "email",
        placeholder: "ví dụ: scam@example.com",
        required: false,
      },
      {
        label: "Link mạng xã hội",
        name: "socialLinks",
        type: "url",
        placeholder: "ví dụ: https://facebook.com/scam123",
      },
    ],
  },
  email_content: {
    titleLabel: "Nội dung email",
    fields: [
      {
        label: "Tiêu đề email",
        name: "emailSubject",
        type: "text",
        placeholder: "Nhập tiêu đề email",
        required: true,
      },
      {
        label: "Nội dung email",
        name: "emailBody",
        type: "text",
        placeholder: "Nhập nội dung email",
        required: true,
      },
      {
        label: "Địa chỉ người gửi",
        name: "senderAddress",
        type: "email",
        placeholder: "ví dụ: scam@example.com",
        required: true,
      },
      {
        label: "Link đáng ngờ",
        name: "suspiciousLinks",
        type: "url",
        placeholder: "ví dụ: http://scam.com",
      },
      {
        label: "Tệp đính kèm",
        name: "attachments",
        type: "url",
        placeholder: "Link Google Drive, imgur...",
      },
    ],
  },
  phone: {
    titleLabel: "Số điện thoại",
    fields: [
      {
        label: "Số điện thoại nghi ngờ",
        name: "phoneNumber",
        type: "tel",
        placeholder: "ví dụ: 0987654321",
        required: true,
      },
    ],
  },
  sms: {
    titleLabel: "Tin nhắn SMS",
    fields: [
      {
        label: "Số điện thoại gửi",
        name: "phoneNumber",
        type: "tel",
        placeholder: "ví dụ: 0912345678",
        required: true,
      },
      {
        label: "Nội dung tin nhắn",
        name: "smsContent",
        type: "text",
        placeholder: "Nhập nội dung tin nhắn",
        required: true,
      },
    ],
  },
  website: {
    titleLabel: "Trang web",
    fields: [
      {
        label: "Địa chỉ trang web",
        name: "websiteUrl",
        type: "url",
        placeholder: "ví dụ: http://scam.com",
        required: true,
      },
    ],
  },
  social: {
    titleLabel: "Trang mạng xã hội",
    fields: [
      {
        label: "Nền tảng",
        name: "platform",
        type: "text",
        placeholder: "ví dụ: Facebook, Twitter",
        required: true,
      },
      {
        label: "Link trang cá nhân",
        name: "profileUrl",
        type: "url",
        placeholder: "ví dụ: https://facebook.com/scam123",
        required: true,
      },
      {
        label: "Tên người dùng",
        name: "username",
        type: "text",
        placeholder: "ví dụ: scam123",
      },
    ],
  },
  bank_account: {
    titleLabel: "Tài khoản ngân hàng",
    fields: [
      {
        label: "Tên ngân hàng",
        name: "bankName",
        type: "text",
        placeholder: "ví dụ: Vietcombank",
        required: true,
      },
      {
        label: "Số tài khoản",
        name: "accountNumber",
        type: "text",
        placeholder: "ví dụ: 123456789",
        required: true,
      },
      {
        label: "Tên chủ tài khoản",
        name: "accountHolderName",
        type: "text",
        placeholder: "ví dụ: Nguyễn Văn A",
      },
    ],
  },
  e_wallet: {
    titleLabel: "Ví điện tử",
    fields: [
      {
        label: "Loại ví",
        name: "walletType",
        type: "text",
        placeholder: "ví dụ: ZaloPay, Momo",
        required: true,
      },
      {
        label: "ID ví / SĐT ví",
        name: "walletId",
        type: "text",
        placeholder: "ví dụ: 0987654321",
        required: true,
      },
      {
        label: "Tên chủ ví",
        name: "accountHolderName",
        type: "text",
        placeholder: "ví dụ: Nguyễn Văn A",
      },
    ],
  },
};
const initialFormState = (type: ReportType) => ({
  reportType: type,
  title: "",
  description: "",
  evidence: "",
  emailAddress: "",
  name: "",
  role: "",
  identification: "",
  address: "",
  socialLinks: "",
  emailSubject: "",
  emailBody: "",
  senderAddress: "",
  attachments: "",
  suspiciousLinks: "",
  phoneNumber: "",
  smsContent: "",
  websiteUrl: "",
  platform: "",
  profileUrl: "",
  username: "",
  bankName: "",
  accountNumber: "",
  accountHolderName: "",
  walletType: "",
  walletId: "",
  contact: "",
});
const ReportForm: React.FC<ReportFormProps> = ({ type }) => {
  const config = typeConfig[type];
  const [formData, setFormData] = useState(initialFormState(type));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalData = { ...formData, reportType: type };
      const res = await ReportService.submitReport(finalData);
      setFormData(initialFormState(type));
    } catch (err) {
      console.log("Lỗi khi gửi form: ", err);
      throw err;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl p-6 mx-auto space-y-4 bg-white border border-gray-100 shadow-lg rounded-3xl"
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-[#e53935] tracking-tight drop-shadow">
        Báo cáo: <span className="text-black">{config.titleLabel}</span>
      </h2>

      {/* Basic Report Information */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">
          Thông tin cơ bản
        </h3>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Tiêu đề
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
            placeholder="Nhập tiêu đề ngắn gọn"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
            placeholder="Mô tả chi tiết vụ việc, diễn biến, số tiền, thời gian, v.v..."
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Thông tin liên hệ (nếu muốn phản hồi)
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Email hoặc số điện thoại"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
          />
        </div>
      </div>

      {/* Detailed Report Information */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">
          Chi tiết báo cáo
        </h3>
        {config.fields.map((field) => (
          <div key={field.name}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.name === "emailBody" || field.name === "smsContent" ? (
              <textarea
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                required={field.required}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
              />
            )}
          </div>
        ))}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Bằng chứng
          </label>
          <input
            type="url"
            name="evidence"
            value={formData.evidence}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e53935] bg-white text-black"
            placeholder="Link Google Drive, imgur, YouTube..."
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 font-semibold text-base rounded-xl bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white shadow hover:from-[#b71c1c] hover:to-[#fbc02d] transition"
      >
        Gửi báo cáo
      </button>
    </form>
  );
};

export default ReportForm;
