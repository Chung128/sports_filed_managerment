package com.example.my_project.controller;

import com.example.my_project.dto.BookingRequest;
import com.example.my_project.dto.BookingResponseDTO;
import com.example.my_project.dto.CourtAvailabilityDTO;
import com.example.my_project.entity.Booking;
import com.example.my_project.entity.Court;
import com.example.my_project.entity.User;
import com.example.my_project.repository.ICourtRepository;
import com.example.my_project.service.IBookingService;
import com.example.my_project.service.IUserService;
import com.example.my_project.service.imp.TempBookingService;
import com.example.my_project.service.vnpay.VNPAYService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/booking")
@RequiredArgsConstructor
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);
    private final TempBookingService tempBookingService;
    private final IBookingService bookingService;
    private final ICourtRepository courtRepository;
    private final VNPAYService vnpayService;
    private final IUserService userService; // DÙNG SERVICE

    @GetMapping("/availability")
    public ResponseEntity<List<CourtAvailabilityDTO>> getCourtAvailability(
            @RequestParam Long variantId,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.TIME) LocalTime endTime) {
        logger.info("Checking availability: variantId={}, date={}, startTime={}, endTime={}", variantId, date, startTime, endTime);
        List<CourtAvailabilityDTO> availableCourts = bookingService.getAvailableCourts(variantId, date, startTime, endTime);
        return ResponseEntity.ok(availableCourts);
    }

    @GetMapping("/price")
    public ResponseEntity<BigDecimal> getBookingPrice(
            @RequestParam Long variantId,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.TIME) LocalTime endTime) {
        logger.info("Calculating price: variantId={}, date={}, startTime={}, endTime={}", variantId, date, startTime, endTime);
        BigDecimal price = bookingService.calculatePrice(variantId, date, startTime, endTime);
        return ResponseEntity.ok(price);
    }
