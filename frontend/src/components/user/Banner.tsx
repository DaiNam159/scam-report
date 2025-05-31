import Image from "next/image";
import { Ban, FileText, ListTree, ShieldAlert } from "lucide-react";
const UserBanner = () => {
  return (
    <section className="bg-white text-black text-center py-10">
      <h1 className="text-4xl font-bold mb-3 text-red-600 drop-shadow">
        BẠN CÓ ĐANG BỊ LỪA ĐẢO
      </h1>
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Nhập thông tin cần tra cứu..."
          className="px-4 py-2 w-80 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
        />
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-r font-semibold transition">
          Tìm kiếm
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-white border border-gray-200 text-black p-6 rounded-xl shadow hover:shadow-lg w-64 transition">
          <ShieldAlert className="w-10 h-10 mx-auto mb-2 text-red-500" />
          <h3 className="font-bold text-lg text-red-600 mb-1">
            Báo cáo lừa đảo
          </h3>
          <p className="text-sm text-gray-600">
            Cho phép người dùng gửi thông tin các vụ việc lừa đảo đã gặp: từ lừa
            đảo online, qua điện thoại đến các hình thức đầu tư giả mạo
          </p>
          <button className="mt-3 text-red-600 font-semibold hover:underline">
            Xem chi tiết
          </button>
        </div>
        <div className="bg-white border border-gray-200 text-black p-6 rounded-xl shadow hover:shadow-lg w-64 transition">
          <Ban className="w-10 h-10 mx-auto mb-2 text-black" />
          <h3 className="font-bold text-lg text-red-600 mb-1">Danh sách đen</h3>
          <p className="text-sm text-gray-600">
            Tổng hợp các tài khoản ngân hàng, số điện thoại, website, fanpage...
            đã bị báo cáo lừa đảo nhiều lần.
          </p>
          <button className="mt-3 text-red-600 font-semibold hover:underline">
            Xem chi tiết
          </button>
        </div>
        <div className="bg-white border border-gray-200 text-black p-6 rounded-xl shadow hover:shadow-lg w-64 transition">
          <FileText className="w-10 h-10 mx-auto mb-2 text-yellow-500" />
          <h3 className="font-bold text-lg text-red-600 mb-1">
            Tin tức & Cảnh báo
          </h3>
          <p className="text-sm text-gray-600">
            Cập nhật các thủ đoạn lừa đảo mới, cảnh báo nóng từ cộng đồng và
            chuyên gia
          </p>
          <button className="mt-3 text-red-600 font-semibold hover:underline">
            Xem chi tiết
          </button>
        </div>
        <div className="bg-white border border-gray-200 text-black p-6 rounded-xl shadow hover:shadow-lg w-64 transition">
          <ListTree className="w-10 h-10 mx-auto mb-2 text-gray-700" />
          <h3 className="font-bold text-lg text-red-600 mb-1">
            Các loại lừa đảo
          </h3>
          <p className="text-sm text-gray-600">
            Phân loại rõ ràng các chiêu trò như: giả danh công an, ngân hàng,
            đầu tư đa cấp, tình cảm, mua hàng online...
          </p>
          <button className="mt-3 text-red-600 font-semibold hover:underline">
            Xem chi tiết
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserBanner;
