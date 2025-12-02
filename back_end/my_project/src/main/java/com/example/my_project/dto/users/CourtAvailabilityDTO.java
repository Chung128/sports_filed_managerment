package com.example.my_project.dto.users;

import com.example.my_project.enums.StatusCourt;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
public class CourtAvailabilityDTO {

    private Long courtId;
    private String courtName;
    private Long courtVariantId;

    private StatusCourt status;

    private LocalTime startTime;
    private LocalTime endTime;

    private BigDecimal estimatedPrice;

    // DANH SÁCH KHUNG GIỜ ĐÃ ĐẶT
    private List<BookingRequest.TimeSlot> bookedTimes;
}