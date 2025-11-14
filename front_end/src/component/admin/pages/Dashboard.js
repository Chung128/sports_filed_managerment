// import React, { useState, useEffect } from "react";
// import {
//     BarChart,
//     Bar,
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import {
//     DollarSign,
//     Calendar,
//     Users,
//     TrendingUp,
//     Activity,
//     Search,
// } from "lucide-react";
// import { fetchUsers } from "../../../service/admin/user_information/usersApi";
// import { revenueDataDaily, revenueDataMonthly } from "../../../service/admin/data";
// import {
//     fetchAllBookings,
//     searchBookingsByFieldName,
// } from "../../../service/user/booking/bookingApi";
//
// const Dashboard = () => {
//     const [timeRange, setTimeRange] = useState("daily");
//     const [activeUsers, setActiveUsers] = useState(0);
//     const [bookings, setBookings] = useState([]);
//     const [monthlyBookings, setMonthlyBookings] = useState(0);
//     const [trendData, setTrendData] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [trendMode, setTrendMode] = useState("month"); // "month" hoặc "quarter"
//
//     const revenueData = timeRange === "daily" ? revenueDataDaily : revenueDataMonthly;
//
//     const formatCurrency = (value) =>
//         new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
//
//     // Lấy người dùng chưa xóa mềm
//     useEffect(() => {
//         const loadUsers = async () => {
//             try {
//                 const usersData = await fetchUsers();
//                 const active = usersData.filter((u) => !u.deleted).length;
//                 setActiveUsers(active);
//             } catch (error) {
//                 console.error("Lỗi khi tải người dùng:", error);
//             }
//         };
//         loadUsers();
//     }, []);
//
//     // Lấy danh sách bookings từ BE
//     useEffect(() => {
//         const loadBookings = async () => {
//             try {
//                 const data = await fetchAllBookings();
//                 setBookings(data);
//             } catch (err) {
//                 console.error("Lỗi khi tải danh sách đặt sân:", err);
//             }
//         };
//         loadBookings();
//     }, []);
//
//
//     // Tính tổng doanh thu và trung bình
//     const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
//     const avgRevenuePerBooking = bookings.length
//         ? totalRevenue / bookings.length
//         : 0;
//
//     // Tính số lượt đặt sân tháng hiện tại
//     useEffect(() => {
//         if (bookings.length === 0) return;
//
//         const now = new Date();
//         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
//         const currentMonthBookings = bookings.filter((b) => {
//             const date = new Date(b.bookingDate || b.date);
//             return date >= startOfMonth && date <= now;
//         });
//
//         setMonthlyBookings(currentMonthBookings.length);
//     }, [bookings]);
//
//     // 🔹 Tạo dữ liệu xu hướng đặt sân (tháng hoặc quý)
//     useEffect(() => {
//         if (bookings.length === 0) return;
//
//         const now = new Date();
//         const currentYear = now.getFullYear();
//         const filtered = bookings.filter(
//             (b) => new Date(b.bookingDate || b.date).getFullYear() === currentYear
//         );
//
//         if (trendMode === "month") {
//             // Hiển thị các ngày trong tháng hiện tại
//             const currentMonth = now.getMonth();
//             const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//             const dailyCount = Array(daysInMonth).fill(0);
//
//             filtered.forEach((b) => {
//                 const date = new Date(b.bookingDate || b.date);
//                 if (date.getMonth() === currentMonth) {
//                     const day = date.getDate();
//                     dailyCount[day - 1]++;
//                 }
//             });
//
//             const trend = dailyCount.map((count, idx) => ({
//                 name: `Ngày ${idx + 1}`,
//                 bookings: count,
//             }));
//
//             setTrendData(trend);
//         } else {
//             // Hiển thị theo quý (4 cột)
//             const quarterCount = [0, 0, 0, 0];
//             filtered.forEach((b) => {
//                 const date = new Date(b.bookingDate || b.date);
//                 const quarter = Math.floor(date.getMonth() / 3); // 0-3
//                 quarterCount[quarter]++;
//             });
//
//             const trend = quarterCount.map((count, idx) => ({
//                 name: `Quý ${idx + 1}`,
//                 bookings: count,
//             }));
//
//             setTrendData(trend);
//         }
//     }, [bookings, trendMode]);
//
//     return (
//         <div className="flex flex-col h-full w-full bg-gray-50 min-h-screen">
//             {/* Header */}
//             <header className="flex items-center justify-between sticky top-0 z-10 border-b bg-white px-6 py-4 shadow-sm">
//                 <div>
//                     <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
//                         Tổng Quan Hệ Thống
//                     </h1>
//                     <p className="text-sm text-gray-500">Thống kê và phân tích doanh thu</p>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Activity className="h-4 w-4 text-green-600 animate-pulse" />
//                     <span>Cập nhật realtime</span>
//                 </div>
//             </header>
//
//             {/* Content */}
//             <main className="flex-1 overflow-auto p-6">
//                 <div className="max-w-7xl mx-auto space-y-6">
//
//                     {/* Quick Stats */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         <div className="border-l-4 border-green-500 p-5 rounded-xl shadow-md bg-white">
//                             <div className="flex justify-between items-center">
//                                 <p className="text-sm text-gray-600">Tổng Doanh Thu</p>
//                                 <DollarSign className="text-green-500" />
//                             </div>
//                             <h2 className="text-3xl font-bold mt-2 text-gray-900">
//                                 {formatCurrency(totalRevenue)}
//                             </h2>
//                         </div>
//
//                         <div className="border-l-4 border-blue-500 p-5 rounded-xl shadow-md bg-white">
//                             <div className="flex justify-between items-center">
//                                 <p className="text-sm text-gray-600">Lượt Đặt Sân (Tháng này)</p>
//                                 <Calendar className="text-blue-500" />
//                             </div>
//                             <h2 className="text-3xl font-bold mt-2 text-gray-900">
//                                 {monthlyBookings}
//                             </h2>
//                         </div>
//
//                         <div className="border-l-4 border-purple-500 p-5 rounded-xl shadow-md bg-white">
//                             <div className="flex justify-between items-center">
//                                 <p className="text-sm text-gray-600">Người Dùng Hoạt Động</p>
//                                 <Users className="text-purple-500" />
//                             </div>
//                             <h2 className="text-3xl font-bold mt-2 text-gray-900">
//                                 {activeUsers}
//                             </h2>
//                         </div>
//
//                         <div className="border-l-4 border-orange-500 p-5 rounded-xl shadow-md bg-white">
//                             <div className="flex justify-between items-center">
//                                 <p className="text-sm text-gray-600">TB/Đơn Hàng</p>
//                                 <TrendingUp className="text-orange-500" />
//                             </div>
//                             <h2 className="text-3xl font-bold mt-2 text-gray-900">
//                                 {formatCurrency(avgRevenuePerBooking)}
//                             </h2>
//                         </div>
//                     </div>
//
//                     {/* Biểu đồ doanh thu */}
//                     <div className="bg-white rounded-xl shadow-md p-6">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="font-bold text-lg">Biểu Đồ Doanh Thu</h2>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => setTimeRange("daily")}
//                                     className={`px-3 py-1 rounded-md text-sm ${timeRange === "daily"
//                                         ? "bg-green-600 text-white"
//                                         : "bg-gray-100 text-gray-700"
//                                     }`}
//                                 >
//                                     Tháng
//                                 </button>
//                                 <button
//                                     onClick={() => setTimeRange("monthly")}
//                                     className={`px-3 py-1 rounded-md text-sm ${timeRange === "monthly"
//                                         ? "bg-green-600 text-white"
//                                         : "bg-gray-100 text-gray-700"
//                                     }`}
//                                 >
//                                    Năm
//                                 </button>
//                             </div>
//                         </div>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <BarChart data={revenueData}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="date" />
//                                 <YAxis />
//                                 <Tooltip formatter={(value) => formatCurrency(value)} />
//                                 <Legend />
//                                 <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//
//                     {/* Xu hướng đặt sân */}
//                     <div className="bg-white rounded-xl shadow-md p-6">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="font-bold text-lg">Xu Hướng Đặt Sân</h2>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => setTrendMode("month")}
//                                     className={`px-3 py-1 rounded-md text-sm ${trendMode === "month"
//                                         ? "bg-green-600 text-white"
//                                         : "bg-gray-100 text-gray-700"
//                                     }`}
//                                 >
//                                     Tháng
//                                 </button>
//                                 <button
//                                     onClick={() => setTrendMode("quarter")}
//                                     className={`px-3 py-1 rounded-md text-sm ${trendMode === "quarter"
//                                         ? "bg-green-600 text-white"
//                                         : "bg-gray-100 text-gray-700"
//                                     }`}
//                                 >
//                                     Quý
//                                 </button>
//                             </div>
//                         </div>
//                         <ResponsiveContainer width="100%" height={280}>
//                             <LineChart data={trendData}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="name" />
//                                 <YAxis allowDecimals={false} />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Line
//                                     type="monotone"
//                                     dataKey="bookings"
//                                     stroke="#3b82f6"
//                                     strokeWidth={3}
//                                     dot={{ r: 5 }}
//                                 />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };
//
// export default Dashboard;
//
import React, { useState, useEffect } from "react";
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
} from "recharts";
import {
    DollarSign,
    Calendar,
    Users,
    TrendingUp,
    Activity,
} from "lucide-react";
import { fetchUsers } from "../../../service/admin/user_information/usersApi";
import {
    fetchAllBookings,
} from "../../../service/user/booking/bookingApi";

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState("daily");
    const [activeUsers, setActiveUsers] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [monthlyBookings, setMonthlyBookings] = useState(0);
    const [trendData, setTrendData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [trendMode, setTrendMode] = useState("month"); // "month" hoặc "quarter"
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    const years = [];
    for (let i = 2021; i <= new Date().getFullYear(); i++) years.push(i);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    const formatCurrencyShort = (value) => {
        return value.toLocaleString("vi-VN") + "₫";
    };

    // Lấy người dùng chưa xóa mềm
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersData = await fetchUsers();
                const active = usersData.filter((u) => !u.deleted).length;
                setActiveUsers(active);
            } catch (error) {
                console.error("Lỗi khi tải người dùng:", error);
            }
        };
        loadUsers();
    }, []);

    // Lấy danh sách bookings từ BE
    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await fetchAllBookings();
                setBookings(data);
            } catch (err) {
                console.error("Lỗi khi tải danh sách đặt sân:", err);
            }
        };
        loadBookings();
    }, []);

    // Tính số lượt đặt sân tháng hiện tại
    useEffect(() => {
        if (bookings.length === 0) return;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        const currentMonthBookings = bookings.filter((b) => {
            const date = new Date(b.bookingDate || b.specificDate);
            return date >= startOfMonth && date <= now;
        });

        setMonthlyBookings(currentMonthBookings.length);
    }, [bookings]);

    // 🔹 Tạo dữ liệu xu hướng đặt sân (tháng hoặc quý)
    useEffect(() => {
        if (bookings.length === 0) return;

        const now = new Date();
        const currentYear = now.getFullYear();
        const filtered = bookings.filter(
            (b) => new Date(b.bookingDate || b.specificDate).getFullYear() === currentYear
        );

        if (trendMode === "month") {
            // Hiển thị các ngày trong tháng hiện tại
            const currentMonth = now.getMonth();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const dailyCount = Array(daysInMonth).fill(0);

            filtered.forEach((b) => {
                const date = new Date(b.bookingDate || b.specificDate);
                if (date.getMonth() === currentMonth) {
                    const day = date.getDate();
                    dailyCount[day - 1]++;
                }
            });

            const trend = dailyCount.map((count, idx) => ({
                name: `Ngày ${idx + 1}`,
                "số lượng": count,
            }));

            setTrendData(trend);
        } else {
            // Hiển thị theo quý (4 cột)
            const quarterCount = [0, 0, 0, 0];
            filtered.forEach((b) => {
                const date = new Date(b.bookingDate || b.specificDate);
                const quarter = Math.floor(date.getMonth() / 3); // 0-3
                quarterCount[quarter]++;
            });

            const trend = quarterCount.map((count, idx) => ({
                name: `Quý ${idx + 1}`,
                "số lượng": count,
            }));

            setTrendData(trend);
        }
    }, [bookings, trendMode]);

    const calcGrowthRates = (arr) => {
        if (!arr || arr.length === 0) return [];
        const rates = [0];
        for (let i = 1; i < arr.length; i++) {
            const prev = Number(arr[i - 1]) || 0;
            const curr = Number(arr[i]) || 0;
            const rate = prev === 0 ? 0 : ((curr - prev) / prev) * 100;
            rates.push(Number(rate.toFixed(1)));
        }
        return rates;
    };

    const [monthlyChartData, setMonthlyChartData] = useState([]);

    const [quarterlyChartData, setQuarterlyChartData] = useState([]);

    const [weeklyChartData, setWeeklyChartData] = useState([]);

    const sum = (arr) => arr.reduce((a, b) => a + Number(b || 0), 0);

    const getMonthlyRevenue = (bookings, year) => {
        const monthly = Array(12).fill(0);
        bookings.forEach((b) => {
            if (b.paymentStatus === "PAID") {
                const date = new Date(b.bookingDate || b.specificDate);
                if (date.getFullYear() === year) {
                    const monthIndex = date.getMonth();
                    monthly[monthIndex] += b.totalAmount;
                }
            }
        });
        return monthly;
    };

    const getWeeklyRevenue = (bookings, year, month) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        const numWeeks = Math.ceil(end.getDate() / 7);
        const weekly = Array(numWeeks).fill(0);
        bookings.forEach((b) => {
            if (b.paymentStatus === "PAID") {
                const date = new Date(b.bookingDate || b.specificDate);
                if (date.getFullYear() === year && date.getMonth() === month - 1) {
                    const weekIndex = Math.floor((date.getDate() - 1) / 7);
                    weekly[weekIndex] += b.totalAmount;
                }
            }
        });
        return weekly;
    };

    const fetchAndComputeRevenue = () => {
        setLoading(true);
        try {
            const monthlyRevenue = getMonthlyRevenue(bookings, selectedYear);
            const growthRatesMonthly = calcGrowthRates(monthlyRevenue);
            const monthlyData = monthlyRevenue.map((revenue, index) => ({
                name: `Tháng ${index + 1}`,
                "doanh thu": revenue,
                "tăng trưởng": growthRatesMonthly[index],
            }));
            setMonthlyChartData(monthlyData);

            const quarterlyRevenue = [0, 0, 0, 0].map((_, qi) =>
                monthlyRevenue.slice(qi * 3, qi * 3 + 3).reduce((s, n) => s + n, 0)
            );
            const growthRatesQuarterly = calcGrowthRates(quarterlyRevenue);
            const quarterlyData = quarterlyRevenue.map((revenue, index) => ({
                name: `Quý ${index + 1}`,
                "doanh thu": revenue,
                "tăng trưởng": growthRatesQuarterly[index],
            }));
            setQuarterlyChartData(quarterlyData);

            if (selectedMonth !== "all") {
                const monthNumber = Number(selectedMonth);
                const weeklyRevenue = getWeeklyRevenue(bookings, selectedYear, monthNumber);
                const growthRatesWeekly = calcGrowthRates(weeklyRevenue);
                const weeklyData = weeklyRevenue.map((revenue, index) => ({
                    name: `Tuần ${index + 1} - Tháng ${selectedMonth}`,
                    "doanh thu": revenue,
                    "tăng trưởng": growthRatesWeekly[index],
                }));
                setWeeklyChartData(weeklyData);
            } else {
                setWeeklyChartData([]);
            }
        } catch (e) {
            console.error("Lỗi khi tính toán dữ liệu:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bookings.length > 0) {
            fetchAndComputeRevenue();
        }
    }, [bookings, selectedMonth, selectedYear]);

    // Tính tổng doanh thu và trung bình cho quick stats (từ đầu tháng đến nay)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const totalRevenue = bookings.reduce((sum, b) => {
        const date = new Date(b.bookingDate || b.specificDate);
        if (b.paymentStatus === "PAID" && date >= startOfMonth && date <= now) {
            return sum + b.totalAmount;
        }
        return sum;
    }, 0);

    const totalRevenueInPeriod = (
        selectedMonth === "all"
            ? monthlyChartData.reduce((sum, item) => sum + item["doanh thu"], 0)
            : weeklyChartData.reduce((sum, item) => sum + item["doanh thu"], 0)
    );

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

            </header>

            {/* Content */}
            <main className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="border-l-4 border-green-500 p-5 rounded-xl shadow-md bg-white">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">Tổng Doanh Thu (Tháng này)</p>
                                <DollarSign className="text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold mt-2 text-gray-900">
                                {formatCurrency(totalRevenue)}
                            </h2>
                        </div>

                        <div className="border-l-4 border-blue-500 p-5 rounded-xl shadow-md bg-white">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">Lượt Đặt Sân (Tháng này)</p>
                                <Calendar className="text-blue-500" />
                            </div>
                            <h2 className="text-3xl font-bold mt-2 text-gray-900">
                                {monthlyBookings}
                            </h2>
                        </div>

                        <div className="border-l-4 border-purple-500 p-5 rounded-xl shadow-md bg-white">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">Người Dùng Hoạt Động</p>
                                <Users className="text-purple-500" />
                            </div>
                            <h2 className="text-3xl font-bold mt-2 text-gray-900">
                                {activeUsers}
                            </h2>
                        </div>
                    </div>

                    {/* Bộ lọc cho thống kê doanh thu */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                                        <Calendar size={16} />
                                        <span>Chọn tháng</span>
                                    </label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                        <option value="all">Tất cả</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={String(i + 1)}>
                                                Tháng {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                                        <TrendingUp size={16} />
                                        <span>Chọn năm</span>
                                    </label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                        {years.map((y) => (
                                            <option key={y} value={y}>
                                                Năm {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-white bg-blue-600 rounded-md">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Đang tải dữ liệu...
                            </div>
                        </div>
                    )}

                    {/* Biểu đồ tuần */}
                    {!loading &&
                        selectedMonth !== "all" &&
                        (weeklyChartData.length > 0 ? (
                            <div className="space-y-8">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Biểu đồ theo tuần
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Doanh thu trong tháng {selectedMonth}/{selectedYear}
                                        </p>
                                    </div>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={weeklyChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis
                                                yAxisId="left"
                                                orientation="left"
                                                stroke="#8884d8"
                                                tickFormatter={formatCurrencyShort}
                                                type="number"   // type number
                                                width={120}     // tăng width để hiển thị đầy đủ số VND
                                            />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                                stroke="#82ca9d"
                                                tickFormatter={(value) => `${value}%`}
                                                width={80}      //  width cho % căn giữa
                                            />
                                            <Tooltip
                                                formatter={(value, name) => {
                                                    if (name === "doanh thu") return formatCurrency(value);
                                                    return `${value}%`;
                                                }}
                                            />
                                            <Legend />
                                            <Bar dataKey="doanh thu" fill="#8884d8" yAxisId="left" />
                                            <Line dataKey="tăng trưởng" stroke="#82ca9d" yAxisId="right" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                        Danh sách chi tiết
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left min-w-[400px]">
                                            <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="p-3 text-sm font-semibold text-gray-700">
                                                    Thời gian
                                                </th>
                                                <th className="p-3 text-sm font-semibold text-gray-700">
                                                    Doanh thu
                                                </th>
                                                <th className="p-3 text-sm font-semibold text-gray-700">
                                                    Tăng trưởng (%)
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {weeklyChartData.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-gray-100 hover:bg-gray-50"
                                                >
                                                    <td className="p-3 text-sm text-gray-900">
                                                        {item.name}
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-600 font-medium">
                                                        {formatCurrency(item["doanh thu"])}
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-600">
                                                        {item["tăng trưởng"]}%
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-md">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-base">
                                    Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}
                                </p>
                            </div>
                        ))}

                    {/* Biểu đồ tháng & quý */}
                    {!loading && selectedMonth === "all" && (
                        <div className="space-y-8">
                            {/* Biểu đồ theo tháng */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Biểu đồ theo tháng
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Doanh thu theo tháng ({selectedYear})
                                    </p>
                                </div>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={monthlyChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis
                                            yAxisId="left"
                                            orientation="left"
                                            stroke="#8884d8"
                                            tickFormatter={formatCurrencyShort}
                                            type="number"   //  type number
                                            width={120}     // tăng width để hiển thị đầy đủ số VND
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            stroke="#82ca9d"
                                            tickFormatter={(value) => `${value}%`}
                                            width={80}      // width cho % căn giữa
                                        />
                                        <Tooltip
                                            formatter={(value, name) => {
                                                if (name === "doanh thu") return formatCurrency(value);
                                                return `${value}%`;
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="doanh thu" fill="#8884d8" yAxisId="left" />
                                        <Line dataKey="tăng trưởng" stroke="#82ca9d" yAxisId="right" />
                                    </BarChart>
                                </ResponsiveContainer>

                                <div className="mt-6 bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold mb-4 text-gray-800">
                                        Chi tiết theo tháng
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left min-w-[400px]">
                                            <thead>
                                            <tr className="bg-white border-b border-gray-200">
                                                <th className="p-3 text-sm font-semibold text-gray-700">
                                                    Tháng
                                                </th>
                                                <th className="p-3 text-sm font-semibold text-gray-700 text-right">
                                                    Doanh thu
                                                </th>
                                                <th className="p-3 text-sm font-semibold text-gray-700 text-center">
                                                    Tăng trưởng (%)
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {monthlyChartData.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-gray-100 hover:bg-white"
                                                >
                                                    <td className="p-3 text-sm text-gray-900  ">
                                                        {item.name}
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-600 text-right">
                                                        {formatCurrency(item["doanh thu"])}
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-600 text-center">
                                                        {item["tăng trưởng"]}%
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Biểu đồ theo quý */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Biểu đồ theo quý
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Doanh thu theo quý ({selectedYear})
                                    </p>
                                </div>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={quarterlyChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis
                                            yAxisId="left"
                                            orientation="left"
                                            stroke="#8884d8"
                                            tickFormatter={formatCurrencyShort}
                                            type="number"
                                            width={120}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            stroke="#82ca9d"
                                            tickFormatter={(value) => `${value}%`}
                                            width={80}
                                        />
                                        <Tooltip
                                            formatter={(value, name) => {
                                                if (name === "doanh thu") return formatCurrency(value);
                                                return `${value}%`;
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="doanh thu" fill="#8884d8" yAxisId="left" />
                                        <Line dataKey="tăng trưởng" stroke="#82ca9d" yAxisId="right" />
                                    </BarChart>
                                </ResponsiveContainer>

                                <div className="mt-6 bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold mb-4 text-gray-800">
                                        Chi tiết theo quý
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left min-w-[400px]">
                                            <thead>
                                            <tr className="bg-white border-b border-gray-200">
                                                <th className="p-3 text-sm font-semibold text-gray-700">Quý</th>
                                                <th className="p-3 text-sm font-semibold text-gray-700 text-right">
                                                    Doanh thu
                                                </th>
                                                <th className="p-3 text-sm font-semibold text-gray-700 text-center">
                                                    Tăng trưởng (%)
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {quarterlyChartData.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-gray-100 hover:bg-gray-50"
                                                >
                                                    <td className="p-3 text-sm text-gray-900">{item.name}</td>
                                                    <td className="p-3 text-sm text-gray-600 text-right">
                                                        {formatCurrency(item["doanh thu"])}
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-600 text-center">
                                                        {item["tăng trưởng"]}%
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tổng doanh thu */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <p className="text-base text-blue-800">
                            <strong>Tổng doanh thu (năm :{selectedYear}):</strong> {formatCurrency(totalRevenueInPeriod)}
                        </p>
                    </div>

                    {/* Xu hướng đặt sân (giữ nguyên) */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">Xu Hướng Đặt Sân</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTrendMode("month")}
                                    className={`px-3 py-1 rounded-md text-sm ${trendMode === "month"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    Tháng
                                </button>
                                <button
                                    onClick={() => setTrendMode("quarter")}
                                    className={`px-3 py-1 rounded-md text-sm ${trendMode === "quarter"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    Quý
                                </button>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="số lượng"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;