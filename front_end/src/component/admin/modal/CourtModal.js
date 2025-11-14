import React, { useState } from "react";
import {Unlock,Lock, X} from "lucide-react";
import {updateCourtStatus} from "../../../service/admin/field_information/fieldApi";
import toast from "react-hot-toast";

const CourtsModal = ({ courts: initialCourts, fieldName, onClose }) => {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const [courts, setCourts] = useState(initialCourts);
    const totalPages = Math.ceil(courts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCourts = courts.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleStatusChange = async (court) => {
        const nextStatus = court.status === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE";

        try {
            const res = await updateCourtStatus(court.id, nextStatus);

            toast.success("Cập nhật trạng thái thành công!", {
                duration: 3000,
            });

            // Cập nhật UI ngay lập tức
            setCourts((prev) =>
                prev.map((c) =>
                    c.id === court.id ? { ...c, status: nextStatus } : c
                )
            );
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error(err.response.data.message, { duration: 3000 });
            } else {
                toast.error("Lỗi khi cập nhật trạng thái sân", { duration: 3000 });
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-3xl relative flex flex-col">
                {/* Nút X đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                    aria-label="Đóng"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <h3 className="text-2xl font-bold text-blue-700 text-center mb-2">
                    🏟️ Danh Sách Sân
                </h3>
                <p className="text-center font-semibold text-gray-800 mb-6">
                    {fieldName}
                </p>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-blue-200 shadow-sm flex-1">
                    <table className="min-w-full divide-y divide-blue-200 text-sm text-gray-700">
                        <thead className="bg-blue-600 text-white sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">STT</th>
                            <th className="px-4 py-3 text-left font-semibold">Tên sân</th>
                            <th className="px-4 py-3 text-center font-semibold">Trạng thái</th>
                            <th className="px-4 py-3 text-center font-semibold">Hành động</th>
                        </tr>
                        </thead>
                        <tbody
                            className="bg-white"
                            style={{ minHeight: `${itemsPerPage * 48}px` }} //  ép chiều cao
                        >
                        {currentCourts.map((court, index) => (
                            <tr key={court.id} className="border-b hover:bg-blue-50 transition-colors">

                                <td className="px-4 py-3 font-medium">
                                    {startIndex + index + 1}
                                </td>

                                <td className="px-4 py-3 font-semibold">
                                    {court.courtName || court.name}
                                </td>

                                <td className="px-4 py-3 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                court.status === "AVAILABLE"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {court.status === "AVAILABLE" ? "Hoạt động" : "Bảo trì"}
                                        </span>
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <button
                                        className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                        onClick={() => handleStatusChange(court)}
                                    >
                                        {court.status === "AVAILABLE" ? <Lock/> : <Unlock/>}
                                    </button>
                                </td>

                            </tr>
                        ))}
                        {/* 👇 Thêm các dòng trống nếu ít hơn 5 dòng */}
                        {currentCourts.length < itemsPerPage &&
                            Array.from({
                                length: itemsPerPage - currentCourts.length,
                            }).map((_, i) => (
                                <tr key={`empty-${i}`} className="border-b">
                                    <td colSpan="3" style={{ height: "48px" }}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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

export default CourtsModal;
