// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";
// import axios from "axios";
// import {createBooking, getPrice} from "../../../service/user/booking/bookingApi";
//
// const START_TIMES = [];
// for (let h = 5; h <= 21; h++) {
//     START_TIMES.push(`${h.toString().padStart(2, "0")}:30:00`);
// }
//
//
// export default function BookingTimeModal({
//                                              isOpen,
//                                              onClose,
//                                              courtId,
//                                              courtName,
//                                              date,
//                                              variantId,
//                                              bookedTimes = [],
//                                          }) {
//     const [selectedSlots, setSelectedSlots] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const navigate = useNavigate();
//     const [stompClient, setStompClient] = useState(null);
//     const [lockedSlots, setLockedSlots] = useState([]);
//     const [prices, setPrices] = useState({});
//
//     // ====== 1️⃣ Lấy danh sách slot đang giữ trong temp_booking ======
//     const fetchLockedSlots = async () => {
//         if (!courtId || !date) return;
//         try {
//             const res = await axios.get(
//                 `http://localhost:8080/api/v1/booking/temp-booking/locked?courtId=${courtId}&date=${date}`
//             );
//             setLockedSlots(res.data || []);
//         } catch (err) {
//             console.error("Lỗi khi lấy locked slots:", err);
//         }
//     };
//
//     // ====== 2️⃣ Kết nối WebSocket ======
//     useEffect(() => {
//         const client = new Client({
//             webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
//             reconnectDelay: 5000,
//             debug: (str) => console.log(str),
//         });
//
//         client.onConnect = () => {
//             console.log("Connected to WebSocket");
//             setStompClient(client);
//
//             // Nhận sự kiện lock/unlock realtime
//             client.subscribe(`/topic/court/${courtId}`, (message) => {
//                 const data = JSON.parse(message.body);
//                 if (data.date !== date) return;
//
//                 if (data.action === "LOCK") {
//                     setLockedSlots((prev) => {
//                         const combined = [...prev, ...data.slots];
//                         // Loại bỏ trùng theo startTime + endTime
//                         const unique = combined.filter(
//                             (slot, index, self) =>
//                                 index === self.findIndex(
//                                     (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
//                                 )
//                         );
//                         return unique;
//                     });
//                 } else if (data.action === "UNLOCK") {
//                     setLockedSlots((prev) =>
//                         prev.filter(
//                             (s) =>
//                                 !data.slots.some(
//                                     (us) => us.startTime === s.startTime && us.endTime === s.endTime
//                                 )
//                         )
//                     );
//                 }
//
//             });
//         };
//         fetchLockedSlots().then();
//
//         client.onStompError = (frame) => {
//             console.error("STOMP error:", frame);
//         };
//
//         client.activate();
//         return () => {
//             if (client) client.deactivate();
//         };
//     }, [courtId, date]);
//
//     // ====== 3️⃣ Khi mở modal, tải lockedSlots và prices hiện tại ======
//     useEffect(() => {
//         if (isOpen) {
//             const fetchAll = async () => {
//                 await fetchLockedSlots();
//                 const priceMap = {};
//                 for (const time of START_TIMES) {
//                     const [h, m] = time.split(":").slice(0, 2);
//                     const startTime = `${h.padStart(2, "0")}:${m}:00`;
//                     const endTime = `${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:${m}:00`;
//                     try {
//                         const priceData = await getPrice({
//                             variantId,
//                             date,
//                             startTime,
//                             endTime,
//                         });
//                         priceMap[startTime] = priceData;
//                     } catch (e) {
//                         console.error(`Lỗi lấy giá cho ${startTime}:`, e);
//                         priceMap[startTime] = 0;
//                     }
//                 }
//                 setPrices(priceMap);
//             };
//             fetchAll();
//         } else {
//             setSelectedSlots([]);
//             setPrices({});
//         }
//     }, [isOpen, courtId, date, variantId]);
//
//     // ====== 4️⃣ Hàm kiểm tra khung giờ ======
//     const isTimeOverlap = (slot, target) => {
//         const toDate = (t) => {
//             const [h, m, s = 0] = t.split(":").map(Number);
//             return new Date(2000, 0, 1, h, m, s);
//         };
//         const startA = toDate(slot.startTime);
//         const endA = toDate(slot.endTime);
//         const startB = toDate(target.startTime);
//         const endB = toDate(target.endTime);
//         return startA < endB && endA > startB;
//     };
//
//
//     const isBooked = (startTimeStr) => {
//         const [h, m] = startTimeStr.split(":").slice(0, 2);
//         const slot = {
//             startTime: `${h}:${m}:00`,
//             endTime: `${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:${m}:00`,
//         };
//         return bookedTimes.some((b) => isTimeOverlap(b, slot));
//     };
//
//     const isLocked = (startTimeStr) => {
//         const [h, m] = startTimeStr.split(":").slice(0, 2);
//         const slot = {
//             startTime: `${h}:${m}:00`,
//             endTime: `${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:${m}:00`,
//         };
//         return lockedSlots.some((l) => isTimeOverlap(l, slot));
//     };
//
//     const isPastTime = (startTimeStr) => {
//         const now = new Date();
//         const selectedDate = new Date(date);
//         if (selectedDate.toDateString() !== now.toDateString()) return false;
//
//         const [hour, minute] = startTimeStr.split(":").slice(0, 2).map(Number);
//         const slotStart = new Date(selectedDate);
//         slotStart.setHours(hour, minute, 0, 0);
//         return slotStart < now;
//     };
//
//     // ====== 5️⃣ Chọn hoặc bỏ chọn khung giờ ======
//     const toggleSlot = (startTimeStr) => {
//         if (isBooked(startTimeStr)) {
//             toast.error(`Khung giờ ${startTimeStr.slice(0, 5)} đã có người đặt!`);
//             return;
//         }
//         if (isLocked(startTimeStr)) {
//             toast.error(`Khung giờ ${startTimeStr.slice(0, 5)} đang được người khác giữ chỗ!`);
//             return;
//         }
//         if (isPastTime(startTimeStr)) {
//             toast("Không thể chọn khung giờ đã qua!", { icon: "⏰" });
//             return;
//         }
//
//         const [h, m] = startTimeStr.split(":").slice(0, 2);
//         const slot = {
//             startTime: `${h}:${m}:00`,
//             endTime: `${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:${m}:00`,
//         };
//
//         setSelectedSlots((prev) =>
//             prev.some((s) => s.startTime === slot.startTime)
//                 ? prev.filter((s) => s.startTime !== slot.startTime)
//                 : [...prev, slot]
//         );
//     };
//
//     // ====== 6️⃣ Tính tổng tiền ======
//     useEffect(() => {
//         let total = 0;
//         selectedSlots.forEach((s) => {
//             total += prices[s.startTime] || 0;
//         });
//         setTotalPrice(total);
//     }, [selectedSlots, prices]);
//
//     // ====== 7️⃣ Gửi yêu cầu đặt sân ======
//     const handleConfirm = async () => {
//         if (selectedSlots.length === 0) {
//             toast("Vui lòng chọn ít nhất 1 khung giờ!", { icon: "⚠️" });
//             return;
//         }
//
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 toast.error("Bạn cần đăng nhập trước khi đặt sân!");
//                 navigate("/login");
//                 return;
//             }
//
//             const payload = {
//                 courtId,
//                 bookingTypeId: 1,  // Fixed to 1 for HOURLY, ignore variantId
//                 specificDate: date,
//                 timeSlots: selectedSlots.map((s) => ({
//                     startTime: s.startTime,
//                     endTime: s.endTime,
//                 })),
//             };
//
//             toast.loading("Đang giữ chỗ và tạo giao dịch...", { id: "booking" });
//             const url = await createBooking(payload);
//             toast.success("Chuyển hướng đến VNPAY...", { id: "booking" });
//
//             setTimeout(() => {
//                 window.location.href = url;
//             }, 800);
//         } catch (e) {
//             toast.error("Lỗi đặt sân: " + e.message, { id: "booking" });
//             console.error("Booking error:", e);
//         }
//     };
//
//     // ====== 8️⃣ Giao diện ======
//     if (!isOpen) return null;
//
//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
//                 <div className="p-6 border-b sticky top-0 bg-white z-10">
//                     <h2 className="text-2xl font-bold text-center">Chọn giờ - {courtName}</h2>
//                     <p className="text-center text-gray-600">Ngày: {date}</p>
//                 </div>
//
//                 <div className="p-6">
//                     <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 text-sm">
//                         {START_TIMES.map((time) => {
//                             const booked = isBooked(time);
//                             const locked = isLocked(time);
//                             const past = isPastTime(time);
//                             const selected = selectedSlots.some(
//                                 (s) => s.startTime === time
//                             );
//                             const disabled = booked || locked || past;
//
//                             return (
//                                 <button
//                                     key={time}
//                                     onClick={() => toggleSlot(time)}
//                                     disabled={disabled}
//                                     className={`p-3 rounded-lg text-center font-medium transition-all relative ${
//                                         booked
//                                             ? "bg-red-200 text-red-700 cursor-not-allowed line-through"
//                                             : locked
//                                                 ? "bg-yellow-200 text-yellow-700 cursor-not-allowed"
//                                                 : past
//                                                     ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60"
//                                                     : selected
//                                                         ? "bg-green-500 text-white shadow-md ring-2 ring-green-600"
//                                                         : "bg-gray-100 hover:bg-green-200 hover:shadow"
//                                     }`}
//                                 >
//                                     {/*<div>{time}</div>*/}
//                                     <div>{time.slice(0,5)}</div>
//                                     <div className="text-xs opacity-75">
//                                         → {(parseInt(time.split(":")[0]) + 1).toString().padStart(2, "0")}
//                                         :30
//                                     </div>
//
//                                     {booked && (
//                                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                       <span className="text-xs font-bold text-red-700 bg-white px-1 rounded">
//                         ĐÃ ĐẶT
//                       </span>
//                                         </div>
//                                     )}
//                                     {locked && !booked && (
//                                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                       <span className="text-xs font-bold text-yellow-700 bg-white px-1 rounded">
//                         ĐANG GIỮ
//                       </span>
//                                         </div>
//                                     )}
//                                     {past && !booked && !locked && (
//                                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                       <span className="text-xs font-bold text-gray-600 bg-white px-1 rounded">
//                         QUÁ GIỜ
//                       </span>
//                                         </div>
//                                     )}
//                                 </button>
//                             );
//                         })}
//                     </div>
//
//                     <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border">
//                         <p className="font-bold text-lg">Đã chọn: {selectedSlots.length} khung giờ</p>
//                         <p className="text-xl font-bold text-indigo-700 mt-1">
//                             Tổng: {totalPrice.toLocaleString()}đ
//                         </p>
//
//                         {selectedSlots.length > 0 && (
//                             <div className="mt-3 text-sm text-gray-600 space-y-1">
//                                 {selectedSlots.map((s, i) => (
//                                     <div key={i} className="flex justify-between">
//                     <span>
//                       {s.startTime.slice(0, 5)} → {s.endTime.slice(0, 5)}
//                     </span>
//                                         <span className="text-green-600">{(prices[s.startTime] || 0).toLocaleString()}đ</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//
//                     <div className="flex gap-3 mt-6">
//                         <button
//                             onClick={onClose}
//                             className="flex-1 py-3 bg-gray-200 rounded-xl font-bold hover:bg-gray-300 transition"
//                         >
//                             Hủy
//                         </button>
//                         <button
//                             onClick={handleConfirm}
//                             disabled={selectedSlots.length === 0}
//                             className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition"
//                         >
//                             Thanh toán {totalPrice.toLocaleString()}đ
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { createBooking, getPrice } from "../../../service/user/booking/bookingApi";