//trước khi dùng websocket
//    @PostMapping("/create")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<String> createBooking(@RequestBody BookingRequest request) {
//        logger.info("Received booking request: {}", request);
//
//        // DÙNG SERVICE ĐỂ LẤY USER
//        User user = userService.getCurrentUser();
//        request.setUserId(user.getId());
//        logger.info("Attached userId={} to BookingRequest", user.getId());
//
//        // Validate
//        if (request.getCourtId() == null || request.getBookingTypeId() == null || request.getSpecificDate() == null) {
//            throw new IllegalArgumentException("Dữ liệu đặt sân không hợp lệ");
//        }
//        if (request.getTimeSlots() == null || request.getTimeSlots().isEmpty()) {
//            throw new IllegalArgumentException("Chưa chọn khung giờ đặt sân");
//        }
//
//        Court court = courtRepository.findById(request.getCourtId())
//                .orElseThrow(() -> new IllegalArgumentException("Sân không tồn tại"));
//
//        BigDecimal totalAmount = BigDecimal.ZERO;
//        for (BookingRequest.TimeSlot slot : request.getTimeSlots()) {
//            totalAmount = totalAmount.add(bookingService.calculatePrice(
//                    court.getCourtVariant().getId(),
//                    request.getSpecificDate(),
//                    slot.getStartTime(),
//                    slot.getEndTime()
//            ));
//        }
//
//        String vnp_TxnRef = UUID.randomUUID().toString();
//        String vnpayUrl = vnpayService.generateVnpayUrl(totalAmount, request, vnp_TxnRef);
//
//        logger.info("Generated VNPAY URL: {}, txnRef: {}", vnpayUrl, vnp_TxnRef);
//        return ResponseEntity.ok(vnpayUrl);
//    }
@PostMapping("/create")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<String> createBooking(@RequestBody BookingRequest request) {
    User user = userService.getCurrentUser();
    request.setUserId(user.getId());

    // === VALIDATE ===
    if (request.getCourtId() == null || request.getSpecificDate() == null || request.getTimeSlots().isEmpty()) {
        throw new IllegalArgumentException("Dữ liệu không hợp lệ");
    }

    Court court = courtRepository.findById(request.getCourtId())
            .orElseThrow(() -> new IllegalArgumentException("Sân không tồn tại"));

    BigDecimal totalAmount = BigDecimal.ZERO;
    for (var slot : request.getTimeSlots()) {
        totalAmount = totalAmount.add(bookingService.calculatePrice(
                court.getCourtVariant().getId(), request.getSpecificDate(),
                slot.getStartTime(), slot.getEndTime()
        ));
    }

    String txnRef = UUID.randomUUID().toString();

    // === LOCK SLOT TRƯỚC KHI TẠO VNPAY URL ===
    try {
        tempBookingService.lockSlots(request, txnRef);
    } catch (IllegalStateException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    String vnpayUrl = vnpayService.generateVnpayUrl(totalAmount, request, txnRef);
    return ResponseEntity.ok(vnpayUrl);
}

//    @GetMapping("/payment-callback")
//    public void handlePaymentCallback(
//            @RequestParam Map<String, String> allParams,
//            HttpServletResponse httpResponse) throws Exception {
//
//        String responseCode = allParams.get("vnp_ResponseCode");
//        String txnRef = allParams.get("vnp_TxnRef");
//
//        logger.info("VNPAY callback: responseCode={}, txnRef={}", responseCode, txnRef);
//
//        BookingRequest request = vnpayService.retrieveBookingRequestFromTempStorage(txnRef);
//        boolean success = "00".equals(responseCode);
//        String message = "";
//        String courtName = "", date = "", timeSlots = "";
//        BigDecimal amount = BigDecimal.ZERO;
//
//        if (request == null) {
//            message = "Không tìm thấy thông tin đặt sân";
//            success = false;
//        } else
//            if (success) {
//            try {
//                Booking firstBooking = bookingService.createBooking(request, "PAID", txnRef);
//                vnpayService.deleteBookingRequestFromTempStorage(txnRef);
//
//                Court court = firstBooking.getCourt();
//                courtName = court.getName();
//                date = firstBooking.getSpecificDate().toString();
//                timeSlots = firstBooking.getHourlyStartTime() + "-" + firstBooking.getHourlyEndTime();
//                amount = firstBooking.getTotalAmount();
//                message = "Đặt sân thành công!";
//
//            } catch (Exception e) {
//                logger.error("Lỗi tạo booking: {}", e.getMessage(), e);
//                success = false;
//                message = "Đặt sân thất bại: " + e.getMessage();
//                vnpayService.deleteBookingRequestFromTempStorage(txnRef);
//            }
//        } else {
//            message = "Thanh toán thất bại: " + getVnpayErrorMessage(responseCode);
//            vnpayService.deleteBookingRequestFromTempStorage(txnRef);
//        }
//        redirectToFrontend(httpResponse, success, message, txnRef, courtName, date, timeSlots, amount);
//    }
@GetMapping("/payment-callback")
public void handlePaymentCallback(
        @RequestParam Map<String, String> allParams,
        HttpServletResponse httpResponse) throws Exception {

    String responseCode = allParams.get("vnp_ResponseCode");
    String txnRef = allParams.get("vnp_TxnRef");

    logger.info("VNPAY callback: responseCode={}, txnRef={}", responseCode, txnRef);

    BookingRequest request = vnpayService.retrieveBookingRequestFromTempStorage(txnRef);
    boolean success = "00".equals(responseCode);
    String message = "";
    String courtName = "", date = "", timeSlots = "";
    BigDecimal amount = BigDecimal.ZERO;

    if (request == null) {
        message = "Không tìm thấy thông tin đặt sân";
        success = false;

        // XÓA TEMP LOCK DÙ KHÔNG CÓ REQUEST
        tempBookingService.unlockSlots(txnRef);
        vnpayService.deleteBookingRequestFromTempStorage(txnRef);
    }
    else if (success) {
        try {
            Booking firstBooking = bookingService.createBooking(request, "PAID", txnRef);

            Court court = firstBooking.getCourt();
            courtName = court.getName();
            date = firstBooking.getSpecificDate().toString();
            timeSlots = firstBooking.getHourlyStartTime() + "-" + firstBooking.getHourlyEndTime();
            amount = firstBooking.getTotalAmount();
            message = "Đặt sân thành công!";

            // THÀNH CÔNG: XÓA TEMP LOCK + TEMP STORAGE
            tempBookingService.unlockSlots(txnRef);
            vnpayService.deleteBookingRequestFromTempStorage(txnRef);

        } catch (Exception e) {
            logger.error("Lỗi tạo booking: {}", e.getMessage(), e);
            success = false;
            message = "Đặt sân thất bại: " + e.getMessage();

            // LỖI: VẪN XÓA TEMP
            tempBookingService.unlockSlots(txnRef);
            vnpayService.deleteBookingRequestFromTempStorage(txnRef);
        }
    }
    else {
        message = "Thanh toán thất bại: " + getVnpayErrorMessage(responseCode);

        // THẤT BẠI: XÓA TEMP
        tempBookingService.unlockSlots(txnRef);
        vnpayService.deleteBookingRequestFromTempStorage(txnRef);
    }

    redirectToFrontend(httpResponse, success, message, txnRef, courtName, date, timeSlots, amount);
}

    private void redirectToFrontend(HttpServletResponse response,
                                    boolean success,
                                    String message,
                                    String txnRef,
                                    String courtName,
                                    String date,
                                    String timeSlots,
                                    BigDecimal amount) throws IOException {

        String frontendUrl = "http://localhost:3000/booking-result"; // Thay bằng @Value nếu cần
        String redirectUrl = frontendUrl +
                "?success=" + success +
                "&message=" + URLEncoder.encode(message, StandardCharsets.UTF_8) +
                "&txnRef=" + (txnRef != null ? txnRef : "") +
                "&courtName=" + (courtName != null ? URLEncoder.encode(courtName, StandardCharsets.UTF_8) : "") +
                "&date=" + (date != null ? date : "") +
                "&time=" + (timeSlots != null ? URLEncoder.encode(timeSlots, StandardCharsets.UTF_8) : "") +
                "&amount=" + (amount != null ? amount.longValue() : 0);

        logger.info("Redirecting to frontend: {}", redirectUrl);
        response.sendRedirect(redirectUrl);
    }

    private String getVnpayErrorMessage(String code) {
        return switch (code) {
            case "01" -> "Giao dịch đã tồn tại";
            case "02" -> "Đơn hàng đã được xác nhận";
            case "04" -> "Giao dịch đảo ngược thành công";
            case "05" -> "Giao dịch không thành công do lỗi ngân hàng";
            default -> " Bạn đã hủy thanh toán. ";
//            default -> "Mã lỗi không xác định: " + code;
        };
    }

    @PostMapping("/{bookingId}/payment-success")
    public ResponseEntity<BookingResponseDTO> completePayment(@PathVariable Long bookingId) {
        Booking updated = bookingService.updatePaymentStatus(bookingId, "PAID");
        BookingResponseDTO response = new BookingResponseDTO();
        response.setId(updated.getId());
        response.setCourtId(updated.getCourt().getId());
        response.setCourtName(updated.getCourt().getName());
        response.setBookingDate(updated.getBookingDate());
        response.setPaymentStatus(updated.getPaymentStatus());
        response.setSpecificDate(updated.getSpecificDate());
        response.setHourlyStartTime(updated.getHourlyStartTime());
        response.setHourlyEndTime(updated.getHourlyEndTime());
        response.setNote(updated.getNote());
        return ResponseEntity.ok(response);
    }
}
