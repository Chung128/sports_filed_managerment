import React, { useState, useEffect } from "react";
import { Grid3x3, Wrench, CheckCircle, DollarSign, Eye } from "lucide-react";
import {
    getAllCourtTypes,
    getCourtsByVariant,
} from "../../../service/admin/field_information/fieldApi";
import { getPrice } from "../../../service/user/booking/bookingApi";
import PriceModal from "../modal/PriceModal";
import CourtsModal from "../modal/CourtModal";

const Fields = () => {
    const [filterType, setFilterType] = useState("all");
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courtPrices, setCourtPrices] = useState({});
    const [showPriceModal, setShowPriceModal] = useState(null);
    const [showCourtsModal, setShowCourtsModal] = useState(null);
    const [courts, setCourts] = useState([]);

    // ✅ Thêm state lưu số sân của từng loại
    const [courtCounts, setCourtCounts] = useState({});

    // Thêm state thống kê tổng hợp
    const [courtStats, setCourtStats] = useState({
        total: 0,
        available: 0,
        maintenance: 0,
    });

    // Gọi API lấy danh sách loại sân
    useEffect(() => {
        const fetchFields = async () => {
            try {
                setLoading(true);
                const data = await getAllCourtTypes();
                setFields(data);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách sân:", err);
                setError("Không thể tải danh sách sân. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchFields();
    }, []);

    //  Gọi API để lấy giá từng loại sân
    useEffect(() => {
        const fetchPrices = async () => {
            if (fields.length === 0) return;

            const today = new Date().toISOString().split("T")[0];
            const lowPeakTime = { startTime: "13:00", endTime: "14:00" };
            const prices = {};

            for (const field of fields) {
                try {
                    const lowPeakPriceWeekday = await getPrice({
                        variantId: field.id,
                        date: today,
                        startTime: lowPeakTime.startTime,
                        endTime: lowPeakTime.endTime,
                    });

                    const lowPeakPriceWeekend = await getPrice({
                        variantId: field.id,
                        date: "2025-10-19",
                        startTime: lowPeakTime.startTime,
                        endTime: lowPeakTime.endTime,
                    });

                    prices[field.id] = {
                        weekdayLowPeak: lowPeakPriceWeekday,
                        weekdayHighPeak: Math.round(lowPeakPriceWeekday * 1.3),
                        weekendLowPeak: lowPeakPriceWeekend,
                        weekendHighPeak: Math.round(lowPeakPriceWeekend * 1.3),
                    };
                } catch (e) {
                    console.error(`Error fetching price for field ${field.id}:`, e);
                    prices[field.id] = {
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
    }, [fields]);

    //  Tính tổng số sân theo trạng thái & từng loại
    useEffect(() => {
        const fetchCourtStats = async () => {
            try {
                let allCourts = [];
                const counts = {};

                for (const field of fields) {
                    const courtsOfVariant = await getCourtsByVariant(field.id);
                    allCourts = [...allCourts, ...courtsOfVariant];

                    // lưu số lượng sân từng loại
                    counts[field.id] = courtsOfVariant.length;
                }

                const total = allCourts.length;
                const available = allCourts.filter(
                    (c) =>
                        c.status?.toLowerCase() === "available" ||
                        c.status?.toLowerCase() === "hoạt động"
                ).length;
                const maintenance = allCourts.filter(
                    (c) =>
                        c.status?.toLowerCase() === "maintenance" ||
                        c.status?.toLowerCase() === "bảo trì"
                ).length;

                setCourtStats({ total, available, maintenance });
                setCourtCounts(counts); // ✅ lưu số lượng từng loại
            } catch (e) {
                console.error("Lỗi khi tính thống kê sân:", e);
            }
        };

        if (fields.length > 0) fetchCourtStats();
    }, [fields]);

    const handleShowCourts = async (variantId) => {
        try {
            const data = await getCourtsByVariant(variantId);
            setCourts(data);
            setShowCourtsModal(variantId);
        } catch (e) {
            console.error("Lỗi khi tải danh sách sân:", e);
        }
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value || 0);

    const filteredFields =
        filterType === "all"
            ? fields
            : fields.filter((f) => f.courtType?.name === filterType);

    const courtTypeNames = [
        ...new Set(fields.map((f) => f.courtType?.name).filter(Boolean)),
    ];

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-gray-600 text-lg font-medium">
                Đang tải danh sách sân...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen text-red-600 font-medium">
                {error}
            </div>
        );

    return (
        <div className="flex flex-col h-full w-full p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 border-b sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Quản Lý Sân
                </h1>
            </div>

            {/*  Thống kê tổng */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white shadow-lg border-l-4 border-l-blue-500 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Tổng số sân</p>
                        <p className="text-3xl font-bold text-gray-900">{courtStats.total}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Grid3x3 className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white shadow-lg border-l-4 border-l-green-500 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                        <p className="text-3xl font-bold text-green-600">{courtStats.available}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                </div>

                <div className="bg-white shadow-lg border-l-4 border-l-yellow-500 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Đang bảo trì</p>
                        <p className="text-3xl font-bold text-yellow-600">{courtStats.maintenance}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                        <Wrench className="h-6 w-6 text-yellow-600" />
                    </div>
                </div>
            </div>

            {/* Bộ lọc */}
            <div className="flex gap-2 bg-white shadow-md rounded-lg overflow-hidden">
                {["all", ...courtTypeNames].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`flex-1 py-2 px-4 font-medium text-sm ${
                            filterType === type
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-700"
                        }`}
                    >
                        {type === "all"
                            ? `Tất cả (${fields.length})`
                            : `${type} (${
                                fields.filter(
                                    (f) => f.courtType?.name === type
                                ).length
                            })`}
                    </button>
                ))}
            </div>

            {/* Grid hiển thị sân */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFields.map((field) => (
                    <div
                        key={field.id}
                        className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-transform transform hover:-translate-y-2"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={
                                    field.variantName?.toLowerCase().includes("bóng")
                                        ? "https://i.pinimg.com/736x/65/76/c3/6576c3573c5848e608c0a23449c64393.jpg"
                                        : field.variantName?.toLowerCase().includes("pickle")
                                            ? "https://i.pinimg.com/1200x/80/54/25/80542574b8a7ecfa590a6b99555aef13.jpg"
                                            : field.variantName?.toLowerCase().includes("tennis")
                                                ? "https://i.pinimg.com/1200x/73/8b/5c/738b5ced30afe46eb40a329c02d35486.jpg"
                                                : "https://via.placeholder.com/400x300?text=No+Image"
                                }
                                alt={field.variantName}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    {field.variantName}
                                </h3>
                                <p className="text-sm text-white/90">
                                    {field.courtType?.name}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 space-y-3">
                            {/* ✅ Hiển thị tổng số sân */}
                            <p className="text-sm text-gray-700 font-semibold">
                                Tổng số sân:{" "}
                                <span className="text-blue-600">
                                    {courtCounts[field.id] ?? "Đang tải..."}
                                </span>
                            </p>

                            <p className="text-sm text-gray-600">
                                Sức chứa:{" "}
                                <span className="font-semibold text-gray-800">
                                    {field.capacity} người
                                </span>
                            </p>

                            <p className="text-sm text-gray-500">{field.description}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleShowCourts(field.id)}
                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
                                >
                                    <Eye className="h-4 w-4" /> Xem sân
                                </button>
                                <button
                                    onClick={() => setShowPriceModal(field.id)}
                                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
                                >
                                    <DollarSign className="h-4 w-4" /> Xem giá
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showPriceModal && courtPrices[showPriceModal] && (
                <PriceModal
                    field={fields.find((f) => f.id === showPriceModal)}
                    prices={courtPrices[showPriceModal]}
                    formatCurrency={formatCurrency}
                    onClose={() => setShowPriceModal(null)}
                />
            )}

            {showCourtsModal && (
                <CourtsModal
                    courts={courts}
                    fieldName={
                        fields.find((f) => f.id === showCourtsModal)?.variantName
                    }
                    onClose={() => setShowCourtsModal(null)}
                />
            )}
        </div>
    );
};

export default Fields;
