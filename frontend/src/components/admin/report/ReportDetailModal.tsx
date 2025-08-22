import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Report } from "@/models/ReportModel";
import DetailRenderer from "./ReportDetails";

interface Props {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
}

// const reportTypeLabels: Record<ReportType, string> = {
//   email_address: "Địa chỉ email",
//   person_org: "Người / Tổ chức",
//   email_content: "Nội dung email",
//   phone: "Số điện thoại",
//   sms: "Tin nhắn SMS",
//   website: "Trang web",
//   social: "Trang mạng xã hội",
//   bank_account: "Tài khoản ngân hàng",
//   e_wallet: "Ví điện tử",
// };

// const statusLabels: Record<ReportStatus, string> = {
//   pending: "Chờ xử lý",
//   approved: "Đã phê duyệt",
//   rejected: "Đã từ chối",
// };

export default function ReportDetailModal({ report, isOpen, onClose }: Props) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* ✅ Overlay có Transition.Child để xử lý hiệu ứng và đảm bảo render đúng vị trí */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
                <div className="flex justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Chi tiết báo cáo #{report?.id}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {report && (
                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    {/* //     <p>
                //       <span className="font-semibold">Người gửi:</span>{" "}
                //       {report.user?.fullName || report.user?.email}
                //     </p>
                //     <p>
                //       <span className="font-semibold">IP người gửi:</span>{" "}
                //       {report.user_ip}
                //     </p>
                //     <p>
                //       <span className="font-semibold">Liên hệ:</span>{" "}
                //       {report.contact || "-"}
                //     </p>
                //     <p>
                //       <span className="font-semibold">Loại báo cáo:</span>{" "}
                //       {reportTypeLabels[report.report_type] || "-"}
                //     </p>
                //     <p>
                //       <span className="font-semibold">Tiêu đề:</span>{" "}
                //       {report.title || "-"}
                //     </p>
                //     <p>
                //       <span className="font-semibold">Mô tả:</span>{" "}
                //       {report.description || "-"}
                //     </p>
                //     <p>
                //       <span className="font-semibold">Trạng thái:</span>{" "}
                //       {statusLabels[report.status] || "-"}
                //     </p>
                //     <p>
                //       <span className="font-semibold">Bằng chứng:</span>{" "}
                //       {report.evidence || "-"}
                //     </p>
                //     <p>
                //       <span className="font-semibold">Ngày tạo:</span>{" "}
                //       {formatDate(report.created_at)}
                //     </p>
                //     <p>
                //       <span className="font-semibold">Cập nhật lần cuối:</span>{" "}
                //       {formatDate(report.updated_at)}
                //     </p> */}

                    {/* Chi tiết tuỳ loại */}
                    <DetailRenderer report={report} />
                  </div>
                )}

                <div className="mt-6 text-right">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Đóng
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
