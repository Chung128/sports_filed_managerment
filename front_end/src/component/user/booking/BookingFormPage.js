// src/pages/BookingFormPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import BookingTimeModal from "../modal/BookingTimeModal";
import CourtDetailModal from "../modal/CourtDetailModal";
import {checkAvailability, createBooking, getCourtType, getStatusLabel} from "../../../service/user/booking/bookingApi";


export default function BookingFormPage() {
    const { variantId } = useParams();
    const courtVariantId = Number(variantId);
    const navigate = useNavigate();
    const [availableCourts, setAvailableCourts] = useState([]);
    const [selectedCourtId, setSelectedCourtId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showCourtDetailModal, setShowCourtDetailModal] = useState(false);
    const [showBookingTimeModal, setShowBookingTimeModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Kiểm tra variantId hợp lệ
    useEffect(() => {
        if (!courtVariantId || ![1, 2, 3, 4, 5].includes(courtVariantId)) {
            setMessage("Loại sân không hợp lệ! Vui lòng chọn lại.");
            navigate("/booking");
        }
    }, [courtVariantId, navigate]);

    const validationSchema = Yup.object({
        variantId: Yup.number()
            .required("Vui lòng chọn loại sân.")
            .oneOf([1, 2, 3, 4, 5], "Loại sân không hợp lệ."),
        date: Yup.string()
            .required("Vui lòng chọn ngày.")
            .matches(/^\d{4}-\d{2}-\d{2}$/, "Ngày không đúng định dạng (YYYY-MM-DD).")
            .test("is-not-past", "Ngày không được nhỏ hơn ngày hiện tại.", function (value) {
                if (!value) return true;
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate.getTime() >= today.getTime();
            }),
    });

    const handleCheckAvailability = async (values) => {
        try {
            setLoading(true);
            const courts = await checkAvailability(values); // ← Gửi variantId + date + start/end
            setAvailableCourts(courts);
            setMessage(`Có ${courts.length} sân khả dụng trong ngày ${values.date}`);
        } catch (e) {
            console.error("Lỗi kiểm tra sân:", e);
            setMessage("Không có sân khả dụng trong ngày này!");
            setAvailableCourts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (bookingData) => {
        if (!selectedCourtId) {
            setMessage("⚠️ Hãy chọn 1 sân để đặt!");
            return;
        }
        if (!bookingData.date) {
            setMessage("⚠️ Vui lòng chọn ngày trước khi đặt sân!");
            return;
        }

        try {
            console.log("Dữ liệu gửi lên BE:", {
                courtId: selectedCourtId,
                variantId: bookingData.variantId,
                date: bookingData.date,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime
            });
            const res = await createBooking({
                courtId: selectedCourtId,
                variantId: bookingData.variantId,
                date: bookingData.date,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime
            });
            setMessage(`✅ Đặt sân thành công! Mã đặt: ${res.id}`);
            setSelectedCourtId(null);
            setAvailableCourts([]);
            navigate("/");
        } catch (e) {
            console.error("Lỗi đặt sân:", e);
            setMessage("❌ Lỗi khi đặt sân!");
        }
    };

    const courtTypes = [
        { id: 1, name: "Bóng đá 5 người", icon: "⚽" },
        { id: 2, name: "Bóng đá 6 người", icon: "⚽" },
        { id: 3, name: "Bóng đá 7 người", icon: "⚽" },
        { id: 4, name: "Tennis", icon: "🎾" },
        { id: 5, name: "Pickleball", icon: "🏓" },
    ];

    const filteredCourts = availableCourts.filter((court) =>
        (court?.courtName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-3xl border border-indigo-100">
                <header className="text-center mb-6 border-b pb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Đặt Sân {getCourtType(courtVariantId)}
                    </h1>
                    <p className="text-md text-indigo-600 mt-1">Chọn thời gian và tìm sân phù hợp</p>
                </header>

                {message && !loading && (
                    <div className={`p-3 mb-4 rounded-lg text-sm font-semibold text-center ${
                        message.includes("✅") ? "bg-green-100 text-green-700" :
                            message.includes("💰") ? "bg-indigo-100 text-indigo-700" :
                                "bg-red-100 text-red-700"
                    } shadow-sm`}>
                        {message}
                    </div>
                )}

                <Formik
                    initialValues={{
                        variantId: courtVariantId,
                        date: "",
                    }}
                    validationSchema={validationSchema}
                    validateOnChange={true}
                    validateOnBlur={true}
                >
                    {({ values, errors }) => (
                        <Form className="space-y-6">
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-inner">
                                <h3 className="text-lg font-bold text-gray-700 mb-3">1. Thời gian & Lọc sân</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-semibold text-gray-700">Chọn ngày:</label>
                                        <Field
                                            type="date"
                                            name="date"
                                            className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
                                                values.date = selectedDate;
                                                handleCheckAvailability({ ...values, date: selectedDate });
                                            }}
                                        />
                                        <ErrorMessage name="date" component="div" className="text-red-600 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-semibold text-gray-700">Tìm kiếm sân theo tên:</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập tên sân (Khu A, Sân 1...)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/*<div className="flex gap-4 border-b pb-4">*/}
                            {/*    <button*/}
                            {/*        type="button"*/}
                            {/*        onClick={() => handleCheckAvailability(values)}*/}
                            {/*        disabled={loading || !values.date}*/}
                            {/*        className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed"*/}
                            {/*    >*/}
                            {/*        {loading ? "Đang kiểm tra..." : "Kiểm tra sân trống"}*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                            {filteredCourts.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-700 mb-3 border-b pb-2">
                                        2. Chọn sân
                                    </h3>

                                    {/* Lưới 3 cột ngang */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                        {filteredCourts.map((court) => {
                                            const hasBooked = court.bookedTimes?.length > 0;
                                            const isAvailable = court.status === "AVAILABLE" && !hasBooked;
                                            const isPartiallyBooked = hasBooked;

                                            return (
                                                <div
                                                    key={court.courtId}
                                                    onClick={() =>
                                                        (isAvailable || isPartiallyBooked) &&
                                                        setSelectedCourtId(court.courtId)
                                                    }
                                                    className={`p-4 rounded-2xl text-center text-sm font-semibold shadow-md transition-all cursor-pointer
                            ${isAvailable
                                                            ? "bg-white border-2 border-green-500 hover:shadow-lg"
                                                            : isPartiallyBooked
                                                                ? "bg-orange-50 border-2 border-orange-400 hover:shadow-md"
                                                                : court.status === "MAINTENANCE"
                                                                    ? "bg-yellow-50 border border-yellow-300 opacity-70 cursor-not-allowed"
                                                                    : "bg-gray-100 border border-gray-300 opacity-70 cursor-not-allowed"
                                                    }
                            ${
                                                        selectedCourtId === court.courtId
                                                            ? "ring-4 ring-indigo-500 scale-[1.05]"
                                                            : "hover:scale-[1.02]"
                                                    }`}
                                                >
                                                    {/* Icon và tên sân */}
                                                    <div className="text-2xl mb-2">
                                                        {courtTypes.find((c) => c.id === courtVariantId)?.icon || "🏐"}
                                                    </div>
                                                    <div className="font-bold text-gray-800 mb-1">
                                                        {court.courtName || "Sân không tên"}
                                                    </div>

                                                    {/* Trạng thái */}
                                                    <div
                                                        className={`text-xs mt-1 font-medium ${
                                                            isAvailable
                                                                ? "text-green-600"
                                                                : isPartiallyBooked
                                                                    ? "text-orange-600"
                                                                    : "text-red-600"
                                                        }`}
                                                    >
                                                        {isAvailable
                                                            ? "Trống hoàn toàn"
                                                            : isPartiallyBooked
                                                                ? `Đã đặt ${court.bookedTimes.length} giờ`
                                                                : getStatusLabel(court.status)}
                                                    </div>

                                                    {/* Nút chức năng */}
                                                    <div className="mt-4 flex flex-col gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedCourtId(court.courtId);
                                                                setShowCourtDetailModal(true);
                                                            }}
                                                            className="w-full bg-indigo-100 text-indigo-700 text-xs py-2 rounded-lg hover:bg-indigo-200 font-semibold"
                                                        >
                                                            Xem giờ đã đặt
                                                        </button>

                                                        {(isAvailable || isPartiallyBooked) && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedCourtId(court.courtId);
                                                                    setShowBookingTimeModal(true);
                                                                }}
                                                                className="w-full bg-indigo-600 text-white text-xs py-2 rounded-lg hover:bg-indigo-700 font-semibold"
                                                            >
                                                                Chọn giờ trống
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => navigate("/booking")}
                                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
                            >
                                ⬅️ Quay lại Chọn Loại Sân
                            </button>
                            <CourtDetailModal
                                isOpen={showCourtDetailModal}
                                onClose={() => setShowCourtDetailModal(false)}
                                selectedCourtId={selectedCourtId}
                                availableCourts={availableCourts}
                            />
                            <BookingTimeModal
                                isOpen={showBookingTimeModal}
                                onClose={() => setShowBookingTimeModal(false)}
                                courtId={selectedCourtId}
                                courtName={availableCourts.find(c => c.courtId === selectedCourtId)?.courtName}
                                date={values.date}
                                variantId={courtVariantId}
                                onConfirm={handleBooking}
                                bookedTimes={
                                    availableCourts.find(c => c.courtId === selectedCourtId)?.bookedTimes || []
                                }
                            />
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}