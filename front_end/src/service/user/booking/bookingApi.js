import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1/booking";

export const mapCourtStatus = (status) => {
    if (["AVAILABLE", "BOOKED_OR_IN_USE", "MAINTENANCE", "OUT_OF_SERVICE"].includes(status)) {
        return status;
    }
    return "UNKNOWN";
};


export const checkAvailability = async (values) => {
    const res = await axios.get(`${API_BASE}/availability`, {
        params: {
            variantId: values.variantId,
            date: values.date,
            startTime: "05:30:00",  // ← BẮT BUỘC GỬI
            endTime: "22:30:00",    // ← BẮT BUỘC GỬI
        },
    });

    return res.data.map((c) => ({
        courtId: c.courtId,           // ← DÙNG courtId
        courtName: c.courtName,       // ← DÙNG courtName
        status: mapCourtStatus(c.status),
        startTime: c.startTime,
        endTime: c.endTime,
        bookedTimes: c.bookedTimes || [], // ← Đảm bảo có mảng
    }));
};


// Gọi API tính giá
export const getPrice = async (values) => {
    const res = await axios.get(`${API_BASE}/price`, {
        params: {
            variantId: values.variantId,
            date: values.date,
            startTime: values.startTime,
            endTime: values.endTime,
        },
    });
    return res.data;
};

export const createBooking = async (bookingData) => {
    //  Kiểm tra dữ liệu đầu vào
    if (
        !bookingData ||
        !bookingData.courtId ||
        !bookingData.bookingTypeId ||
        !bookingData.specificDate ||
        !Array.isArray(bookingData.timeSlots) ||
        bookingData.timeSlots.length === 0
    ) {
        throw new Error("Dữ liệu đặt sân không hợp lệ!");
    }

    //  Kiểm tra từng slot
    for (const slot of bookingData.timeSlots) {
        if (!slot.startTime || !slot.endTime) {
            throw new Error("Mỗi khung giờ phải có startTime và endTime!");
        }
    }

    try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        console.log(" Gửi request tạo booking:", bookingData);

        const response = await axios.post(`${API_BASE}/create`, bookingData, { headers });
        console.log(" Response từ backend:", response.data);

        return response.data; // URL thanh toán từ BE (VNPAY)
    } catch (error) {
        console.error("Booking API error:", error);

        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 400:
                    throw new Error(`Lỗi dữ liệu: ${data.message || "Yêu cầu không hợp lệ"}`);
                case 401:
                    throw new Error("Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
                case 500:
                    throw new Error(`Lỗi hệ thống: ${data.message || "Lỗi máy chủ"}`);
                default:
                    throw new Error(`Lỗi không xác định: ${status} ${error.message}`);
            }
        } else if (error.request) {
            throw new Error("Không thể kết nối đến server!");
        } else {
            throw new Error(`Lỗi: ${error.message}`);
        }
    }
};
// Hàm lấy nhãn trạng thái
export const getStatusLabel = (status) => {
    switch (status) {
        case "AVAILABLE": return "✅ Sẵn sàng";
        case "BOOKED_OR_IN_USE": return "🔴 Đã có người đặt";
        case "MAINTENANCE": return "🛠️ Bảo trì";
        case "OUT_OF_SERVICE": return "⚠️ Ngưng hoạt động";
        default: return "❓ Không xác định";
    }
};

// Hàm lấy tên loại sân
export const getCourtType = (variantId) => {
    switch (variantId) {
        case 1: return "⚽ Bóng đá 5 người";
        case 2: return "⚽ Bóng đá 6 người";
        case 3: return "⚽ Bóng đá 7 người";
        case 4: return "🎾 Tennis";
        case 5: return "🏓 Pickleball";
        default: return "Không xác định";
    }
};

export const getDynamicStatus = (booking) => {
    const now = new Date();
    const bookingDate = new Date(booking.date);

    if (!booking.timeSlot || typeof booking.timeSlot !== "string") {
        return "Chưa sử dụng";
    }

    const parts = booking.timeSlot.split("-").map((p) => p.trim());
    const start = parts[0];
    const end = parts[1] || null;

    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end ? end.split(":").map(Number) : [startHour + 1, startMinute || 0];

    const startTime = new Date(bookingDate);
    startTime.setHours(startHour, startMinute || 0, 0, 0);

    const endTime = new Date(bookingDate);
    endTime.setHours(endHour, endMinute || 0, 0, 0);

    if (now < startTime) return "Chưa sử dụng";
    if (now >= startTime && now <= endTime) return "Đang sử dụng";
    return "Đã sử dụng";
};

