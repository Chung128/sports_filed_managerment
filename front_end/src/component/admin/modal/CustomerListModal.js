import React, { useState } from "react";
import { X } from "lucide-react";

const CustomerListModal = ({ users, onClose }) => {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRows = users.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative flex flex-col">
                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                    aria-label="Đóng"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <h3 className="text-2xl font-bold text-blue-700 text-center mb-6">
                    👥 Danh Sách Khách Hàng
                </h3>

                {/* Bảng */}
                <div className="overflow-x-auto rounded-lg border border-blue-200 shadow-sm flex-1">
                    <table className="min-w-full divide-y divide-blue-200 text-sm text-gray-700">
                        <thead className="bg-blue-600 text-white sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">STT</th>
                            <th className="px-4 py-3 text-left font-semibold">Tên khách hàng</th>
                            <th className="px-4 py-3 text-left font-semibold">Số điện thoại</th>
                            <th className="px-4 py-3 text-left font-semibold">Email</th>
                        </tr>
                        </thead>
                        <tbody
                            className="bg-white"
                            style={{ minHeight: `${itemsPerPage * 48}px` }}
                        >
                        {currentRows.length > 0 ? (
                            currentRows.map((u, i) => (
                                <tr
                                    key={u.id || i}
                                    className="border-b hover:bg-blue-50 transition-colors"
                                    style={{ height: "48px" }}
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {startIndex + i + 1}
                                    </td>
                                    <td className="px-4 py-3 font-semibold">{u.name || "—"}</td>
                                    <td className="px-4 py-3">{u.phone || "—"}</td>
                                    <td className="px-4 py-3">{u.email || "—"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center py-6 text-gray-500 italic"
                                >
                                    Không có khách hàng nào.
                                </td>
                            </tr>
                        )}

                        {/* Dòng trống để giữ chiều cao */}
                        {currentRows.length < itemsPerPage &&
                            Array.from({
                                length: itemsPerPage - currentRows.length,
                            }).map((_, i) => (
                                <tr key={`empty-${i}`} className="border-b">
                                    <td colSpan="4" style={{ height: "48px" }}></td>
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
                            className={`px-3 py-1 border rounded-md ${
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
                                className={`px-3 py-1 border rounded-md ${
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
                            className={`px-3 py-1 border rounded-md ${
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
};

export default CustomerListModal;
