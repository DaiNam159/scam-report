// import { ShieldAlert, CheckCircle2, Loader2, Info } from "lucide-react";

// interface LookupResultProps {
//   loading: boolean;
//   result: any;
// }

// const LookupResult = ({ loading, result }: LookupResultProps) => {
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-10">
//         <Loader2 className="animate-spin w-8 h-8 text-[#e53935] mr-2" />
//         <span className="text-lg text-[#e53935] font-semibold">
//           Đang tra cứu...
//         </span>
//       </div>
//     );
//   }

//   if (!result) return null;

//   if (result.found === false) {
//     return (
//       <div className="flex flex-col items-center p-8 text-center bg-white border border-gray-200 shadow rounded-2xl">
//         <CheckCircle2 className="w-12 h-12 text-[#388e3c] mb-2" />
//         <div className="text-xl font-bold text-[#388e3c] mb-2">
//           Không phát hiện dấu hiệu lừa đảo!
//         </div>
//         <div className="mb-2 text-gray-700">
//           Đối tượng bạn tra cứu chưa có trong hệ thống cảnh báo.
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <Info className="w-4 h-4" />
//           <span>
//             Hãy luôn cảnh giác khi giao dịch, không cung cấp mã OTP, mật khẩu,
//             hoặc chuyển tiền cho đối tượng chưa xác thực.
//           </span>
//         </div>
//       </div>
//     );
//   }

//   // Nếu có kết quả lừa đảo
//   return (
//     <div className="bg-white border border-[#e53935] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
//       <ShieldAlert className="w-14 h-14 text-[#e53935] mb-2 animate-pulse" />
//       <div className="text-2xl font-extrabold text-[#e53935] mb-2">
//         Cảnh báo: Đã phát hiện lừa đảo!
//       </div>
//       {result.type && (
//         <span className="inline-block bg-[#fbc02d] text-[#b71c1c] font-semibold px-4 py-1 rounded-full mb-2 text-sm">
//           {result.type}
//         </span>
//       )}
//       <div className="mb-2 font-semibold text-gray-800">
//         {result.detail || "Đối tượng này đã bị báo cáo lừa đảo trên hệ thống."}
//       </div>
//       {result.count && (
//         <div className="mb-2 text-base text-gray-600">
//           Số lần bị báo cáo:{" "}
//           <span className="font-bold text-[#e53935]">{result.count}</span>
//         </div>
//       )}
//       {result.lastReport && (
//         <div className="mb-2 text-sm text-gray-500">
//           Báo cáo gần nhất: {result.lastReport}
//         </div>
//       )}
//       <div className="mt-4">
//         <a
//           href="/report"
//           className="inline-block bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white font-semibold px-6 py-2 rounded-xl shadow hover:from-[#b71c1c] hover:to-[#fbc02d] transition"
//         >
//           Báo cáo thêm hoặc xem chi tiết
//         </a>
//       </div>
//     </div>
//   );
// };

// export default LookupResult;

import {
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Info,
  Calendar,
  User,
  Mail,
  Phone,
  Globe,
  Users,
  CreditCard,
  Wallet,
  MessageSquare,
  MessageSquareText,
  Hourglass,
} from "lucide-react";

interface LookupResultProps {
  loading: boolean;
  result: any;
}

const getReportTypeIcon = (type: string) => {
  switch (type) {
    case "email_content":
    case "email_address":
      return <Mail className="w-4 h-4 text-[#b71c1c]" />;
    case "phone":
      return <Phone className="w-4 h-4 text-[#b71c1c]" />;
    case "website":
      return <Globe className="w-4 h-4 text-[#b71c1c]" />;
    case "social":
      return <Users className="w-4 h-4 text-[#b71c1c]" />;
    case "bank_account":
      return <CreditCard className="w-4 h-4 text-[#b71c1c]" />;
    case "e_wallet":
      return <Wallet className="w-4 h-4 text-[#b71c1c]" />;
    case "person_org":
      return <User className="w-4 h-4 text-[#b71c1c]" />;
    case "sms":
      return <MessageSquareText className="w-4 h-4 text-[#b71c1c]" />;
    default:
      return <Info className="w-4 h-4 text-[#b71c1c]" />;
  }
};

const getReportTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    email_content: "Email lừa đảo",
    email_address: "Địa chỉ email",
    phone: "Số điện thoại",
    website: "Website",
    social: "Mạng xã hội",
    bank_account: "Tài khoản ngân hàng",
    e_wallet: "Ví điện tử",
    person_org: "Cá nhân/Tổ chức",
    sms: "Tin nhắn SMS",
  };
  return typeNames[type] || "Khác";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getReportDetails = (report: any) => {
  const type = report.report_type;

  switch (type) {
    case "email_content":
      return report.email_content ? (
        <div className="mt-2 text-xs text-gray-600">
          <div>
            <strong>Chủ đề:</strong> {report.email_content.email_subject}
          </div>
          <div>
            <strong>Người gửi:</strong> {report.email_content.sender_address}
          </div>
          {report.email_content.email_body && (
            <div>
              <strong>Nội dung:</strong>{" "}
              {report.email_content.email_body.substring(0, 100)}...
            </div>
          )}
        </div>
      ) : null;
    case "email_address":
      return report.email_address ? (
        <div className="mt-2 text-xs text-gray-600">
          <div>
            <strong>Địa chỉ email:</strong> {report.email_address.email_address}
          </div>
        </div>
      ) : null;
    case "phone":
      return report.phone ? (
        <div className="mt-2 text-xs text-gray-600">
          <div>
            <strong>Số điện thoại:</strong> {report.phone.phone_number}
          </div>
        </div>
      ) : null;

    case "website":
      return report.website ? (
        <div className="mt-2 text-xs text-gray-600">
          <div>
            <strong>URL:</strong> {report.website.url}
          </div>
        </div>
      ) : null;

    case "social":
      return report.social ? (
        <div className="mt-2 text-xs text-gray-600">
          <div>
            <strong>Nền tảng:</strong> {report.social.platform}
          </div>
          <div>
            <strong>Username:</strong> {report.social.username}
          </div>
        </div>
      ) : null;

    case "bank_account":
      return report.bank_account ? (
        <div className="mt-2 text-xs text-gray-600">
          <div>
            <strong>Ngân hàng:</strong> {report.bank_account.bank_name}
          </div>
          <div>
            <strong>Chủ tài khoản:</strong>{" "}
            {report.bank_account.account_holder_name}
          </div>
          <div>
            <strong>Số tài khoản:</strong> {report.bank_account.account_number}
          </div>
        </div>
      ) : null;

    case "e_wallet":
      return report.e_wallet ? (
        <div className="mt-2 text-xs text-gray-600">
          <div>
            <strong>Loại ví:</strong> {report.e_wallet.wallet_type}
          </div>
          <div>
            <strong>ID ví:</strong> {report.e_wallet.wallet_id}
          </div>
          <div>
            <strong>Chủ tài khoản:</strong>{" "}
            {report.e_wallet.account_holder_name}
          </div>
        </div>
      ) : null;

    case "person_org":
      return report.person_org ? (
        <div className="mt-2 text-xs text-gray-600">
          <div>
            <strong>Tên:</strong> {report.person_org.name}
          </div>
          <div>
            <strong>Vai trò:</strong> {report.person_org.role}
          </div>
          {report.person_org.phone_number && (
            <div>
              <strong>SĐT:</strong> {report.person_org.phone_number}
            </div>
          )}
        </div>
      ) : null;

    case "sms":
      return report.sms ? (
        <div className="mt-2 text-xs text-gray-600">
          <div>
            <strong>Số điện thoại:</strong> {report.sms.phone_number}
          </div>
          <div>
            <strong>Nội dung:</strong>{" "}
            {report.sms.sms_content.substring(0, 100)}...
          </div>
        </div>
      ) : null;

    default:
      return null;
  }
};
const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Đã duyệt
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
          <Hourglass className="w-3 h-3 mr-1" />
          Chờ duyệt
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
          <ShieldAlert className="w-3 h-3 mr-1" />
          Bị từ chối
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
          <Info className="w-3 h-3 mr-1" />
          Chưa xác định
        </span>
      );
  }
};
const LookupResult = ({ loading, result }: LookupResultProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin w-8 h-8 text-[#e53935] mr-2" />
        <span className="text-base text-[#e53935] font-semibold">
          Đang tra cứu...
        </span>
      </div>
    );
  }

  if (!result) return null;

  // Nếu result là array (danh sách báo cáo liên quan)
  if (Array.isArray(result) && result.length > 0) {
    return (
      <div className="bg-white border border-[#e53935] rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <ShieldAlert className="w-14 h-14 text-[#e53935] mb-2 animate-pulse" />
          <div className="text-xl font-extrabold text-[#e53935] mb-2">
            Cảnh báo: Phát hiện {result.length} báo cáo liên quan!
          </div>
          <div className="mb-4 text-gray-700">
            Chúng tôi tìm thấy các báo cáo lừa đảo tương tự với nội dung bạn tra
            cứu:
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-96">
          {result.map((report, index) => (
            <div
              key={report.id}
              className="p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getReportTypeIcon(report.report_type)}
                  <span className="inline-block bg-[#fbc02d] text-[#b71c1c] font-semibold px-3 py-1 rounded-full text-xs">
                    {getReportTypeName(report.report_type)}
                  </span>
                  {/* Thêm status badge */}
                  {getStatusBadge(report.status)}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(report.created_at)}
                </div>
              </div>

              <h4 className="mb-1 text-sm font-semibold text-gray-800">
                {report.title}
              </h4>
              <p className="mb-2 text-sm text-gray-600">{report.description}</p>

              {getReportDetails(report)}

              {report.user && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  Báo cáo bởi: {report.user.fullName || report.user.email}
                </div>
              )}

              {report.evidence && (
                <div className="mt-2">
                  <a
                    href={report.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Xem bằng chứng
                  </a>
                </div>
              )}

              {/* Thêm thông tin status chi tiết nếu cần */}
              {report.status === "pending" && (
                <div className="p-2 mt-2 text-xs text-yellow-700 rounded bg-yellow-50">
                  <Info className="inline w-3 h-3 mr-1" />
                  Báo cáo này đang được xem xét bởi quản trị viên
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/report"
            className="inline-block bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white font-semibold px-6 py-3 rounded-xl shadow hover:from-[#b71c1c] hover:to-[#fbc02d] transition"
          >
            Báo cáo thêm hoặc xem chi tiết
          </a>
        </div>

        <div className="p-3 mt-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <Info className="w-4 h-4" />
            <span className="font-semibold">Lưu ý:</span>
          </div>
          <p className="mt-1 text-sm text-yellow-700">
            Hãy cực kỳ cảnh giác! Không cung cấp mã OTP, mật khẩu, hoặc chuyển
            tiền cho các đối tượng này.
          </p>
        </div>
      </div>
    );
  }

  // Nếu không tìm thấy gì (result.found === false hoặc array rỗng)
  if (
    result.found === false ||
    (Array.isArray(result) && result.length === 0)
  ) {
    return (
      <div className="flex flex-col items-center p-8 text-center bg-white border border-gray-200 shadow rounded-2xl">
        <CheckCircle2 className="w-12 h-12 text-[#388e3c] mb-2" />
        <div className="text-lg font-bold text-[#388e3c] mb-2">
          Không phát hiện dấu hiệu lừa đảo!
        </div>
        <div className="mb-2 text-gray-700">
          Đối tượng bạn tra cứu chưa có trong hệ thống cảnh báo.
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Info className="w-4 h-4" />
          <span>
            Hãy luôn cảnh giác khi giao dịch, không cung cấp mã OTP, mật khẩu,
            hoặc chuyển tiền cho đối tượng chưa xác thực.
          </span>
        </div>
      </div>
    );
  }

  // Format cũ cho các trường hợp khác (nếu có)
  return (
    <div className="bg-white border border-[#e53935] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
      <ShieldAlert className="w-14 h-14 text-[#e53935] mb-2 animate-pulse" />
      <div className="text-xl font-extrabold text-[#e53935] mb-2">
        Cảnh báo: Đã phát hiện lừa đảo!
      </div>
      {result.type && (
        <span className="inline-block bg-[#fbc02d] text-[#b71c1c] font-semibold px-4 py-1 rounded-full mb-2 text-sm">
          {result.type}
        </span>
      )}
      <div className="mb-2 font-semibold text-gray-800">
        {result.detail || "Đối tượng này đã bị báo cáo lừa đảo trên hệ thống."}
      </div>
      {result.count && (
        <div className="mb-2 text-sm text-gray-600">
          Số lần bị báo cáo:{" "}
          <span className="font-bold text-[#e53935]">{result.count}</span>
        </div>
      )}
      {result.lastReport && (
        <div className="mb-2 text-sm text-gray-500">
          Báo cáo gần nhất: {result.lastReport}
        </div>
      )}
      <div className="mt-4">
        <a
          href="/report"
          className="inline-block bg-gradient-to-r from-[#e53935] to-[#fbc02d] text-white font-semibold px-6 py-2 rounded-xl shadow hover:from-[#b71c1c] hover:to-[#fbc02d] transition"
        >
          Báo cáo thêm hoặc xem chi tiết
        </a>
      </div>
    </div>
  );
};

export default LookupResult;
