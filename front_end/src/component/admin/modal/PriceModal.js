import React from "react";

const PriceModal = ({ field, prices, formatCurrency, onClose }) => {
    if (!field || !prices) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h3 className="text-2xl font-bold text-indigo-700 text-center mb-4">
                    💰 Bảng giá chi tiết
                </h3>
                <p className="text-center font-semibold text-gray-800 mb-6">
                    {field.variantName}
                </p>

                <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-600 mb-2">
                            Thứ Hai - Thứ Sáu
                        </h4>
                        <p>
                            Giờ Thường:{" "}
                            <span className="font-bold text-green-700">
                                {formatCurrency(prices.weekdayLowPeak)}
                            </span>
                        </p>
                        <p>
                            Giờ Cao Điểm:{" "}
                            <span className="font-bold text-red-700">
                                {formatCurrency(prices.weekdayHighPeak)}
                            </span>
                        </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-600 mb-2">
                            Cuối Tuần (T7, CN)
                        </h4>
                        <p>
                            Giờ Thường:{" "}
                            <span className="font-bold text-green-700">
                                {formatCurrency(prices.weekendLowPeak)}
                            </span>
                        </p>
                        <p>
                            Giờ Cao Điểm:{" "}
                            <span className="font-bold text-red-700">
                                {formatCurrency(prices.weekendHighPeak)}
                            </span>
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 font-bold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default PriceModal;
