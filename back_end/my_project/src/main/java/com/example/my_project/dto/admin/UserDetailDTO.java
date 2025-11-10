package com.example.my_project.dto.admin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailDTO {

    private Long id;
    private String name;
    private String username;
    private String email;
    private String phone;
    private String avatar;
    private String address;


    private int totalBookings;
    private BigDecimal totalSpent;

    private List<BookingInfo> bookingHistory;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingInfo {
        private Long id;
        private String fieldName;
        private LocalDate date;
        private String timeSlot;
        private String status;
        private BigDecimal price;
    }
}