import { Report } from "@/models/ReportModel";
import { ReportStatus, ReportType } from "@/types/ReportType";

interface Props {
  report: Report;
}

export default function DetailRenderer({ report }: Props) {
  const { report_type } = report;

  const Field = ({ label, value }: { label: string; value?: string }) => (
    <p className="text-sm text-gray-600">
      <span className="font-semibold">{label}:</span> {value || "-"}
    </p>
  );

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
      <Field label="Bằng chứng" value={report.evidence} />
      <Field label="Địa chỉ IP" value={report.user_ip} />
      <Field label="Liên hệ" value={report.contact} />
      <Field
        label="Người gửi"
        value={report.user.fullName || report.user.email}
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
    </div>
  );
}
