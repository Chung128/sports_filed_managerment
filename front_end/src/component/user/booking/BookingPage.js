import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../service/user/login/authApi";
import {getAllCourtTypes} from "../../../service/admin/field_information/fieldApi";
import { getPrice } from "../../../service/user/booking/bookingApi";

export default function BookingPage() {
    const [courtVariants, setCourtVariants] = useState([]);
    const [courtPrices, setCourtPrices] = useState({});
    const [showPriceDetailsModal, setShowPriceDetailsModal] = useState(null);
    const navigate = useNavigate();

    // ✅ Kiểm tra token hợp lệ
    useEffect(() => {
        getCurrentUser(navigate);
    }, [navigate]);

    // ✅ Lấy danh sách biến thể sân từ BE
    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const data = await getAllCourtTypes();
                const mapped = data.map((variant) => {
                    let icon = "🏐";
                    const name = variant.variantName.toLowerCase();
                    if (name.includes("bóng")) icon = "⚽";
                    else if (name.includes("tennis")) icon = "🎾";
                    else if (name.includes("pickle")) icon = "🏓";
                    return { ...variant, icon };
                });
                setCourtVariants(mapped);
            } catch (e) {
                console.error("Lỗi khi lấy danh sách biến thể sân:", e);
                setCourtVariants([]);
            }
        };
        fetchVariants();
    }, []);

    // ✅ Lấy giá từng biến thể
    useEffect(() => {
        const fetchPrices = async () => {
            if (courtVariants.length === 0) return;

            const today = new Date().toISOString().split("T")[0];
            const prices = {};

            for (const variant of courtVariants) {
                try {
                    const weekdayLow = await getPrice({
                        variantId: variant.id,
                        date: today,
                        startTime: "13:00",
                        endTime: "14:00",
                    });
                    const weekendLow = await getPrice({
                        variantId: variant.id,
                        date: "2025-10-19", // CN
                        startTime: "13:00",
                        endTime: "14:00",
                    });

                    prices[variant.id] = {
                        weekdayLowPeak: weekdayLow,
                        weekdayHighPeak: Math.round(weekdayLow * 1.3),
                        weekendLowPeak: weekendLow,
                        weekendHighPeak: Math.round(weekendLow * 1.3),
                    };
                } catch (e) {
                    console.error(`Lỗi lấy giá variant ${variant.id}:`, e);
                    prices[variant.id] = {
                        weekdayLowPeak: 100000,
                        weekdayHighPeak: 130000,
                        weekendLowPeak: 130000,
                        weekendHighPeak: 169000,
                    };
                }
            }

            setCourtPrices(prices);
        };

        fetchPrices();
    }, [courtVariants]);

    const formatPrice = (price) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

    const togglePriceDetailsModal = (variantId) =>
        setShowPriceDetailsModal((prev) => (prev === variantId ? null : variantId));

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Đặt Sân Thể Thao Dễ Dàng 🚀
                    </h1>
                    <p className="mt-3 text-xl text-indigo-600 font-medium">
                        Chọn loại sân bạn muốn và đặt ngay!
                    </p>
                </header>

                {/* ✅ Hiển thị danh sách biến thể sân */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {courtVariants.map((variant) => (
                        <div
                            key={variant.id}
                            onClick={() => navigate(`/booking/${variant.id}`)}
                            className="relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl hover:bg-indigo-50 cursor-pointer border-t-4 border-indigo-400"
                        >
                            <span className="text-5xl mb-4 p-3 bg-indigo-100 rounded-full shadow-inner">
                                {variant.icon}
                            </span>
                            <h3 className="text-xl font-bold text-gray-800 text-center">
                                {variant.variantName}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                                {variant.courtType?.name || "Không xác định"}
                            </p>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePriceDetailsModal(variant.id);
                                }}
                                className="mt-4 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-500 rounded-full shadow-lg hover:bg-indigo-600 transition"
                            >
                                Xem giá chi tiết
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ✅ Modal chi tiết giá */}
            {showPriceDetailsModal && courtPrices[showPriceDetailsModal] && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="text-center border-b pb-4 mb-4">
                            <h3 className="text-xl font-extrabold text-indigo-700">
                                💰 Bảng Giá Chi Tiết
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {courtVariants.find((v) => v.id === showPriceDetailsModal)?.variantName}
                            </p>
                            <p className="text-sm text-gray-600">
                                {courtVariants.find((v) => v.id === showPriceDetailsModal)?.courtType?.name}
                            </p>
                        </div>

                        {/* Giá chi tiết */}
                        <div className="space-y-4">
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                                <h4 className="font-semibold text-lg text-indigo-600 mb-2">
                                    Thứ Hai - Thứ Sáu
                                </h4>
                                <div className="flex justify-between">
                                    <span>Giờ Thường</span>
                                    <span className="font-bold text-green-600">
                                        {formatPrice(courtPrices[showPriceDetailsModal].weekdayLowPeak)}/giờ
                                    </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span>Giờ Cao Điểm</span>
                                    <span className="font-bold text-red-600">
                                        {formatPrice(courtPrices[showPriceDetailsModal].weekdayHighPeak)}/giờ
                                    </span>
                                </div>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                <h4 className="font-semibold text-lg text-yellow-700 mb-2">
                                    Cuối Tuần
                                </h4>
                                <div className="flex justify-between">
                                    <span>Giờ Thường</span>
                                    <span className="font-bold text-green-700">
                                        {formatPrice(courtPrices[showPriceDetailsModal].weekendLowPeak)}/giờ
                                    </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span>Giờ Cao Điểm</span>
                                    <span className="font-bold text-red-700">
                                        {formatPrice(courtPrices[showPriceDetailsModal].weekendHighPeak)}/giờ
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowPriceDetailsModal(null)}
                            className="mt-6 w-full py-3 font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

