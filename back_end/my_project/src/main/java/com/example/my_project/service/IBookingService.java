package com.example.my_project.service;

import com.example.my_project.dto.users.BookingRequest;
import com.example.my_project.dto.users.CourtAvailabilityDTO;
import com.example.my_project.entity.Booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface IBookingService {

    //lấy booking của user
    List<Booking> getBookingsByUserId(Long userId);


    // 1. Truy vấn lịch trống
    List<CourtAvailabilityDTO> getAvailableCourts(Long variantId, LocalDate date, LocalTime startTime, LocalTime endTime);

    // 2. Tính giá theo giờ (để hiển thị cho người dùng trước khi thanh toán)
    BigDecimal calculatePrice(Long courtVariantId, LocalDate date, LocalTime startTime, LocalTime endTime);

    // 3. Thực hiện đặt sân
    //Booking createBooking(BookingRequest request);
    Booking createBooking(BookingRequest request, String paymentStatus, String transactionId)throws Exception;

    // 4. Cập nhật trạng thái thanh toán
    Booking updatePaymentStatus(Long bookingId, String status);

    // 5. Quản lý Đặt theo tháng (logic phức tạp hơn)
    Booking createMonthlyBooking(BookingRequest request);
}