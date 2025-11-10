package com.example.my_project.dto.users;

import com.example.my_project.enums.DayOfWeekType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
public class BookingRequest {
    private Long userId;
    private Long courtId;
    private Long bookingTypeId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate specificDate;

    // MỚI: Danh sách khung giờ
    private List<TimeSlot> timeSlots;

    // Các field cũ (giữ lại để tương thích)
    @JsonFormat(pattern = "HH:mm[:ss]")
    private LocalTime hourlyStartTime;

    @JsonFormat(pattern = "HH:mm[:ss]")
    private LocalTime hourlyEndTime;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate contractStartDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate contractEndDate;

    private DayOfWeekType repeatDay;
    private String note;

    @Data
    @NoArgsConstructor
    public static class TimeSlot {
        @JsonFormat(pattern = "HH:mm[:ss]")
        private LocalTime startTime;

        @JsonFormat(pattern = "HH:mm[:ss]")
        private LocalTime endTime;
    }

    @Override
    public String toString() {
        return "BookingRequest{courtId=" + courtId +
                ", bookingTypeId=" + bookingTypeId +
                ", specificDate=" + specificDate +
                ", timeSlots=" + timeSlots +
                ", note='" + note + "'}";
    }
}