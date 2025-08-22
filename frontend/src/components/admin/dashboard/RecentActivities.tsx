"use client";

import { FaCheck, FaTimes, FaFileAlt, FaUsers, FaClock } from "react-icons/fa";

interface RecentActivity {
  id: number;
  type: "report" | "user";
  action: string;
  title: string;
  time: string;
  status?: string;
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export default function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  return (
    <div className="relative h-full p-8 overflow-hidden border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/50">
      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-2xl"></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <FaClock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Hoạt động gần đây
            </h3>
            <p className="text-sm text-gray-600">Cập nhật mới nhất</p>
          </div>
        </div>

        <div className="flex-1 pr-2 space-y-4 overflow-y-auto max-h-80">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-4 transition-all duration-300 border border-transparent group rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:border-blue-200/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`p-2 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 ${
                  activity.type === "report"
                    ? activity.status === "approved"
                      ? "bg-gradient-to-br from-green-400 to-emerald-500"
                      : activity.status === "rejected"
                      ? "bg-gradient-to-br from-red-400 to-pink-500"
                      : "bg-gradient-to-br from-orange-400 to-amber-500"
                    : "bg-gradient-to-br from-blue-400 to-indigo-500"
                }`}
              >
                {activity.type === "report" ? (
                  activity.status === "approved" ? (
                    <FaCheck className="w-3 h-3 text-white" />
                  ) : activity.status === "rejected" ? (
                    <FaTimes className="w-3 h-3 text-white" />
                  ) : (
                    <FaFileAlt className="w-3 h-3 text-white" />
                  )
                ) : (
                  <FaUsers className="w-3 h-3 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate transition-colors group-hover:text-blue-800">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {activity.title}
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <button className="w-full py-2 text-sm font-semibold text-center text-blue-600 transition-colors hover:text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl">
            Xem tất cả hoạt động →
          </button>
        </div>
      </div>
    </div>
  );
}
