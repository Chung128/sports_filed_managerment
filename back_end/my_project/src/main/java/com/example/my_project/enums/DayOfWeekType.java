package com.example.my_project.enums;

import java.time.DayOfWeek;

public enum DayOfWeekType {
    // Các ngày cụ thể
    MONDAY(DayOfWeek.MONDAY),
    TUESDAY(DayOfWeek.TUESDAY),
    WEDNESDAY(DayOfWeek.WEDNESDAY),
    THURSDAY(DayOfWeek.THURSDAY),
    FRIDAY(DayOfWeek.FRIDAY),
    SATURDAY(DayOfWeek.SATURDAY),
    SUNDAY(DayOfWeek.SUNDAY),

    // Các nhóm ngày (null vì chúng không map với một ngày DayOfWeek đơn lẻ)
    WEEKDAY(null), // Thứ Hai - Thứ Sáu
    WEEKEND(null), // Thứ Bảy - Chủ Nhật
    ALL_DAYS(null); // Tất cả các ngày

    // Trường để lưu trữ đối tượng DayOfWeek chuẩn
    private final DayOfWeek javaDayOfWeek;

    DayOfWeekType(DayOfWeek javaDayOfWeek) {
        this.javaDayOfWeek = javaDayOfWeek;
    }

    // Getter cơ bản
    public DayOfWeek getJavaDayOfWeek() {
        return javaDayOfWeek;
    }

    // =================================================================
    // CÁC PHƯƠNG THỨC TIỆN ÍCH QUAN TRỌNG CHO LOGIC ĐỊNH GIÁ
    // =================================================================

    /**
     * Phương thức kiểm tra xem một DayOfWeek có thuộc loại DayOfWeekType này không.
     * Rất hữu ích khi kiểm tra các nhóm ngày như WEEKDAY, WEEKEND, ALL_DAYS.
     * * @param dayToCheck Ngày trong tuần cần kiểm tra (từ java.time.DayOfWeek)
     * @return true nếu DayOfWeek này thuộc loại DayOfWeekType hiện tại.
     */
    public boolean includes(DayOfWeek dayToCheck) {
        if (this.javaDayOfWeek != null) {
            // Nếu là ngày cụ thể (MONDAY, TUESDAY...), chỉ cần so sánh trực tiếp
            return this.javaDayOfWeek == dayToCheck;
        }

        // Xử lý logic cho các nhóm ngày
        switch (this) {
            case WEEKDAY:
                // Thứ Hai (MONDAY) đến Thứ Sáu (FRIDAY)
                return dayToCheck != DayOfWeek.SATURDAY && dayToCheck != DayOfWeek.SUNDAY;
            case WEEKEND:
                // Thứ Bảy (SATURDAY) và Chủ Nhật (SUNDAY)
                return dayToCheck == DayOfWeek.SATURDAY || dayToCheck == DayOfWeek.SUNDAY;
            case ALL_DAYS:
                // Luôn đúng cho tất cả các ngày
                return true;
            default:
                return false;
        }
    }

    /**
     * Phương thức tiện ích để lấy DayOfWeekType từ một DayOfWeek chuẩn.
     * Giúp mapping nhanh khi nhận input là java.time.DayOfWeek.
     * * @param day DayOfWeek chuẩn của Java
     * @return DayOfWeekType tương ứng
     */
    public static DayOfWeekType fromJavaDayOfWeek(DayOfWeek day) {
        for (DayOfWeekType type : values()) {
            if (type.javaDayOfWeek == day) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid DayOfWeek: " + day);
    }
}