import { Ban, FileText, ListTree, ShieldAlert } from "lucide-react";
const UserBanner = () => {
  return (
    <section className="py-10 text-center text-black bg-white">
      <h1 className="mb-3 text-4xl font-bold text-red-600 drop-shadow">
        BẠN CÓ ĐANG BỊ LỪA ĐẢO
      </h1>
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Nhập thông tin cần tra cứu..."
          className="px-4 py-2 text-black border border-gray-300 rounded-l w-80 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <button className="px-6 py-2 font-semibold text-white transition bg-red-600 rounded-r hover:bg-red-700">
          Tìm kiếm
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="w-64 p-6 text-black transition bg-white border border-gray-200 shadow rounded-xl hover:shadow-lg">
          <ShieldAlert className="w-10 h-10 mx-auto mb-2 text-red-500" />
          <h3 className="mb-1 text-lg font-bold text-red-600">
            Báo cáo lừa đảo
          </h3>
          <p className="text-sm text-gray-600">
            Cho phép người dùng gửi thông tin các vụ việc lừa đảo đã gặp: từ lừa
            đảo online, qua điện thoại đến các hình thức đầu tư giả mạo
          </p>
          <button className="mt-3 font-semibold text-red-600 hover:underline">
            Xem chi tiết
          </button>
        </div>
        <div className="w-64 p-6 text-black transition bg-white border border-gray-200 shadow rounded-xl hover:shadow-lg">
          <Ban className="w-10 h-10 mx-auto mb-2 text-black" />
          <h3 className="mb-1 text-lg font-bold text-red-600">Danh sách đen</h3>
          <p className="text-sm text-gray-600">
            Tổng hợp các tài khoản ngân hàng, số điện thoại, website, fanpage...
            đã bị báo cáo lừa đảo nhiều lần.
          </p>
          <button className="mt-3 font-semibold text-red-600 hover:underline">
            Xem chi tiết
          </button>
        </div>
        <div className="w-64 p-6 text-black transition bg-white border border-gray-200 shadow rounded-xl hover:shadow-lg">
          <FileText className="w-10 h-10 mx-auto mb-2 text-yellow-500" />
          <h3 className="mb-1 text-lg font-bold text-red-600">
            Tin tức & Cảnh báo
          </h3>
          <p className="text-sm text-gray-600">
            Cập nhật các thủ đoạn lừa đảo mới, cảnh báo nóng từ cộng đồng và
            chuyên gia
          </p>
          <button className="mt-3 font-semibold text-red-600 hover:underline">
            Xem chi tiết
          </button>
        </div>
        <div className="w-64 p-6 text-black transition bg-white border border-gray-200 shadow rounded-xl hover:shadow-lg">
          <ListTree className="w-10 h-10 mx-auto mb-2 text-gray-700" />
          <h3 className="mb-1 text-lg font-bold text-red-600">
            Các loại lừa đảo
          </h3>
          <p className="text-sm text-gray-600">
            Phân loại rõ ràng các chiêu trò như: giả danh công an, ngân hàng,
            đầu tư đa cấp, tình cảm, mua hàng online...
          </p>
          <button className="mt-3 font-semibold text-red-600 hover:underline">
            Xem chi tiết
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserBanner;
