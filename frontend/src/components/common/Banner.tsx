import { Ban, FileText, ListTree, ShieldAlert } from "lucide-react";
const UserBanner = () => {
  return (
    <section className="py-10 text-center text-black bg-white">
      <h1 className="mb-3 text-3xl font-bold text-red-600 drop-shadow">
        BẠN CÓ ĐANG BỊ LỪA ĐẢO
      </h1>
      <div className="flex justify-center mx-5 mb-5">
        <input
          type="text"
          placeholder="Nhập thông tin cần tra cứu..."
          className="px-2 py-0 text-black border border-gray-300 rounded-l md:py-2 w-70 md:w-80 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <button className="px-2 py-2 font-semibold text-white transition bg-red-600 rounded-r md:px-6 hover:bg-red-700">
          Tìm kiếm
        </button>
      </div>
    </section>
  );
};

export default UserBanner;
