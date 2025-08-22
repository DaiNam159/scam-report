"use client";

import { TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaUsers,
  FaEye,
  FaClock,
  FaChartLine,
  FaChartPie,
  FaChartBar,
} from "react-icons/fa";

// Import the new smaller components
import DoughnutChart from "./DoughnutChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import StatsCard from "./StatsCard";
import RecentActivities from "./RecentActivities";
import QuickActions from "./QuickActions";
import { ReportService } from "@/services/ReportService";
import { UserService } from "@/services/UserService";
import { StatsService } from "@/services/StatsService";

interface DashboardStats {
  totalReports: number;
  totalUsers: number;
  pendingReports: number;
  approvedReports: number;
  rejectedReports: number;
  activeUsers: number;
  reportsToday: number;
  usersToday: number;
}

interface RecentActivity {
  id: number;
  type: "report" | "user";
  action: string;
  title: string;
  time: string;
  status?: string;
}

export default function DashboardAdminComponent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    totalUsers: 0,
    pendingReports: 0,
    approvedReports: 0,
    rejectedReports: 0,
    activeUsers: 0,
    reportsToday: 0,
    usersToday: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const [monthlyUsers, setMonthlyUsers] = useState<number[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with real service calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const totalRp = await ReportService.countAllReports();
      const totalUs = await UserService.countUsers();
      const pendingRp = await ReportService.countPendingReport();
      const approvedRp = await ReportService.countApprovedReport();
      const rejectedRp = await ReportService.countRejectedReport();
      const onlineUsers = await StatsService.getOnlineUsers();
      const rpToday = await ReportService.countTodayReport();
      const usToday = await UserService.getRegisterToday();
      setStats({
        totalReports: totalRp,
        totalUsers: totalUs,
        pendingReports: pendingRp,
        approvedReports: approvedRp,
        rejectedReports: rejectedRp,
        activeUsers: onlineUsers,
        reportsToday: rpToday,
        usersToday: usToday,
      });

      // Todo: Mock weekly reports data
      setWeeklyData([45, 52, 38, 67, 43, 58, 42]);

      // Todo: Mock monthly users data
      setMonthlyUsers([
        120, 135, 142, 158, 175, 190, 205, 218, 235, 248, 265, 280,
      ]);

      setRecentActivities([
        {
          id: 1,
          type: "report",
          action: "Báo cáo mới",
          title: "Trang web lừa đảo ngân hàng",
          time: "5 phút trước",
          status: "pending",
        },
        {
          id: 2,
          type: "user",
          action: "Người dùng mới",
          title: "user@example.com đã đăng ký",
          time: "10 phút trước",
        },
        {
          id: 3,
          type: "report",
          action: "Đã duyệt",
          title: "Email lừa đảo từ ngân hàng",
          time: "15 phút trước",
          status: "approved",
        },
        {
          id: 4,
          type: "report",
          action: "Từ chối",
          title: "Báo cáo không đủ thông tin",
          time: "30 phút trước",
          status: "rejected",
        },
        {
          id: 5,
          type: "user",
          action: "Vô hiệu hóa",
          title: "Tài khoản spam@test.com",
          time: "1 giờ trước",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data configurations
  const reportStatusData = [
    { label: "Đã duyệt", value: stats.approvedReports, color: "#22c55e" },
    { label: "Chờ duyệt", value: stats.pendingReports, color: "#fb923c" },
    { label: "Từ chối", value: stats.rejectedReports, color: "#ef4444" },
  ];

  const weeklyReportsData = [
    { label: "Thứ 2", value: weeklyData[0] || 0 },
    { label: "Thứ 3", value: weeklyData[1] || 0 },
    { label: "Thứ 4", value: weeklyData[2] || 0 },
    { label: "Thứ 5", value: weeklyData[3] || 0 },
    { label: "Thứ 6", value: weeklyData[4] || 0 },
    { label: "Thứ 7", value: weeklyData[5] || 0 },
    { label: "CN", value: weeklyData[6] || 0 },
  ];

  const monthlyUsersData = [
    { label: "T1", value: monthlyUsers[0] || 0 },
    { label: "T2", value: monthlyUsers[1] || 0 },
    { label: "T3", value: monthlyUsers[2] || 0 },
    { label: "T4", value: monthlyUsers[3] || 0 },
    { label: "T5", value: monthlyUsers[4] || 0 },
    { label: "T6", value: monthlyUsers[5] || 0 },
    { label: "T7", value: monthlyUsers[6] || 0 },
    { label: "T8", value: monthlyUsers[7] || 0 },
    { label: "T9", value: monthlyUsers[8] || 0 },
    { label: "T10", value: monthlyUsers[9] || 0 },
    { label: "T11", value: monthlyUsers[10] || 0 },
    { label: "T12", value: monthlyUsers[11] || 0 },
  ];

  // Stats cards configuration
  const statsCards = [
    {
      title: "Tổng báo cáo",
      value: stats.totalReports,
      change: `+${stats.reportsToday}`,
      icon: FaFileAlt,
      gradient: "from-blue-500 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100",
      changeColor: "text-green-600",
    },
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      change: `+${stats.usersToday}`,
      icon: FaUsers,
      gradient: "from-green-500 to-emerald-700",
      bgGradient: "from-green-50 to-emerald-100",
      changeColor: "text-green-600",
    },
    {
      title: "Chờ duyệt",
      value: stats.pendingReports,
      change: "Cần xử lý",
      icon: FaClock,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-100",
      changeColor: "text-orange-600",
    },
    {
      title: "Người dùng online",
      value: stats.activeUsers,
      change: "Đang hoạt động",
      icon: FaEye,
      gradient: "from-purple-500 to-indigo-700",
      bgGradient: "from-purple-50 to-indigo-100",
      changeColor: "text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 rounded-full animate-ping border-t-purple-600 animation-delay-150"></div>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Đang tải bảng điều khiển...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} index={index} />
        ))}
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
        {/* Doughnut Chart */}
        <div className="lg:col-span-1">
          <div className="relative p-8 overflow-hidden border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/50">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <FaChartPie className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Trạng thái báo cáo
                  </h3>
                  <p className="text-sm text-gray-600">
                    Phân bố theo trạng thái
                  </p>
                </div>
              </div>
              <DoughnutChart data={reportStatusData} />
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-1">
          <div className="relative p-8 overflow-hidden border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/50">
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/30 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                  <FaChartBar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Báo cáo tuần này
                  </h3>
                  <p className="text-sm text-gray-600">Theo từng ngày</p>
                </div>
              </div>
              <BarChart data={weeklyReportsData} />
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-1">
          <RecentActivities activities={recentActivities} />
        </div>
      </div>

      {/* Enhanced Monthly Growth Chart */}
      <div className="mb-8">
        <div className="relative p-8 overflow-hidden border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/50">
          <div className="absolute top-0 w-64 h-32 transform -translate-x-1/2 rounded-full left-1/2 bg-gradient-to-r from-purple-200/20 via-blue-200/20 to-indigo-200/20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl">
                  <FaChartLine className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Tăng trưởng người dùng
                  </h3>
                  <p className="text-gray-600">
                    Số người dùng mới theo tháng trong năm
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  +12.5% tháng này
                </span>
              </div>
            </div>
            <LineChart data={monthlyUsersData} />
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <QuickActions stats={stats} />
    </div>
  );
}
