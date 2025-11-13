import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../../service/user/login/authApi";
import { fetchUserDetail } from "../../../service/admin/user_information/usersApi";

const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

// Tính trạng thái động dựa trên ngày + khung giờ
const getDynamicStatus = (booking) => {
    const now = new Date();
    const bookingDate = new Date(booking.date);

    if (!booking.timeSlot || typeof booking.timeSlot !== "string") {
        return "Chưa sử dụng";
    }

    const parts = booking.timeSlot.split("-").map((p) => p.trim());
    const start = parts[0];
    const end = parts[1] || null;

    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end ? end.split(":").map(Number) : [startHour + 1, startMinute || 0];

    const startTime = new Date(bookingDate);
    startTime.setHours(startHour, startMinute || 0, 0, 0);

    const endTime = new Date(bookingDate);
    endTime.setHours(endHour, endMinute || 0, 0, 0);

    if (now < startTime) return "Chưa sử dụng";
    if (now >= startTime && now <= endTime) return "Đang sử dụng";
    return "Đã sử dụng";
};

export default function UserBookingHistory() {
    const [userData, setUserData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 7;

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await getCurrentUser();
                if (!user?.id) throw new Error("Không xác định người dùng.");
                const detail = await fetchUserDetail(user.id);
                setUserData(detail);
                setBookings(detail.bookingHistory || []);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    const filteredBookings = bookings.filter((b) =>
        b.fieldName?.toLowerCase().includes(search.toLowerCase())
    );

    //  Tính dữ liệu trang hiện tại
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
    const startIndex = (currentPage - 1) * bookingsPerPage;
    const currentBookings = filteredBookings.slice(startIndex, startIndex + bookingsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
                Đang tải lịch sử đặt sân...
            </div>
        );

    if (!userData)
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    Không thể tải thông tin người dùng
                </h2>
                <p className="text-gray-500 mt-2">Vui lòng đăng nhập lại để xem lịch sử đặt sân.</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
                    Lịch Sử Đặt Sân
                </h1>

                {/* Thông tin người dùng + tìm kiếm */}
                <div className="bg-white p-5 rounded-xl shadow-md mb-6 border border-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Thông tin người dùng */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <img
                            src={
                                userData.avatar
                                    ? `http://localhost:8080${userData.avatar}`
                                    : "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(userData.name)
                            }
                            alt={userData.name}
                            className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {userData.name}
                            </h2>
                            <p className="text-gray-600">{userData.email}</p>
                        </div>
                    </div>

                    {/* Ô tìm kiếm */}
                    <div className="w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm theo tên sân..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full sm:w-80 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Bảng lịch sử đặt sân */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3 whitespace-nowrap">STT</th>
                            <th className="px-4 py-3 whitespace-nowrap">Tên sân</th>
                            <th className="px-4 py-3 whitespace-nowrap">Ngày</th>
                            <th className="px-4 py-3 whitespace-nowrap">Khung giờ</th>
                            <th className="px-4 py-3 whitespace-nowrap">Giá</th>
                            <th className="px-4 py-3 text-center whitespace-nowrap">
                                Trạng thái
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentBookings.length > 0 ? (
                            currentBookings.map((booking, index) => {
                                const dynamicStatus = getDynamicStatus(booking);
                                let statusColor =
                                    dynamicStatus === "Đang sử dụng"
                                        ? "bg-blue-100 text-blue-700"
                                        : dynamicStatus === "Đã sử dụng"
                                            ? "bg-gray-200 text-gray-700"
                                            : "bg-green-100 text-green-700";

                                return (
                                    <tr
                                        key={booking.id || index}
                                        className="border-b hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-4 py-3">{booking.fieldName}</td>
                                        <td className="px-4 py-3">{formatDate(booking.date)}</td>
                                        <td className="px-4 py-3">{booking.timeSlot}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {formatCurrency(booking.price)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                      <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                      >
                        {dynamicStatus}
                      </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-6 text-gray-500 italic"
                                >
                                    Không tìm thấy sân phù hợp hoặc bạn chưa có lịch sử đặt sân.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center items-center gap-2 py-5 bg-gray-50 rounded-b-xl">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 border rounded-md transition-all ${
                                currentPage === 1
                                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                    : "hover:bg-blue-100 text-blue-600 border-blue-300"
                            }`}
                        >
                            ← Trước
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 border rounded-md transition-all ${
                                    currentPage === i + 1
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "hover:bg-blue-100 text-blue-600 border-blue-300"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 border rounded-md transition-all ${
                                currentPage === totalPages
                                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                    : "hover:bg-blue-100 text-blue-600 border-blue-300"
                            }`}
                        >
                            Sau →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
;
}
