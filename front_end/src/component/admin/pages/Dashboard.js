import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { DollarSign, Calendar, Users, TrendingUp, ArrowUp, Activity } from "lucide-react";

import { fields, bookings, revenueDataDaily, revenueDataMonthly } from "../../../service/admin/data";
import {fetchUsers} from "../../../service/admin/user_information/usersApi";

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState("daily");
    const [activeUsers, setActiveUsers] = useState(0); // số người dùng chưa xóa mềm
    const revenueData = timeRange === "daily" ? revenueDataDaily : revenueDataMonthly;

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalBookings = bookings.length;
    const avgRevenuePerBooking =
        totalRevenue / revenueData.reduce((sum, item) => sum + item.bookings, 0);

    const activeFields = fields.filter((f) => f.status === "available").length;
    const todayBookings = bookings.filter((b) => b.date === "2024-12-21").length;

    const formatCurrency = (value) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);

    // Lấy số người dùng chưa bị xóa mềm từ backend
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersData = await fetchUsers();
                // Giả sử API trả về object có trường 'deleted' để đánh dấu soft delete
                const active = usersData.filter((u) => !u.deleted).length;
                setActiveUsers(active);
            } catch (error) {
                console.error("Lỗi khi tải người dùng:", error);
            }
        };
        loadUsers();
    }, []);

    const fieldTypeData = [
        { name: "Sân 5v5", value: fields.filter((f) => f.type === "5v5").length, color: "#10b981" },
        { name: "Sân 7v7", value: fields.filter((f) => f.type === "7v7").length, color: "#3b82f6" },
        { name: "Sân 11v11", value: fields.filter((f) => f.type === "11v11").length, color: "#f59e0b" },
    ];

    const statusData = [
        { name: "Đã xác nhận", value: bookings.filter((b) => b.status === "confirmed").length, color: "#3b82f6" },
        { name: "Hoàn thành", value: bookings.filter((b) => b.status === "completed").length, color: "#10b981" },
        { name: "Đã hủy", value: bookings.filter((b) => b.status === "cancelled").length, color: "#ef4444" },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between sticky top-0 z-10 border-b bg-white px-6 py-4 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Tổng Quan Hệ Thống
                    </h1>
                    <p className="text-sm text-gray-500">Thống kê và phân tích doanh thu</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Activity className="h-4 w-4 text-green-600 animate-pulse" />
                    <span>Cập nhật realtime</span>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Doanh thu */}
                        <div className="border-l-4 border-green-500 p-5 rounded-xl shadow-md bg-white hover:-translate-y-1 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">Tổng Doanh Thu</p>
                                <DollarSign className="text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold mt-2 text-gray-900">{formatCurrency(totalRevenue)}</h2>
                            <div className="flex items-center mt-2 text-sm text-green-600">
                                <ArrowUp className="h-4 w-4" /> +12.5% so với kỳ trước
                            </div>
                        </div>

                        {/* Lượt đặt sân */}
                        <div className="border-l-4 border-blue-500 p-5 rounded-xl shadow-md bg-white hover:-translate-y-1 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">Lượt Đặt Sân</p>
                                <Calendar className="text-blue-500" />
                            </div>
                            <h2 className="text-3xl font-bold mt-2 text-gray-900">{totalBookings}</h2>
                            <p className="text-xs text-gray-600 mt-2">
                                {todayBookings} hôm nay • Trung bình {Math.round(totalBookings / 7)}/ngày
                            </p>
                        </div>

                        {/* Khách hàng */}
                        <div className="border-l-4 border-purple-500 p-5 rounded-xl shadow-md bg-white hover:-translate-y-1 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">Khách Hàng</p>
                                <Users className="text-purple-500" />
                            </div>
                            <h2 className="text-3xl font-bold mt-2 text-gray-900">{activeUsers}</h2>
                            <p className="text-xs text-purple-600 mt-2">+8 người mới tuần này</p>
                        </div>

                        {/* Trung bình */}
                        <div className="border-l-4 border-orange-500 p-5 rounded-xl shadow-md bg-white hover:-translate-y-1 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">TB/Đơn Hàng</p>
                                <TrendingUp className="text-orange-500" />
                            </div>
                            <h2 className="text-3xl font-bold mt-2 text-gray-900">{formatCurrency(avgRevenuePerBooking)}</h2>
                            <p className="text-xs text-gray-600 mt-2">
                                {activeFields}/{fields.length} sân đang hoạt động
                            </p>
                        </div>
                    </div>

                    {/* Chart: Doanh thu */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">Biểu Đồ Doanh Thu</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTimeRange("daily")}
                                    className={`px-3 py-1 rounded-md text-sm ${timeRange === "daily" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
                                >
                                    7 Ngày
                                </button>
                                <button
                                    onClick={() => setTimeRange("monthly")}
                                    className={`px-3 py-1 rounded-md text-sm ${timeRange === "monthly" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
                                >
                                    12 Tháng
                                </button>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Chart: Xu hướng đặt sân */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="font-bold text-lg mb-4">Xu Hướng Đặt Sân</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
