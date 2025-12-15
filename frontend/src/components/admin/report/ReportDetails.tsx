import { Report } from "@/models/ReportModel";
import { useState, useEffect } from "react";

interface Props {
  report: Report;
}

export default function DetailRenderer({ report }: Props) {
  const { report_type } = report;
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  // Keyboard support - ESC để đóng modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showImageModal) {
        setShowImageModal(false);
      }
    };

    if (showImageModal) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll khi modal mở
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showImageModal]);

  const Field = ({ label, value }: { label: string; value?: string }) => (
    <p className="text-sm text-gray-600">
      <span className="font-semibold">{label}:</span> {value || "-"}
    </p>
  );

  const handleViewEvidence = (evidenceUrl: string) => {
    setCurrentImage(evidenceUrl);
    setShowImageModal(true);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="mt-4 space-y-3">
      {/* Thông tin chung */}
      <Field label="ID" value={report.id.toString()} />
      <Field label="Tiêu đề" value={report.title} />
      <Field label="Mô tả" value={report.description} />

      {/* Bằng chứng với nút xem ảnh */}
      {report.evidence && (
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Bằng chứng:</span>{" "}
          <button
            onClick={() => handleViewEvidence(report.evidence!)}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 transition-colors rounded-md bg-blue-50 hover:bg-blue-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Xem bằng chứng
          </button>
        </div>
      )}

      <Field label="Địa chỉ IP" value={report.user_ip} />
      <Field label="Liên hệ" value={report.contact} />
      <Field
        label="Người gửi"
        value={report.user?.fullName || report.user?.email || "Ẩn danh"}
      />
      <Field label="Trạng thái" value={report.status} />
      <Field label="Ngày tạo" value={formatDate(report.created_at)} />
      <Field label="Cập nhật lúc" value={formatDate(report.updated_at)} />

      {/* Chi tiết theo loại báo cáo */}
      {(() => {
        switch (report_type) {
          case "email_address":
            return (
              <div className="space-y-2">
                <Field
                  label="Địa chỉ email bị lạm dụng"
                  value={report.email_address?.email_address}
                />
              </div>
            );

          case "person_org":
            return (
              <div className="space-y-2">
                <Field
                  label="Tên người / tổ chức"
                  value={report.person_org?.name}
                />
                <Field label="Vai trò" value={report.person_org?.role} />
                <Field
                  label="CMND/CCCD"
                  value={report.person_org?.identification}
                />
                <Field label="Địa chỉ" value={report.person_org?.address} />
                <Field
                  label="Số điện thoại"
                  value={report.person_org?.phone_number}
                />
                <Field label="Email" value={report.person_org?.email_address} />
                <Field
                  label="Liên kết MXH"
                  value={report.person_org?.social_links}
                />
              </div>
            );

          case "email_content":
            return (
              <div className="space-y-2">
                <Field
                  label="Tiêu đề email"
                  value={report.email_content?.email_subject}
                />
                <Field
                  label="Nội dung email"
                  value={report.email_content?.email_body}
                />
                <Field
                  label="Người gửi"
                  value={report.email_content?.sender_address}
                />
                <Field
                  label="Tệp đính kèm"
                  value={report.email_content?.attachments}
                />
                <Field
                  label="Liên kết nghi ngờ"
                  value={report.email_content?.suspicious_links}
                />
              </div>
            );

          case "phone":
            return (
              <div className="space-y-2">
                <Field
                  label="Số điện thoại"
                  value={report.phone?.phone_number}
                />
              </div>
            );

          case "sms":
            return (
              <div className="space-y-2">
                <Field label="Số điện thoại" value={report.sms?.phone_number} />
                <Field
                  label="Nội dung tin nhắn"
                  value={report.sms?.sms_content}
                />
              </div>
            );

          case "website":
            return (
              <div className="space-y-2">
                <Field label="Địa chỉ website" value={report.website?.url} />
              </div>
            );

          case "social":
            return (
              <div className="space-y-2">
                <Field label="Nền tảng" value={report.social?.platform} />
                <Field label="URL hồ sơ" value={report.social?.profile_url} />
                <Field label="Tên người dùng" value={report.social?.username} />
              </div>
            );

          case "bank_account":
            return (
              <div className="space-y-2">
                <Field
                  label="Ngân hàng"
                  value={report.bank_account?.bank_name}
                />
                <Field
                  label="Số tài khoản"
                  value={report.bank_account?.account_number}
                />
                <Field
                  label="Chủ tài khoản"
                  value={report.bank_account?.account_holder_name}
                />
              </div>
            );

          case "e_wallet":
            return (
              <div className="space-y-2">
                <Field label="Loại ví" value={report.e_wallet?.wallet_type} />
                <Field label="Mã ví" value={report.e_wallet?.wallet_id} />
                <Field
                  label="Chủ tài khoản"
                  value={report.e_wallet?.account_holder_name}
                />
              </div>
            );

          default:
            return (
              <p className="text-sm text-gray-500">
                Không có thông tin chi tiết phù hợp với loại báo cáo.
              </p>
            );
        }
      })()}

      {/* Modal hiển thị ảnh - Redesigned */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-200 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden duration-200 bg-white shadow-2xl rounded-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header với gradient */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Bằng chứng báo cáo
              </h3>

              {/* Nút đóng */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute p-2 text-white transition-all duration-200 rounded-lg top-3 right-3 hover:bg-white/20 hover:rotate-90"
                title="Đóng (ESC)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Container ảnh */}
            <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="bg-white rounded-xl shadow-inner overflow-hidden max-h-[70vh]">
                <div className="overflow-auto max-h-[70vh] flex items-center justify-center p-4">
                  <img
                    src={currentImage}
                    alt="Bằng chứng"
                    className="h-auto max-w-full rounded-lg shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3EKhông thể tải ảnh%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Footer với actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Mẹo:</span> Click bên ngoài hoặc
                  nhấn ESC để đóng
                </div>
                <div className="flex gap-3">
                  <a
                    href={currentImage}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Tải xuống
                  </a>
                  <a
                    href={currentImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Mở tab mới
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
