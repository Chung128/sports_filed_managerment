import React, { useState } from "react";
import { X, Search } from "lucide-react";
import { getDynamicStatus } from "../../../service/user/booking/bookingApi";

const CourtHistoryModal = ({ bookings, onClose }) => {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");

    // Lọc booking theo tên sân khi có search
    const filteredBookings = bookings.filter((b) =>
        b.fieldName?.toLowerCase().includes(searchText.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRows = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                    aria-label="Đóng"
                >
                    <X size={24} />
                </button>

                {/* Header + Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h3 className="text-2xl font-bold text-blue-700">
                        🏟️ Lịch Sử Đặt Sân
                    </h3>
                    <div className="flex items-center border rounded-lg overflow-hidden">
                        <input
                            type="text"
                            placeholder="Tìm kiếm tên sân..."
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setCurrentPage(1); // reset trang về 1 khi tìm
                            }}
                            className="px-3 py-2 outline-none text-sm w-48"
                        />
                        <div className="px-2 text-gray-500">
                            <Search size={16} />
                        </div>
                    </div>
                </div>

                {/* Bảng */}
                <div className="overflow-x-auto rounded-lg border border-blue-200 shadow-sm flex-1">
                    <table className="min-w-full divide-y divide-blue-200 text-sm text-gray-700">
                        <thead className="bg-blue-600 text-white sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">STT</th>
                            <th className="px-4 py-3 text-left font-semibold">Tên sân</th>
                            <th className="px-4 py-3 text-left font-semibold">Ngày đặt</th>
                            <th className="px-4 py-3 text-left font-semibold">Khung giờ</th>
                            <th className="px-4 py-3 text-center font-semibold">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white" style={{ minHeight: `${itemsPerPage * 48}px` }}>
                        {currentRows.length > 0 ? (
                            currentRows.map((b, i) => {
                                const status = getDynamicStatus(b);
                                const statusClass =
                                    status === "Đã sử dụng"
                                        ? "bg-gray-100 text-gray-700"
                                        : status === "Đang sử dụng"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700";

                                return (
                                    <tr
                                        key={b.id || i}
                                        className="border-b hover:bg-blue-50 transition-colors"
                                        style={{ height: "48px" }}
                                    >
                                        <td className="px-4 py-3 font-medium">{startIndex + i + 1}</td>
                                        <td className="px-4 py-3 font-semibold">{b.fieldName || "—"}</td>
                                        <td className="px-4 py-3">{b.date ? new Date(b.date).toLocaleDateString("vi-VN") : "—"}</td>
                                        <td className="px-4 py-3">{b.timeSlot || "—"}</td>
                                        <td className="px-4 py-3 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                                                    {status}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                                    Không có dữ liệu đặt sân.
                                </td>
                            </tr>
                        )}

                        {currentRows.length < itemsPerPage &&
                            Array.from({ length: itemsPerPage - currentRows.length }).map((_, i) => (
                                <tr key={`empty-${i}`} className="border-b">
                                    <td colSpan="5" style={{ height: "48px" }}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 border rounded-md ${currentPage === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-blue-100 text-blue-600 border-blue-300"}`}
                        >
                            ← Trước
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 border rounded-md ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-100 text-blue-600 border-blue-300"}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-blue-100 text-blue-600 border-blue-300"}`}
                        >
                            Sau →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourtHistoryModal;
