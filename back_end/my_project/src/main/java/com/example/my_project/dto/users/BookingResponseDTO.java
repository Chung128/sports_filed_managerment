package com.example.my_project.dto.users;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class BookingResponseDTO {
    private Long id;
    private Long courtId;
    private String courtName;
    private Long bookingTypeId;
    private Long userId;
    private LocalDateTime bookingDate;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private LocalDate specificDate;
    private LocalTime hourlyStartTime;
    private LocalTime hourlyEndTime;
    private String note;
}