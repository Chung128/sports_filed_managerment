import React, { useState } from "react";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
} from "lucide-react";
import { fields, bookings, timeSlots } from "../../../service/admin/data";


const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState("2024-12-21");
    const [selectedField, setSelectedField] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const changeDate = (days) => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + days);
        setSelectedDate(currentDate.toISOString().split("T")[0]);
    };

    const getBookingForSlot = (fieldId, time) => {
        return bookings.find(
            (b) =>
                b.fieldId === fieldId &&
                b.date === selectedDate &&
                b.startTime === time
        );
    };

    const isTimeSlotBooked = (fieldId, time) => {
        return bookings.some(
            (b) =>
                b.fieldId === fieldId &&
                b.date === selectedDate &&
                time >= b.startTime &&
                time < b.endTime
        );
    };

    const filteredFields = selectedField
        ? fields.filter((f) => f.id === selectedField)
        : fields;
    const dayBookings = bookings.filter((b) => b.date === selectedDate);

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between sticky top-0 z-10 border-b bg-white px-6 py-4 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Lịch Đặt Sân
                    </h1>
                    <p className="text-sm text-gray-500">
                        Xem lịch đặt sân theo ngày và khung giờ
                    </p>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Bộ chọn ngày */}
                    <div className="bg-white shadow-md rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CalendarIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {formatDate(selectedDate)}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {dayBookings.length} đơn đặt sân
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => changeDate(-1)}
                                    className="p-2 border rounded-lg hover:bg-green-50 border-gray-300"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() =>
                                        setSelectedDate(new Date().toISOString().split("T")[0])
                                    }
                                    className="px-3 py-2 border rounded-lg hover:bg-green-50 border-gray-300"
                                >
                                    Hôm nay
                                </button>
                                <button
                                    onClick={() => changeDate(1)}
                                    className="p-2 border rounded-lg hover:bg-green-50 border-gray-300"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bộ lọc sân */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedField(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                selectedField === null
                                    ? "bg-green-600 text-white border-green-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
                            }`}
                        >
                            Tất cả sân
                        </button>
                        {fields.map((field) => (
                            <button
                                key={field.id}
                                onClick={() => setSelectedField(field.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                    selectedField === field.id
                                        ? "bg-green-600 text-white border-green-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
                                }`}
                            >
                                {field.name}
                            </button>
                        ))}
                    </div>

                    {/* Bảng lịch đặt */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b px-6 py-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-green-600" />
                                Lịch Đặt Sân Chi Tiết
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                                        Giờ
                                    </th>
                                    {filteredFields.map((field) => (
                                        <th
                                            key={field.id}
                                            className="px-4 py-3 text-center text-sm font-semibold text-gray-700 min-w-[200px]"
                                        >
                                            <div>{field.name}</div>
                                            <div className="text-xs text-gray-500 font-normal">
                                                {field.type}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {timeSlots.map((time, index) => (
                                    <tr
                                        key={time}
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-inherit z-10">
                                            {time}
                                        </td>
                                        {filteredFields.map((field) => {
                                            const booking = getBookingForSlot(field.id, time);
                                            const isBooked = isTimeSlotBooked(field.id, time);

                                            return (
                                                <td key={field.id} className="px-2 py-2 text-center">
                                                    {booking ? (
                                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                                                            <div className="font-semibold text-sm">
                                                                {booking.userName}
                                                            </div>
                                                            <div className="text-xs opacity-90 mt-1">
                                                                {booking.userPhone}
                                                            </div>
                                                            <div className="text-xs opacity-90 mt-1">
                                                                {booking.timeSlot}
                                                            </div>
                                                            <div className="mt-2 inline-block bg-white/20 px-2 py-1 rounded-md text-xs">
                                                                {booking.status === "confirmed"
                                                                    ? "Đã xác nhận"
                                                                    : "Hoàn thành"}
                                                            </div>
                                                        </div>
                                                    ) : isBooked ? (
                                                        <div className="bg-gray-200 p-3 rounded-lg text-xs text-gray-600">
                                                            Đang sử dụng
                                                        </div>
                                                    ) : (
                                                        <div className="border-2 border-dashed border-gray-200 p-3 rounded-lg text-xs text-gray-400 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                                                            Trống
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Chú thích màu */}
                    <div className="bg-white shadow-md rounded-xl p-4">
                        <div className="flex items-center gap-6 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
                                <span className="text-sm text-gray-600">Đã đặt</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                <span className="text-sm text-gray-600">Đang sử dụng</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-dashed border-gray-300 rounded"></div>
                                <span className="text-sm text-gray-600">Còn trống</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Schedule;