const START_TIMES = [];
for (let h = 5; h <= 21; h++) {
    START_TIMES.push(`${h.toString().padStart(2, "0")}:30:00`);
}

export default function BookingTimeModal({
                                             isOpen,
                                             onClose,
                                             courtId,
                                             courtName,
                                             date,
                                             variantId,
                                             bookedTimes = [],
                                         }) {
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const [stompClient, setStompClient] = useState(null);
    const [lockedSlots, setLockedSlots] = useState([]);
    const [prices, setPrices] = useState({});
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);



    // ====== 1️⃣ Lấy danh sách slot đang giữ trong temp_booking ======
    const fetchLockedSlots = async () => {
        if (!courtId || !date) return;
        try {
            const res = await axios.get(
                `http://localhost:8080/api/v1/booking/temp-booking/locked?courtId=${courtId}&date=${date}`
            );
            setLockedSlots(res.data || []);
        } catch (err) {
            console.error("Lỗi khi lấy locked slots:", err);
        }
    };

    // ====== 2️⃣ Kết nối WebSocket ======
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket");
            setStompClient(client);

            client.subscribe(`/topic/court/${courtId}`, (message) => {
                const data = JSON.parse(message.body);
                if (data.date !== date) return;

                if (data.action === "LOCK") {
                    setLockedSlots((prev) => {
                        const combined = [...prev, ...data.slots];
                        const unique = combined.filter(
                            (slot, index, self) =>
                                index === self.findIndex(
                                    (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
                                )
                        );
                        return unique;
                    });
                } else if (data.action === "UNLOCK") {
                    setLockedSlots((prev) =>
                        prev.filter(
                            (s) =>
                                !data.slots.some(
                                    (us) => us.startTime === s.startTime && us.endTime === s.endTime
                                )
                        )
                    );
                }
            });
        };
        fetchLockedSlots();

        client.onStompError = (frame) => {
            console.error("STOMP error:", frame);
        };

        client.activate();
        return () => {
            if (client) client.deactivate();
        };
    }, [courtId, date]);

    // ====== 3️⃣ Khi mở modal, tải lockedSlots và prices hiện tại ======
    useEffect(() => {
        if (isOpen) {
            const fetchAll = async () => {
                await fetchLockedSlots();
                const priceMap = {};
                for (const time of START_TIMES) {
                    const [h, m] = time.split(":").slice(0, 2);
                    const startTime = `${h.padStart(2, "0")}:${m}:00`;
                    const endTime = `${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:${m}:00`;
                    try {
                        const priceData = await getPrice({
                            variantId,
                            date,
                            startTime,
                            endTime,
                        });
                        priceMap[startTime] = priceData;
                    } catch (e) {
                        console.error(`Lỗi lấy giá cho ${startTime}:`, e);
                        priceMap[startTime] = 0;
                    }
                }
                setPrices(priceMap);
            };
            fetchAll();
        } else {
            setSelectedSlots([]);
            setPrices({});
        }
    }, [isOpen, courtId, date, variantId]);

    // ====== 4️⃣ Hàm kiểm tra khung giờ ======
    const isTimeOverlap = (slot, target) => {
        const toDate = (t) => {
            const [h, m, s = 0] = t.split(":").map(Number);
            return new Date(2000, 0, 1, h, m, s);
        };
        const startA = toDate(slot.startTime);
        const endA = toDate(slot.endTime);
        const startB = toDate(target.startTime);
        const endB = toDate(target.endTime);
        return startA < endB && endA > startB;
    };

    const isBooked = (startTimeStr) => {
        const [h, m] = startTimeStr.split(":").slice(0, 2);
        const slot = {
            startTime: `${h}:${m}:00`,
            endTime: `${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:${m}:00`,
        };
        return bookedTimes.some((b) => isTimeOverlap(b, slot));
    };

    const isLocked = (startTimeStr) => {
        const [h, m] = startTimeStr.split(":").slice(0, 2);
        const slot = {
            startTime: `${h}:${m}:00`,
            endTime: `${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:${m}:00`,
        };
        return lockedSlots.some((l) => isTimeOverlap(l, slot));
    };

    const isPastTime = (startTimeStr) => {
        const now = new Date();
        const selectedDate = new Date(date);
        if (selectedDate.toDateString() !== now.toDateString()) return false;

        const [hour, minute] = startTimeStr.split(":").slice(0, 2).map(Number);
        const slotStart = new Date(selectedDate);
        slotStart.setHours(hour, minute, 0, 0);
        return slotStart < now;
    };

    // ====== Chọn hoặc bỏ chọn khung giờ ======
    const toggleSlot = (startTimeStr) => {
        if (isBooked(startTimeStr)) {
            toast.error(`Khung giờ ${startTimeStr.slice(0, 5)} đã có người đặt!`);
            return;
        }
        if (isLocked(startTimeStr)) {
            toast.error(`Khung giờ ${startTimeStr.slice(0, 5)} đang được người khác giữ chỗ!`);
            return;
        }
        if (isPastTime(startTimeStr)) {
            toast("Không thể chọn khung giờ đã qua!", { icon: "⏰" });
            return;
        }

        const [h, m] = startTimeStr.split(":").slice(0, 2);
        const slot = {
            startTime: `${h}:${m}:00`,
            endTime: `${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:${m}:00`,
        };

        setSelectedSlots((prev) =>
            prev.some((s) => s.startTime === slot.startTime)
                ? prev.filter((s) => s.startTime !== slot.startTime)
                : [...prev, slot]
        );
    };

    // ====== 6️⃣ Tính tổng tiền ======
    useEffect(() => {
        let total = 0;
        selectedSlots.forEach((s) => {
            total += prices[s.startTime] || 0;
        });
        setTotalPrice(total);
    }, [selectedSlots, prices]);

    // ====== 7️⃣ Xử lý thanh toán ======
    const handlePaymentMethod = async (method) => {
        setPaymentModalOpen(false);

        if (selectedSlots.length === 0) {
            toast("Vui lòng chọn ít nhất 1 khung giờ!", { icon: "⚠️" });
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Bạn cần đăng nhập trước khi đặt sân!");
                navigate("/login");
                return;
            }

            const payload = {
                courtId,
                bookingTypeId: 1,
                specificDate: date,
                timeSlots: selectedSlots.map((s) => ({ startTime: s.startTime, endTime: s.endTime })),
            };

            toast.loading("Đang giữ chỗ và tạo giao dịch...", { id: "booking" });

            if (method === "vnpay") {
                const url = await createBooking(payload);
                toast.success("Chuyển hướng đến VNPay...", { id: "booking" });
                setTimeout(() => window.location.href = url, 500);
            } else if (method === "qr") {
                // Lưu payload vào localStorage hoặc query param để page /qr sử dụng
                localStorage.setItem("bookingQrPayload", JSON.stringify(payload));
                toast.success("Chuyển hướng tạo QR...", { id: "booking" });
                navigate("/qr");
            }
        } catch (err) {
            toast.error("Lỗi tạo giao dịch: " + err.message, { id: "booking" });
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-center">Chọn giờ - {courtName}</h2>
                    <p className="text-center text-gray-600">Ngày: {date}</p>
                </div>

                <div className="p-6">
                    {/* Grid khung giờ */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 text-sm">
                        {START_TIMES.map((time) => {
                            const booked = isBooked(time);
                            const locked = isLocked(time);
                            const past = isPastTime(time);
                            const selected = selectedSlots.some((s) => s.startTime === time);
                            const disabled = booked || locked || past;

                            return (
                                <button
                                    key={time}
                                    onClick={() => toggleSlot(time)}
                                    disabled={disabled}
                                    className={`p-3 rounded-lg text-center font-medium transition-all relative ${
                                        booked
                                            ? "bg-red-200 text-red-700 cursor-not-allowed line-through"
                                            : locked
                                                ? "bg-yellow-200 text-yellow-700 cursor-not-allowed"
                                                : past
                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60"
                                                    : selected
                                                        ? "bg-green-500 text-white shadow-md ring-2 ring-green-600"
                                                        : "bg-gray-100 hover:bg-green-200 hover:shadow"
                                    }`}
                                >
                                    <div>{time.slice(0, 5)}</div>
                                    <div className="text-xs opacity-75">
                                        → {(parseInt(time.split(":")[0]) + 1).toString().padStart(2, "0")}:30
                                    </div>

                                    {booked && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-red-700 bg-white px-1 rounded">
                        ĐÃ ĐẶT
                      </span>
                                        </div>
                                    )}
                                    {locked && !booked && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-yellow-700 bg-white px-1 rounded">
                        ĐANG GIỮ
                      </span>
                                        </div>
                                    )}
                                    {past && !booked && !locked && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-gray-600 bg-white px-1 rounded">
                        QUÁ GIỜ
                      </span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tổng tiền */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border">
                        <p className="font-bold text-lg">Đã chọn: {selectedSlots.length} khung giờ</p>
                        <p className="text-xl font-bold text-indigo-700 mt-1">
                            Tổng: {totalPrice.toLocaleString()}đ
                        </p>

                        {selectedSlots.length > 0 && (
                            <div className="mt-3 text-sm text-gray-600 space-y-1">
                                {selectedSlots.map((s, i) => (
                                    <div key={i} className="flex justify-between">
                    <span>
                      {s.startTime.slice(0, 5)} → {s.endTime.slice(0, 5)}
                    </span>
                                        <span className="text-green-600">{(prices[s.startTime] || 0).toLocaleString()}đ</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Nút hủy và thanh toán */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-200 rounded-xl font-bold hover:bg-gray-300 transition"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={() => setPaymentModalOpen(true)}
                            disabled={selectedSlots.length === 0}
                            className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition"
                        >
                            Thanh toán {totalPrice.toLocaleString()}đ
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal chọn phương thức thanh toán */}
            {paymentModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Chọn phương thức thanh toán</h3>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handlePaymentMethod("vnpay")}
                                className="py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                            >
                                Thanh toán VNPay
                            </button>
                            <button
                                onClick={() => handlePaymentMethod("qr")}
                                className="py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
                            >
                                Thanh toán bằng QR
                            </button>
                            <button
                                onClick={() => setPaymentModalOpen(false)}
                                className="py-3 bg-gray-200 rounded-xl font-bold hover:bg-gray-300 transition"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
