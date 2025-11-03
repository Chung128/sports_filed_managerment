package com.example.my_project.enums;

public enum StatusCourt {
    // 1. Sân đang hoạt động và sẵn sàng cho việc đặt chỗ ngay lập tức (không có đặt chỗ hiện tại)
    AVAILABLE,

    // 2. Sân đã có đặt chỗ hợp lệ cho khung giờ hiện tại hoặc đang có người chơi bên trong.
    BOOKED_OR_IN_USE,

    // 3. Sân đang bảo trì/sửa chữa, không thể cho thuê.
    MAINTENANCE,

    // 4. Sân đã bị ngừng hoạt động (ví dụ: ngoài mùa giải, hư hỏng nặng).
    OUT_OF_SERVICE
}