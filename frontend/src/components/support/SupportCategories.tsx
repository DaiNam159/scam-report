import React from "react";
import { Shield, AlertTriangle, Users, FileText } from "lucide-react";

const categories = [
  {
    icon: Shield,
    title: "Báo cáo lừa đảo",
    description: "Hướng dẫn cách báo cáo và xử lý các vụ lừa đảo",
    link: "/bao-cao",
    iconColor: "text-[#e53935]",
  },
  {
    icon: AlertTriangle,
    title: "Nhận diện lừa đảo",
    description: "Cách nhận biết và tránh các hình thức lừa đảo phổ biến",
    link: "/nhan-dien",
    iconColor: "text-[#fbc02d]",
  },
  {
    icon: Users,
    title: "Tài khoản & Bảo mật",
    description: "Quản lý tài khoản và các vấn đề về bảo mật",
    link: "/tai-khoan",
    iconColor: "text-[#43a047]",
  },
  {
    icon: FileText,
    title: "Hướng dẫn sử dụng",
    description: "Cách sử dụng website và các tính năng có sẵn",
    link: "/huong-dan",
    iconColor: "text-[#1565c0]",
  },
];

export default function SupportCategories() {
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-3xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-[#e53935] mb-6 flex items-center gap-2">
        <Users className="w-6 h-6" />
        Danh mục hỗ trợ
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div
              key={index}
              className="p-5 border border-gray-100 rounded-2xl hover:border-[#e53935] hover:shadow-xl transition-all cursor-pointer bg-gray-50 hover:bg-white group"
            >
              <div className="flex items-start space-x-4">
                <Icon
                  className={`w-8 h-8 ${category.iconColor} flex-shrink-0 mt-1 group-hover:scale-110 transition-transform`}
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-[#e53935] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-700 font-medium">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
