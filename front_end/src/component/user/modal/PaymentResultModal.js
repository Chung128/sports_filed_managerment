// src/components/PaymentResultModal.jsx
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function PaymentResultModal({ isOpen, onClose, result }) {
    if (!isOpen || !result) return null;

    const { success, message, courtName, date, time, amount } = result;

    // Lớp CSS cho hiệu ứng rung nhẹ khi thất bại (tăng UX phản hồi)
    const failureAnimation = success ? "" : "animate-shake";
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        // Backdrop mờ hơn, tạo chiều sâu
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-opacity duration-300">
            <div
                // Thẻ modal với bo góc lớn hơn, bóng đổ sâu hơn và hiệu ứng rung/lắc
                className={`bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform transition-all duration-300 ${failureAnimation} 
                            animate-in fade-in zoom-in duration-300`}
                onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click bên trong
            >
                <div className="flex flex-col items-center text-center space-y-6">

                    {/* Icon lớn hơn và nổi bật hơn */}
                    {success ? (
                        <CheckCircle className="w-20 h-20 text-green-500 bg-green-100 rounded-full p-2 shadow-lg" />
                    ) : (
                        <XCircle className="w-20 h-20 text-red-500 bg-red-100 rounded-full p-2 shadow-lg" />
                    )}

                    {/* Tiêu đề rõ ràng, sử dụng font semibold */}
                    <h2 className={`text-3xl font-semibold ${success ? "text-green-700" : "text-red-700"}`}>
                        {success ? "Thanh Toán Thành Công!" : "Thanh Toán Thất Bại"}
                    </h2>

                    {/* Tin nhắn chi tiết */}
                    <p className="text-gray-600 font-bold text-base leading-relaxed">
                        {message}
                    </p>

                    {success && (
                        // Chi tiết thanh toán: Bố cục dạng "card" rõ ràng hơn
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 w-full text-left space-y-2 text-sm font-medium">
                            <h3 className="text-blue-800 font-bold mb-2">Chi Tiết Giao Dịch</h3>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Sân:</span> <strong>{courtName}</strong>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Ngày:</span> <strong>{formatDate(date)}</strong>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Giờ:</span> <strong>{time}</strong>
                            </p>
                            {/* Phân cách và làm nổi bật tổng tiền */}
                            <div className="pt-2 border-t border-blue-200 mt-2">
                                <p className="flex justify-between text-lg text-indigo-700">
                                    <span className="text-gray-700 font-bold">Tổng Tiền:</span>
                                    <strong>{parseInt(amount).toLocaleString()}đ</strong>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Nút Đóng: Màu sắc nhất quán, hiệu ứng nhẹ nhàng */}
                    <button
                        onClick={onClose}
                        className={`mt-4 w-full py-3 text-white rounded-xl font-bold transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-500`}
                    >
                         Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}