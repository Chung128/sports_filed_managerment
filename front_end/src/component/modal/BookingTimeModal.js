import { createBooking } from "../../service/booking/bookingApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const START_TIMES = [];
for (let h = 5; h <= 21; h++) {
    START_TIMES.push(`${h.toString().padStart(2, "0")}:30`);
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

    // ====== WebSocket ======
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
                if (data.date === date) {
                    if (data.action === "LOCK") {
                        setLockedSlots((prev) => [...prev, ...data.slots]);
                    } else if (data.action === "UNLOCK" && Array.isArray(data.slots)) {
                        setLockedSlots((prev) =>
                            prev.filter(
                                (s) => !data.slots.some((us) => us.startTime === s.startTime)
                            )
                        );
                    }
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("STOMP error:", frame);
        };

        client.activate();
        return () => {
            if (client) client.deactivate();
        };
    }, [courtId, date]);

    // ====== Kiểm tra khung giờ ======
    const isTimeOverlap = (slot, target) =>
        slot.startTime < target.endTime && slot.endTime > target.startTime;

    const isBooked = (startTimeStr) => {
        const [h, m] = startTimeStr.split(":");
        const slot = {
            startTime: `${h}:${m}:00`,
            endTime: `${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:${m}:00`,
        };
        return bookedTimes.some((b) => isTimeOverlap(b, slot));
    };

    const isLocked = (startTimeStr) => {
        const [h, m] = startTimeStr.split(":");
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

        const [hour, minute] = startTimeStr.split(":").map(Number);
        const slotStart = new Date(selectedDate);
        slotStart.setHours(hour, minute, 0, 0);
        return slotStart < now;
    };

    // ====== Chọn hoặc bỏ chọn khung giờ ======
    const toggleSlot = (startTimeStr) => {
        if (isBooked(startTimeStr)) {
            toast.error(`Khung giờ ${startTimeStr} → ${(
                parseInt(startTimeStr.split(":")[0]) + 1
            )
                .toString()
                .padStart(2, "0")}:30 đã có người đặt!`);
            return;
        }

        if (isLocked(startTimeStr)) {
            toast.error(`Khung giờ ${startTimeStr} đang được người khác giữ chỗ!`);
            return;
        }

        if (isPastTime(startTimeStr)) {
            toast("Không thể chọn khung giờ đã qua!", { icon: "⏰" });
            return;
        }

        const [h, m] = startTimeStr.split(":");
        const start = `${h}:${m}:00`;
        const endH = (parseInt(h, 10) + 1).toString().padStart(2, "0");
        const end = `${endH}:${m}:00`;

        const slot = { startTime: start, endTime: end };
        setSelectedSlots((prev) =>
            prev.some((s) => s.startTime === start)
                ? prev.filter((s) => s.startTime !== start)
                : [...prev, slot]
        );
    };

    // ====== Tính tổng tiền ======
    useEffect(() => {
        setTotalPrice(selectedSlots.length * 300000);
    }, [selectedSlots]);

    // ====== Gửi yêu cầu đặt sân ======
    const handleConfirm = async () => {
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
                bookingTypeId: variantId,
                specificDate: date,
                timeSlots: selectedSlots.map((slot) => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                })),
            };

            toast.loading("Đang tạo đơn đặt sân...", { id: "booking" });
            const url = await createBooking(payload);
            toast.success("Chuyển hướng đến VNPAY...", { id: "booking" });

            setTimeout(() => {
                window.location.href = url;
            }, 800);
        } catch (e) {
            toast.error("Lỗi đặt sân: " + e.message, { id: "booking" });
            console.error("Booking error:", e);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
                        {/* Header */}
                        <div className="p-6 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-center">
                                Chọn giờ - {courtName}
                            </h2>
                            <p className="text-center text-gray-600">Ngày: {date}</p>
                        </div>

                        {/* Time slots */}
                        <div className="p-6">
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 text-sm">
                                {START_TIMES.map((time) => {
                                    const booked = isBooked(time);
                                    const locked = isLocked(time);
                                    const past = isPastTime(time);
                                    const selected = selectedSlots.some(
                                        (s) => s.startTime === time + ":00"
                                    );
                                    const disabled = booked || locked || past;

                                    return (
                                        <button
                                            key={time}
                                            onClick={() => toggleSlot(time)}
                                            disabled={disabled}
                                            className={`p-3 rounded-lg text-center font-medium transition-all relative
                        ${
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
                                            <div>{time}</div>
                                            <div className="text-xs opacity-75">
                                                →{" "}
                                                {(parseInt(time.split(":")[0]) + 1)
                                                    .toString()
                                                    .padStart(2, "0")}
                                                :30
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

                            {/* Summary */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border">
                                <p className="font-bold text-lg">
                                    Đã chọn: {selectedSlots.length} khung giờ
                                </p>
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
                                                <span className="text-green-600">300.000đ</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-gray-200 rounded-xl font-bold hover:bg-gray-300 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={selectedSlots.length === 0}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Thanh toán {totalPrice.toLocaleString()}đ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}