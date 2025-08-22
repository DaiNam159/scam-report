"use client";

import {
  FaTachometerAlt,
  FaFileAlt,
  FaUsers,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";
import { IconType } from "react-icons";

interface QuickAction {
  title: string;
  subtitle: string;
  icon: IconType;
  gradient: string;
  bgGradient: string;
  hoverGradient: string;
}

interface QuickActionsProps {
  stats: {
    pendingReports: number;
    totalUsers: number;
    reportsToday: number;
  };
}

export default function QuickActions({ stats }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      title: "Xem báo cáo chờ duyệt",
      subtitle: `${stats.pendingReports} báo cáo`,
      icon: FaFileAlt,
      gradient: "from-blue-500 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100",
      hoverGradient: "from-blue-100 to-blue-200",
    },
    {
      title: "Quản lý người dùng",
      subtitle: `${stats.totalUsers} người dùng`,
      icon: FaUsers,
      gradient: "from-green-500 to-emerald-700",
      bgGradient: "from-green-50 to-emerald-100",
      hoverGradient: "from-green-100 to-emerald-200",
    },
    {
      title: "Xem thống kê",
      subtitle: "Báo cáo chi tiết",
      icon: FaChartLine,
      gradient: "from-purple-500 to-indigo-700",
      bgGradient: "from-purple-50 to-indigo-100",
      hoverGradient: "from-purple-100 to-indigo-200",
    },
    {
      title: "Báo cáo hôm nay",
      subtitle: `${stats.reportsToday} báo cáo mới`,
      icon: FaCalendarAlt,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-100",
      hoverGradient: "from-orange-100 to-red-200",
    },
  ];

  return (
    <div className="relative p-8 overflow-hidden border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-indigo-50/50"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 shadow-lg bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl">
            <FaTachometerAlt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Thao tác nhanh</h3>
            <p className="text-gray-600">
              Truy cập nhanh các chức năng quan trọng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`group relative overflow-hidden bg-gradient-to-br ${action.bgGradient} hover:bg-gradient-to-br hover:${action.hoverGradient} rounded-2xl p-6 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-white/50`}
            >
              <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-white/20 to-transparent group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div
                  className={`inline-flex p-3 bg-gradient-to-br ${action.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4`}
                >
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="mb-2 font-bold text-gray-900 transition-colors group-hover:text-gray-800">
                  {action.title}
                </h4>
                <p className="text-sm font-medium text-gray-600 transition-colors group-hover:text-gray-700">
                  {action.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
