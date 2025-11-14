import React, { useState, useEffect } from "react";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    X,
} from "lucide-react";
import { timeSlots } from "../../../service/admin/data";
import {
    getAllCourtTypes,
    getCourtsByVariant,
} from "../../../service/admin/field_information/fieldApi";
import { fetchAllBookings } from "../../../service/user/booking/bookingApi";
const getToday = () => {
    const d = new Date();
    // trả về 'YYYY-MM-DD'
    return d.toISOString().split("T")[0];
};

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState(getToday);
    const [courtTypes, setCourtTypes] = useState([]);
    const [selectedCourtType, setSelectedCourtType] = useState(null);
    const [courts, setCourts] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [modalData, setModalData] = useState(null);

    // ✅ Lấy danh sách loại sân
    useEffect(() => {
        const loadCourtTypes = async () => {
            try {
                const data = await getAllCourtTypes();
                setCourtTypes(data);
            } catch (error) {
                console.error("Lỗi khi tải loại sân:", error);
            }
        };
        loadCourtTypes();
    }, []);

    // ✅ Lấy tất cả sân theo từng loại
    useEffect(() => {
        const loadCourts = async () => {
            try {
                const types = await getAllCourtTypes();
                let allCourts = [];
                for (const type of types) {
                    const data = await getCourtsByVariant(type.id);
                    const mapped = data.map((c) => ({
                        id: c.id.toString(),
                        name: c.name,
                        courtTypeId: type.id,
                        courtTypeName: type.name, //  đảm bảo hiển thị đúng
                    }));
                    allCourts = [...allCourts, ...mapped];
                }
                setCourts(allCourts);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sân:", error);
            }
        };
        loadCourts();
    }, []);

    // ✅ Lấy tất cả booking
    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await fetchAllBookings();
                const mapped = data.map((b) => ({
                    id: b.id,
                    courtId: b.court?.id?.toString(),
                    courtName: b.court?.name,
                    variantName: b.court?.courtVariant?.variantName,
                    userName: b.user?.name,
                    userPhone: b.user?.phone,
                    date: b.specificDate,
                    startTime: b.hourlyStartTime?.substring(0, 5),
                    endTime: b.hourlyEndTime?.substring(0, 5),
                    timeSlot: `${b.hourlyStartTime?.substring(0, 5)} - ${b.hourlyEndTime?.substring(0, 5)}`,
                    status: b.paymentStatus === "PAID" ? "confirmed" : "pending",
                }));

                setBookings(mapped);
            } catch (error) {
                console.error("Lỗi khi tải booking:", error);
            }
        };
        loadBookings();
    }, []);

    //  Đổi ngày
    const changeDate = (days) => {
        const current = new Date(selectedDate);
        current.setDate(current.getDate() + days);
        setSelectedDate(current.toISOString().split("T")[0]);
    };

    //  Format ngày hiển thị
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    //  Lọc danh sách sân theo courtType
    const filteredCourts = selectedCourtType
        ? courts.filter((c) => c.courtTypeId === selectedCourtType)
        : courts;

    //  Lấy booking cho 1 sân và khung giờ
    const getBookingsForSlot = (courtId, time) =>
        bookings.filter(
            (b) =>
                b.courtId === courtId &&
                b.date === selectedDate &&
                time >= b.startTime &&
                time < b.endTime
        );

    //  Mở modal hiển thị tất cả sân đặt trong cùng khung giờ
    const openModalForTimeSlot = (time) => {
        const filtered = bookings.filter(
            (b) =>
                b.date === selectedDate &&
                time >= b.startTime &&
                time < b.endTime &&
                filteredCourts.some((f) => f.id === b.courtId)
        );
        if (filtered.length > 0) {
            setModalData(filtered);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between sticky top-0 z-10 border-b bg-white px-6 py-4 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Lịch Đặt Sân
                    </h1>
                    <p className="text-sm text-gray-500">
                        Xem lịch đặt sân theo ngày và loại sân
                    </p>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Bộ chọn ngày */}
                    <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CalendarIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {formatDate(selectedDate)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {bookings.filter((b) => b.date === selectedDate).length} lượt đặt
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/*  Thêm input chọn ngày */}
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
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

                    {/* Bộ lọc loại sân */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedCourtType(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                selectedCourtType === null
                                    ? "bg-green-600 text-white border-green-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
                            }`}
                        >
                            Tất cả loại sân
                        </button>

                        {courtTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedCourtType(type.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                                    selectedCourtType === type.id
                                        ? "bg-green-600 text-white border-green-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
                                }`}
                            >
                                {type.variantName}
                            </button>
                        ))}

                    </div>

                    {/* Lịch đặt sân */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b px-6 py-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-green-600" />
                                Lịch đặt sân chi tiết
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                                        Giờ
                                    </th>
                                    {filteredCourts.map((court) => (
                                        <th
                                            key={court.id}
                                            className="px-4 py-3 text-center text-sm font-semibold text-gray-700 min-w-[200px]"
                                        >
                                            <div>{court.name}</div>
                                            <div className="text-xs text-gray-500 font-normal">
                                                {court.courtTypeName}
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
                                        <td
                                            className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-inherit z-10 cursor-pointer hover:text-green-600"
                                            onClick={() => openModalForTimeSlot(time)}
                                        >
                                            {time}
                                        </td>
                                        {filteredCourts.map((court) => {
                                            const slotBookings = getBookingsForSlot(court.id, time);
                                            const isBooked = slotBookings.length > 0;
                                            return (
                                                <td
                                                    key={court.id}
                                                    className="px-2 py-2 text-center cursor-pointer"
                                                    onClick={() => openModalForTimeSlot(time)}
                                                >
                                                    {isBooked ? (
                                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                                                            <div className="font-semibold text-sm">
                                                                {slotBookings[0].userName}
                                                            </div>
                                                            <div className="text-xs opacity-90 mt-1">
                                                                {slotBookings[0].userPhone}
                                                            </div>
                                                            <div className="text-xs opacity-90 mt-1">
                                                                {slotBookings[0].timeSlot}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="border-2 border-dashed border-gray-200 p-3 rounded-lg text-xs text-gray-400 hover:border-green-300 hover:bg-green-50 transition-all">
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
                </div>
            </main>

            {/* 🪟 Modal hiển thị danh sách sân đặt trong khung giờ */}
            {modalData && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[450px] p-6 relative">
                        <button
                            onClick={() => setModalData(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Danh sách sân đặt trong khung giờ
                        </h3>
                        <ul className="divide-y">
                            {modalData.map((b) => (
                                <li key={b.id} className="py-2">
                                    <div className="font-medium text-green-700">
                                        {b.courtName}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {b.userName} • {b.userPhone}
                                    </div>
                                    <div className="text-xs text-gray-500">{b.timeSlot}</div>
                                    <div
                                        className={`text-xs mt-1 ${
                                            b.status === "confirmed"
                                                ? "text-green-600"
                                                : "text-orange-500"
                                        }`}
                                    >
                                        {b.status === "confirmed"
                                            ? "Đã thanh toán"
                                            : "Chưa thanh toán"}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
