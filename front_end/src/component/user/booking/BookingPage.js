// import React, { useState } from "react";
// import axios from "axios";
// import * as Yup from "yup";
// import BookingModal from "../modal/BookingModal";
//
// export default function BookingPage() {
//     const [availableCourts, setAvailableCourts] = useState([]);
//     const [selectedCourtId, setSelectedCourtId] = useState(null);
//     const [price, setPrice] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedVariantId, setSelectedVariantId] = useState(null);
//     const API_BASE = "http://localhost:8080/api/v1/booking";
//
//     // Validation schema using Yup
//     const validationSchema = Yup.object({
//         variantId: Yup.number()
//             .required("Vui lòng chọn loại sân.")
//             .oneOf([1, 2, 3, 4, 5], "Loại sân không hợp lệ."),
//         date: Yup.string()
//             .required("Vui lòng chọn ngày.")
//             .matches(/^\d{4}-\d{2}-\d{2}$/, "Ngày không đúng định dạng (YYYY-MM-DD).")
//             .test("is-not-past", "Ngày không được nhỏ hơn ngày hiện tại.", function (value) {
//                 if (!value) return true;
//                 const selectedDate = new Date(value);
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0);
//                 return selectedDate.getTime() >= today.getTime();
//             }),
//         startTime: Yup.string()
//             .required("Vui lòng chọn giờ bắt đầu.")
//             .matches(/^\d{2}:\d{2}$/, "Giờ bắt đầu không đúng định dạng (HH:MM).")
//             .test("is-not-past", "Thời gian bắt đầu không được nhỏ hơn hiện tại.", function (value) {
//                 const { date } = this.parent;
//                 if (!date || !value) return true;
//                 const [hours, minutes] = value.split(":").map(Number);
//                 const selectedDateTime = new Date(date);
//                 selectedDateTime.setHours(hours, minutes, 0, 0);
//                 return selectedDateTime.getTime() >= new Date().getTime();
//             }),
//         endTime: Yup.string()
//             .required("Vui lòng chọn giờ kết thúc.")
//             .matches(/^\d{2}:\d{2}$/, "Giờ kết thúc không đúng định dạng (HH:MM).")
//             .test("endTime-after-startTime", "Giờ kết thúc phải sau giờ bắt đầu ít nhất 1 tiếng.", function (value) {
//                 const { startTime } = this.parent;
//                 if (!startTime || !value) return true;
//                 const [startHour, startMinute] = startTime.split(":").map(Number);
//                 const [endHour, endMinute] = value.split(":").map(Number);
//                 const start = new Date();
//                 start.setHours(startHour, startMinute, 0, 0);
//                 const end = new Date();
//                 end.setHours(endHour, endMinute, 0, 0);
//                 const diffMinutes = (end - start) / (1000 * 60);
//                 return diffMinutes >= 60;
//             }),
//     });
//
//     // Hàm map trạng thái sân
//     const mapCourtStatus = (status) => {
//         console.log("Mapping status:", status); // Debug
//         if (["AVAILABLE", "BOOKED_OR_IN_USE", "MAINTENANCE", "OUT_OF_SERVICE"].includes(status)) {
//             return status;
//         }
//         return "UNKNOWN";
//     };
//
//     // Gọi API kiểm tra sân trống
//     const handleCheckAvailability = async (values, setFieldError) => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`${API_BASE}/availability`, {
//                 params: {
//                     variantId: values.variantId,
//                     date: values.date,
//                     startTime: values.startTime,
//                     endTime: values.endTime,
//                 },
//             });
//             console.log("API response:", res.data); // Debug
//             const mappedCourts = res.data.map((c) => ({
//                 id: c.courtId,
//                 name: c.courtName,
//                 status: mapCourtStatus(c.status),
//                 startTime: c.startTime,
//                 endTime: c.endTime,
//             }));
//             setAvailableCourts(mappedCourts);
//             setMessage("");
//         } catch (e) {
//             console.error("❌ Lỗi khi tải danh sách sân:", e);
//             setFieldError("general", "Lỗi khi tải danh sách sân!");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Tính giá
//     const handleGetPrice = async (values, setFieldError) => {
//         try {
//             const res = await axios.get(`${API_BASE}/price`, {
//                 params: {
//                     variantId: values.variantId,
//                     date: values.date,
//                     startTime: values.startTime,
//                     endTime: values.endTime,
//                 },
//             });
//             setPrice(res.data);
//         } catch (e) {
//             setMessage("Lỗi khi tính giá!");
//             setFieldError("general", "Lỗi khi tính giá!");
//         }
//     };
//
//     // Gửi booking
//     const handleBooking = async (values, setFieldError) => {
//         if (!selectedCourtId) {
//             setMessage("Hãy chọn 1 sân để đặt!");
//             setFieldError("general", "Hãy chọn 1 sân để đặt!");
//             return;
//         }
//         try {
//             const bookingRequest = {
//                 courtId: selectedCourtId,
//                 bookingTypeId: 1, // "HOURLY"
//                 date: values.date,
//                 startTime: values.startTime,
//                 endTime: values.endTime,
//             };
//             const res = await axios.post(`${API_BASE}/create`, bookingRequest);
//             setMessage(`✅ Đặt sân thành công! ID: ${res.data.id}`);
//             setIsModalOpen(false);
//             setPrice(null);
//             setSelectedCourtId(null);
//             setAvailableCourts([]);
//         } catch (e) {
//             setMessage("❌ Lỗi khi đặt sân!");
//             setFieldError("general", "Lỗi khi đặt sân!");
//         }
//     };
//
//     const getStatusLabel = (status) => {
//         switch (status) {
//             case "AVAILABLE": return "✅ Sẵn sàng";
//             case "BOOKED_OR_IN_USE": return "🔴 Đã có người đặt";
//             case "MAINTENANCE": return "🛠️ Bảo trì";
//             case "OUT_OF_SERVICE": return "⚠️ Ngưng hoạt động";
//             default: return "❓ Không xác định";
//         }
//     };
//
//     const getCourtType = (variantId) => {
//         switch (variantId) {
//             case 1: return "⚽ Bóng đá 5 người";
//             case 2: return "⚽ Bóng đá 6 người";
//             case 3: return "⚽ Bóng đá 7 người";
//             case 4: return "🎾 Tennis";
//             case 5: return "🏓 Pickleball";
//             default: return "Không xác định";
//         }
//     };
//
//     // Danh sách loại sân
//     const courtTypes = [
//         { id: 1, name: "Bóng đá 5 người", icon: "⚽" },
//         { id: 2, name: "Bóng đá 6 người", icon: "⚽" },
//         { id: 3, name: "Bóng đá 7 người", icon: "⚽" },
//         { id: 4, name: "Tennis", icon: "🎾" },
//         { id: 5, name: "Pickleball", icon: "🏓" },
//     ];
//
//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 <header className="text-center mb-12">
//                     <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
//                         Đặt Sân Thể Thao Dễ Dàng 🚀
//                     </h1>
//                     <p className="mt-3 text-xl text-indigo-600 font-medium">
//                         Chọn bộ môn thể thao bạn muốn và đặt ngay!
//                     </p>
//                 </header>
//                 {message && (
//                     <div
//                         className={`p-4 mb-6 rounded-lg text-center font-semibold ${
//                             message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                         } shadow-md`}
//                     >
//                         {message}
//                     </div>
//                 )}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
//                     {courtTypes.map((courtType) => (
//                         <div
//                             key={courtType.id}
//                             onClick={() => {
//                                 setSelectedVariantId(courtType.id);
//                                 setIsModalOpen(true);
//                             }}
//                             className="relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl hover:bg-indigo-50 cursor-pointer border-t-4 border-indigo-400"
//                         >
//               <span className="text-5xl mb-4 p-3 bg-indigo-100 rounded-full shadow-inner">
//                 {courtType.icon || "🏐"}
//               </span>
//                             <h3 className="text-xl font-bold text-gray-800 text-center mt-2">{courtType.name}</h3>
//                             <p className="text-sm text-gray-500 mt-1 text-center">Bấm để đặt sân theo giờ</p>
//                             <div className="mt-4 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-500 rounded-full shadow-lg">
//                                 Đặt Ngay
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <BookingModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 selectedVariantId={selectedVariantId}
//                 courtTypes={courtTypes}
//                 availableCourts={availableCourts}
//                 setAvailableCourts={setAvailableCourts}
//                 selectedCourtId={selectedCourtId}
//                 setSelectedCourtId={setSelectedCourtId}
//                 price={price}
//                 setPrice={setPrice}
//                 loading={loading}
//                 setLoading={setLoading}
//                 message={message}
//                 setMessage={setMessage}
//                 validationSchema={validationSchema}
//                 handleCheckAvailability={handleCheckAvailability}
//                 handleGetPrice={handleGetPrice}
//                 handleBooking={handleBooking}
//                 getCourtType={getCourtType}
//                 getStatusLabel={getStatusLabel}
//             />
//         </div>
//     );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../service/user/login/authApi";
import {getAllCourtTypes} from "../../../service/admin/field_information/fieldApi";
import {getPrice} from "../../../service/user/booking/bookingApi";

export default function BookingPage() {
    const [courtTypes, setCourtTypes] = useState([]); // ✅ Lấy từ BE
    const [courtPrices, setCourtPrices] = useState({});
    const [showPriceDetailsModal, setShowPriceDetailsModal] = useState(null);
    const navigate = useNavigate();

    // ✅ Kiểm tra token hợp lệ
    useEffect(() => {
        const fetchUser = async () => {
            await getCurrentUser(navigate);
        };
        fetchUser();
    }, [navigate]);

    //  Lấy danh sách loại sân từ BE
    useEffect(() => {
        const fetchCourtTypes = async () => {
            try {
                const data = await getAllCourtTypes();
                // Gán icon theo tên sân (giữ nguyên icon cũ)
                const mapped = data.map((type) => {
                    let icon = "🏐";
                    const name = type.name.toLowerCase();
                    if (name.includes("bóng")) icon = "⚽";
                    else if (name.includes("tennis")) icon = "🎾";
                    else if (name.includes("pickle")) icon = "🏓";
                    return { ...type, icon };
                });
                setCourtTypes(mapped);
            } catch (e) {
                console.error("Lỗi khi lấy danh sách loại sân:", e);
                setCourtTypes([]);
            }
        };
        fetchCourtTypes();
    }, []);

    // ✅ Lấy giá theo từng loại sân
    useEffect(() => {
        const fetchPrices = async () => {
            if (courtTypes.length === 0) return;

            const today = new Date().toISOString().split("T")[0];
            const lowPeakTime = { startTime: "13:00", endTime: "14:00" };
            const prices = {};

            for (const courtType of courtTypes) {
                try {
                    const lowPeakPriceWeekday = await getPrice({
                        variantId: courtType.id,
                        date: today,
                        startTime: lowPeakTime.startTime,
                        endTime: lowPeakTime.endTime,
                    });
                    const lowPeakPriceWeekend = await getPrice({
                        variantId: courtType.id,
                        date: "2025-10-19",
                        startTime: lowPeakTime.startTime,
                        endTime: lowPeakTime.endTime,
                    });

                    prices[courtType.id] = {
                        weekdayLowPeak: lowPeakPriceWeekday,
                        weekdayHighPeak: Math.round(lowPeakPriceWeekday * 1.3),
                        weekendLowPeak: lowPeakPriceWeekend,
                        weekendHighPeak: Math.round(lowPeakPriceWeekend * 1.3),
                    };
                } catch (e) {
                    console.error(`Error fetching price for variantId ${courtType.id}:`, e);
                    prices[courtType.id] = {
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
    }, [courtTypes]);

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
                        Chọn bộ môn thể thao bạn muốn và đặt ngay!
                    </p>
                </header>

                {/* ✅ Hiển thị danh sách loại sân */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {courtTypes.map((courtType) => (
                        <div
                            key={courtType.id}
                            onClick={() => navigate(`/booking/${courtType.id}`)}
                            className="relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl hover:bg-indigo-50 cursor-pointer border-t-4 border-indigo-400"
                        >
                            <span className="text-5xl mb-4 p-3 bg-indigo-100 rounded-full shadow-inner">
                                {courtType.icon}
                            </span>
                            <h3 className="text-xl font-bold text-gray-800 text-center mt-2">
                                {courtType.name}
                            </h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePriceDetailsModal(courtType.id);
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
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
                        <div className="text-center border-b pb-4 mb-4 border-indigo-100">
                            <h3 className="text-xl font-extrabold text-indigo-700 tracking-wide">
                                💰 Bảng Giá Chi Tiết
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {courtTypes.find((ct) => ct.id === showPriceDetailsModal)?.name}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                                <h4 className="font-semibold text-lg text-indigo-600 mb-2 border-b border-indigo-300 pb-1">
                                    Thứ Hai - Thứ Sáu
                                </h4>
                                <div className="flex justify-between items-center text-gray-700">
                                    <span className="font-medium">Giờ Thường (6:00 - 15:30)</span>
                                    <span className="font-bold text-lg text-green-600 flex-shrink-0">
                                        {formatPrice(courtPrices[showPriceDetailsModal].weekdayLowPeak)}/giờ
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-700 mt-1">
                                    <span className="font-medium">Giờ Cao Điểm (15:30 - 21:30)</span>
                                    <span className="font-bold text-lg text-red-600 flex-shrink-0">
                                        {formatPrice(courtPrices[showPriceDetailsModal].weekdayHighPeak)}/giờ
                                    </span>
                                </div>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                <h4 className="font-semibold text-lg text-yellow-700 mb-2 border-b border-yellow-300 pb-1">
                                    Cuối Tuần (T7, CN)
                                </h4>
                                <div className="flex justify-between items-center text-gray-700">
                                    <span className="font-medium">Giờ Thường (8:00 - 15:30)</span>
                                    <span className="font-bold text-lg text-green-700 flex-shrink-0">
                                        {formatPrice(courtPrices[showPriceDetailsModal].weekendLowPeak)}/giờ
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-700 mt-1">
                                    <span className="font-medium">Giờ Cao Điểm (15:30 - 21:30)</span>
                                    <span className="font-bold text-lg text-red-700 flex-shrink-0">
                                        {formatPrice(courtPrices[showPriceDetailsModal].weekendHighPeak)}/giờ
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowPriceDetailsModal(null)}
                            className="mt-6 w-full py-3 text-base font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
                        >
                            Tuyệt vời, Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
