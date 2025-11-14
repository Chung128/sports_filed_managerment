//package com.example.my_project.service.imp;
//
//import com.example.my_project.dto.users.BookingRequest;
//import com.example.my_project.dto.users.CourtAvailabilityDTO;
//import com.example.my_project.entity.*;
//import com.example.my_project.enums.DayOfWeekType;
//import com.example.my_project.enums.StatusCourt;
//import com.example.my_project.repository.IBookingRepository;
//import com.example.my_project.repository.IBookingTypeRepository;
//import com.example.my_project.repository.ICourtRepository;
//import com.example.my_project.repository.IPriceRuleRepository;
//import com.example.my_project.repository.IUserRepository;
//import com.example.my_project.service.IBookingService;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.time.*;
//import java.time.temporal.TemporalAdjusters;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//public class BookingService implements IBookingService {
//
//    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);
//
//    private final IPriceRuleRepository priceRuleRepository;
//    private final ICourtRepository courtRepository;
//    private final IBookingRepository bookingRepository;
//    private final IBookingTypeRepository bookingTypeRepository;
//    private final IUserRepository userRepository;
//
//    public BookingService(IPriceRuleRepository priceRuleRepository, ICourtRepository courtRepository,
//                          IBookingRepository bookingRepository, IBookingTypeRepository bookingTypeRepository,
//                          IUserRepository userRepository) {
//        this.priceRuleRepository = priceRuleRepository;
//        this.courtRepository = courtRepository;
//        this.bookingRepository = bookingRepository;
//        this.bookingTypeRepository = bookingTypeRepository;
//        this.userRepository = userRepository;
//    }
//
//    private Optional<PriceRule> findBestPriceRule(List<PriceRule> applicableRules, DayOfWeekType specificDayType, DayOfWeek javaDayOfWeek) {
//        logger.debug("Finding best price rule for dayType: {}, javaDayOfWeek: {}", specificDayType, javaDayOfWeek);
//        Optional<PriceRule> specificRule = applicableRules.stream()
//                .filter(rule -> rule.getDayType() == specificDayType)
//                .findFirst();
//        if (specificRule.isPresent()) {
//            logger.debug("Found specific rule for dayType: {}", specificDayType);
//            return specificRule;
//        }
//        Optional<PriceRule> groupRule = applicableRules.stream()
//                .filter(rule -> {
//                    if (rule.getDayType() == DayOfWeekType.WEEKDAY) {
//                        return javaDayOfWeek.getValue() >= 1 && javaDayOfWeek.getValue() <= 5;
//                    }
//                    if (rule.getDayType() == DayOfWeekType.WEEKEND) {
//                        return javaDayOfWeek == DayOfWeek.SATURDAY || javaDayOfWeek == DayOfWeek.SUNDAY;
//                    }
//                    return false;
//                })
//                .findFirst();
//        if (groupRule.isPresent()) {
//            logger.debug("Found group rule for dayType: {}", groupRule.get().getDayType());
//            return groupRule;
//        }
//        Optional<PriceRule> allDaysRule = applicableRules.stream()
//                .filter(rule -> rule.getDayType() == DayOfWeekType.ALL_DAYS)
//                .findFirst();
//        if (allDaysRule.isPresent()) {
//            logger.debug("Found ALL_DAYS rule");
//            return allDaysRule;
//        }
//        logger.warn("No applicable price rule found");
//        return Optional.empty();
//    }
//
//    private boolean isPeakHour(LocalTime startTime) {
//        LocalTime peakStart = LocalTime.of(15, 0);
//        LocalTime peakEnd = LocalTime.of(22, 0);
//        return !startTime.isBefore(peakStart) && !startTime.isAfter(peakEnd);
//    }
//
//    @Override
//    public BigDecimal calculatePrice(Long courtVariantId, LocalDate date, LocalTime startTime, LocalTime endTime) {
//        logger.info("Calculating price for courtVariantId: {}, date: {}, startTime: {}, endTime: {}",
//                courtVariantId, date, startTime, endTime);
//
//        if (courtVariantId == null || date == null || startTime == null || endTime == null) {
//            logger.error("Invalid input: courtVariantId={}, date={}, startTime={}, endTime={}",
//                    courtVariantId, date, startTime, endTime);
//            throw new IllegalArgumentException("Court variant, date, hoặc thời gian không được null");
//        }
//
//        DayOfWeek javaDayOfWeek = date.getDayOfWeek();
//        DayOfWeekType specificDayType = DayOfWeekType.fromJavaDayOfWeek(javaDayOfWeek);
//        List<DayOfWeekType> dayTypes = List.of(specificDayType, DayOfWeekType.WEEKDAY, DayOfWeekType.WEEKEND, DayOfWeekType.ALL_DAYS);
//
//        long durationHours = Duration.between(startTime, endTime).toHours();
//        if (durationHours <= 0) {
//            logger.error("Invalid time range: startTime {} is not before endTime {}", startTime, endTime);
//            throw new IllegalArgumentException("Khung giờ đặt không hợp lệ.");
//        }
//
//        BigDecimal total = BigDecimal.ZERO;
//        LocalTime currentTime = startTime;
//
//        for (int i = 0; i < durationHours; i++) {
//            List<PriceRule> applicableRules = priceRuleRepository.findApplicablePriceRules(courtVariantId, currentTime, dayTypes);
//            logger.debug("Found {} applicable price rules for time: {}", applicableRules.size(), currentTime);
//
//            Optional<PriceRule> finalRule = findBestPriceRule(applicableRules, specificDayType, javaDayOfWeek);
//            // Giả định giá cơ bản là 300000 VNĐ nếu không tìm thấy PriceRule
//            BigDecimal basePrice = finalRule.map(PriceRule::getPrice).orElse(new BigDecimal("300000"));
//            BigDecimal adjustedPrice = isPeakHour(currentTime) ? basePrice.multiply(new BigDecimal("1.3")) : basePrice;
//            total = total.add(adjustedPrice);
//            logger.debug("Hour: {}, Base Price: {}, Adjusted Price: {}", currentTime, basePrice, adjustedPrice);
//            currentTime = currentTime.plusHours(1);
//        }
//
//        logger.info("Total price calculated: {}", total);
//        return total;
//    }
//
//    @Override
//    public List<CourtAvailabilityDTO> getAvailableCourts(Long variantId, LocalDate date, LocalTime startTime, LocalTime endTime) {
//        logger.info("Checking availability for variantId: {}, date: {}, startTime: {}, endTime: {}",
//                variantId, date, startTime, endTime);
//
//        List<Court> courts = courtRepository.findByCourtVariantId(variantId);
//        if (courts.isEmpty()) {
//            logger.warn("No courts found for variantId: {}", variantId);
//            return List.of();
//        }
//
//        return courts.stream().map(court -> {
//            StatusCourt status = court.getStatus();
//            logger.debug("Court {} status: {}", court.getName(), status);
//
//            if (status == StatusCourt.MAINTENANCE || status == StatusCourt.OUT_OF_SERVICE) {
//                return CourtAvailabilityDTO.builder()
//                        .courtId(court.getId())
//                        .courtName(court.getName())
//                        .courtVariantId(variantId)
//                        .status(status)
//                        .startTime(startTime)
//                        .endTime(endTime)
//                        .build();
//            }
//
//            List<Booking> conflicts = bookingRepository.findTimeConflictsForHourly(court.getId(), date, startTime, endTime);
//            logger.debug("Court {} conflicts found: {}", court.getName(), conflicts.size());
//
//            status = conflicts.isEmpty() ? StatusCourt.AVAILABLE : StatusCourt.BOOKED_OR_IN_USE;
//
//            BigDecimal estimatedPrice = null;
//            try {
//                estimatedPrice = calculatePrice(variantId, date, startTime, endTime);
//            } catch (Exception e) {
//                logger.error("Error calculating price for court {}: {}", court.getName(), e.getMessage());
//                estimatedPrice = new BigDecimal("300000");
//            }
//
//            return CourtAvailabilityDTO.builder()
//                    .courtId(court.getId())
//                    .courtName(court.getName())
//                    .courtVariantId(variantId)
//                    .status(status)
//                    .startTime(startTime)
//                    .endTime(endTime)
//                    .estimatedPrice(estimatedPrice)
//                    .build();
//        }).collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public Booking createBooking(BookingRequest request) {
//        logger.info("Creating booking with request: {}", request);
//
//        if (request.getBookingTypeId() == null || request.getCourtId() == null ||
//                request.getSpecificDate() == null || request.getHourlyStartTime() == null ||
//                request.getHourlyEndTime() == null) {
//            logger.error("Invalid booking request: {}", request);
//            throw new IllegalArgumentException("Dữ liệu đặt sân không đầy đủ: thiếu bookingTypeId, courtId, specificDate, hourlyStartTime hoặc hourlyEndTime");
//        }
//
//        BookingType bookingType = bookingTypeRepository.findById(request.getBookingTypeId())
//                .orElseThrow(() -> new IllegalArgumentException("BookingType không tồn tại."));
//        Court court = courtRepository.findById(request.getCourtId())
//                .orElseThrow(() -> new IllegalArgumentException("Sân không tồn tại."));
//
//        // Lấy user từ JWT token
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user từ token: " + username));
//
//        List<Booking> conflicts = bookingRepository.findTimeConflictsForHourly(
//                request.getCourtId(), request.getSpecificDate(), request.getHourlyStartTime(), request.getHourlyEndTime()
//        );
//        if (!conflicts.isEmpty()) {
//            throw new IllegalStateException("Sân đã có người đặt trong khung giờ này.");
//        }
//
//        BigDecimal totalAmount = calculatePrice(
//                court.getCourtVariant().getId(), request.getSpecificDate(), request.getHourlyStartTime(), request.getHourlyEndTime()
//        );
//
//        Booking booking = new Booking();
//        booking.setCourt(court);
//        booking.setBookingType(bookingType);
//        booking.setUser(user);
//        booking.setBookingDate(LocalDateTime.now());
//        booking.setTotalAmount(totalAmount);
//        booking.setPaymentStatus("PENDING");
//        booking.setSpecificDate(request.getSpecificDate());
//        booking.setHourlyStartTime(request.getHourlyStartTime());
//        booking.setHourlyEndTime(request.getHourlyEndTime());
//       // booking.setNote(request.getNote());
//
//        return bookingRepository.save(booking);
//    }
//
//    @Override
//    @Transactional
//    public Booking createMonthlyBooking(BookingRequest request) {
//        LocalDate start = request.getContractStartDate();
//        LocalDate end = request.getContractEndDate();
//        DayOfWeekType repeatDayType = request.getRepeatDay();
//        if (repeatDayType == null || repeatDayType.getJavaDayOfWeek() == null) {
//            throw new IllegalArgumentException("Repeat day không hợp lệ.");
//        }
//
//        List<LocalDate> repeatDates = new ArrayList<>();
//        LocalDate firstRepeatDate = start.with(TemporalAdjusters.nextOrSame(repeatDayType.getJavaDayOfWeek()));
//        for (LocalDate date = firstRepeatDate; !date.isAfter(end); date = date.plusWeeks(1)) {
//            repeatDates.add(date);
//        }
//        if (repeatDates.isEmpty()) {
//            throw new IllegalArgumentException("Không có ngày lặp nào hợp lệ.");
//        }
//
//        for (LocalDate date : repeatDates) {
//            boolean conflict = bookingRepository.existsConflict(
//                    request.getCourtId(), date, request.getHourlyStartTime(), request.getHourlyEndTime()
//            );
//            if (conflict) {
//                throw new IllegalArgumentException("Sân đã được đặt vào ngày " + date);
//            }
//        }
//
//        Court court = courtRepository.findById(request.getCourtId())
//                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sân"));
//        CourtVariant variant = court.getCourtVariant();
//        BigDecimal totalAmount = BigDecimal.ZERO;
//
//        for (LocalDate date : repeatDates) {
//            BigDecimal price = calculatePrice(
//                    variant.getId(), date, request.getHourlyStartTime(), request.getHourlyEndTime()
//            );
//            totalAmount = totalAmount.add(price);
//        }
//
//        String contractCode = "MONTHLY-" + System.currentTimeMillis();
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user từ token: " + username));
//
//        for (LocalDate date : repeatDates) {
//            Booking booking = new Booking();
//            booking.setBookingDate(LocalDateTime.now());
//            booking.setTotalAmount(calculatePrice(
//                    variant.getId(), date, request.getHourlyStartTime(), request.getHourlyEndTime()
//            ));
//            booking.setPaymentStatus("UNPAID");
//            booking.setBookingType(bookingTypeRepository.findById(request.getBookingTypeId())
//                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy BookingType")));
//            booking.setCourt(court);
//            booking.setUser(user);
//            booking.setSpecificDate(date);
//            booking.setRepeatDay(repeatDayType);
//            booking.setContractStartDate(start);
//            booking.setContractEndDate(end);
//            booking.setMonthlyFixedStartTime(request.getHourlyStartTime());
//            booking.setMonthlyFixedEndTime(request.getHourlyEndTime());
//            booking.setContractCode(contractCode);
//         //   booking.setNote(request.getNote());
//            bookingRepository.save(booking);
//        }
//
//        return bookingRepository.findFirstByContractCode(contractCode)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking vừa tạo"));
//    }
//
//    @Override
//    @Transactional
//    public Booking updatePaymentStatus(Long bookingId, String status) {
//        Booking booking = bookingRepository.findById(bookingId)
//                .orElseThrow(() -> new RuntimeException("Booking không tồn tại."));
//        if (status.equals("PAID")) {
//            booking.setPaymentStatus("PAID");
//        } else if (status.equals("CANCELLED")) {
//            booking.setPaymentStatus("CANCELLED");
//        }
//        return bookingRepository.save(booking);
//    }
//}

package com.example.my_project.service.imp;

import com.example.my_project.dto.users.BookingRequest;
import com.example.my_project.dto.users.CourtAvailabilityDTO;
import com.example.my_project.entity.*;
import com.example.my_project.enums.*;
import com.example.my_project.repository.*;
import com.example.my_project.service.IBookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService implements IBookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    private final IPriceRuleRepository priceRuleRepository;
    private final ICourtRepository courtRepository;
    private final IBookingRepository bookingRepository;
    private final IBookingTypeRepository bookingTypeRepository;
    private final IUserRepository userRepository;
    private final IPaymentRepository paymentRepository;
    private final EmailService emailService;

    public BookingService(IPriceRuleRepository priceRuleRepository, ICourtRepository courtRepository,
                          IBookingRepository bookingRepository, IBookingTypeRepository bookingTypeRepository,
                          IUserRepository userRepository, IPaymentRepository paymentRepository, EmailService emailService) {
        this.priceRuleRepository = priceRuleRepository;
        this.courtRepository = courtRepository;
        this.bookingRepository = bookingRepository;
        this.bookingTypeRepository = bookingTypeRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.emailService = emailService;
    }

    private Optional<PriceRule> findBestPriceRule(List<PriceRule> applicableRules, DayOfWeekType specificDayType, DayOfWeek javaDayOfWeek) {
        logger.debug("Finding best price rule for dayType: {}, javaDayOfWeek: {}", specificDayType, javaDayOfWeek);
        Optional<PriceRule> specificRule = applicableRules.stream()
                .filter(rule -> rule.getDayType() == specificDayType)
                .findFirst();
        if (specificRule.isPresent()) {
            logger.debug("Found specific rule for dayType: {}", specificDayType);
            return specificRule;
        }
        Optional<PriceRule> groupRule = applicableRules.stream()
                .filter(rule -> {
                    if (rule.getDayType() == DayOfWeekType.WEEKDAY) {
                        return javaDayOfWeek.getValue() >= 1 && javaDayOfWeek.getValue() <= 5;
                    }
                    if (rule.getDayType() == DayOfWeekType.WEEKEND) {
                        return javaDayOfWeek == DayOfWeek.SATURDAY || javaDayOfWeek == DayOfWeek.SUNDAY;
                    }
                    return false;
                })
                .findFirst();
        if (groupRule.isPresent()) {
            logger.debug("Found group rule for dayType: {}", groupRule.get().getDayType());
            return groupRule;
        }
        Optional<PriceRule> allDaysRule = applicableRules.stream()
                .filter(rule -> rule.getDayType() == DayOfWeekType.ALL_DAYS)
                .findFirst();
        if (allDaysRule.isPresent()) {
            logger.debug("Found ALL_DAYS rule");
            return allDaysRule;
        }
        logger.warn("No applicable price rule found");
        return Optional.empty();
    }

    private boolean isPeakHour(LocalTime startTime) {
        LocalTime peakStart = LocalTime.of(15, 0);
        LocalTime peakEnd = LocalTime.of(22, 0);
        return !startTime.isBefore(peakStart) && !startTime.isAfter(peakEnd);
    }

    @Override
    public BigDecimal calculatePrice(Long courtVariantId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        logger.info("Calculating price for courtVariantId: {}, date: {}, startTime: {}, endTime: {}",
                courtVariantId, date, startTime, endTime);

        if (courtVariantId == null || date == null || startTime == null || endTime == null) {
            logger.error("Invalid input: courtVariantId={}, date={}, startTime={}, endTime={}",
                    courtVariantId, date, startTime, endTime);
            throw new IllegalArgumentException("Court variant, date, hoặc thời gian không được null");
        }

        DayOfWeek javaDayOfWeek = date.getDayOfWeek();
        DayOfWeekType specificDayType = DayOfWeekType.fromJavaDayOfWeek(javaDayOfWeek);
        List<DayOfWeekType> dayTypes = List.of(specificDayType, DayOfWeekType.WEEKDAY, DayOfWeekType.WEEKEND, DayOfWeekType.ALL_DAYS);

        long durationHours = Duration.between(startTime, endTime).toHours();
        if (durationHours <= 0) {
            logger.error("Invalid time range: startTime {} is not before endTime {}", startTime, endTime);
            throw new IllegalArgumentException("Khung giờ đặt không hợp lệ.");
        }

        BigDecimal total = BigDecimal.ZERO;
        LocalTime currentTime = startTime;

        for (int i = 0; i < durationHours; i++) {
            List<PriceRule> applicableRules = priceRuleRepository.findApplicablePriceRules(courtVariantId, currentTime, dayTypes);
            logger.debug("Found {} applicable price rules for time: {}", applicableRules.size(), currentTime);

            Optional<PriceRule> finalRule = findBestPriceRule(applicableRules, specificDayType, javaDayOfWeek);
            BigDecimal basePrice = finalRule.map(PriceRule::getPrice).orElse(new BigDecimal("300000"));
            BigDecimal adjustedPrice = isPeakHour(currentTime) ? basePrice.multiply(new BigDecimal("1.3")) : basePrice;
            total = total.add(adjustedPrice);
            logger.debug("Hour: {}, Base Price: {}, Adjusted Price: {}", currentTime, basePrice, adjustedPrice);
            currentTime = currentTime.plusHours(1);
        }

        logger.info("Total price calculated: {}", total);
        return total;
    }

    @Override
    public List<CourtAvailabilityDTO> getAvailableCourts(Long variantId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        logger.info("Checking availability for variantId: {}, date: {}, startTime: {}, endTime: {}",
                variantId, date, startTime, endTime);

        List<Court> courts = courtRepository.findByCourtVariantId(variantId);
        if (courts.isEmpty()) {
            logger.warn("No courts found for variantId: {}", variantId);
            return List.of();
        }

        return courts.stream().map(court -> {
            StatusCourt status = court.getStatus();
            logger.debug("Court {} status: {}", court.getName(), status);

            // Nếu sân đang bảo trì hoặc ngừng hoạt động → trả về ngay
            if (status == StatusCourt.MAINTENANCE || status == StatusCourt.OUT_OF_SERVICE) {
                return CourtAvailabilityDTO.builder()
                        .courtId(court.getId())
                        .courtName(court.getName())
                        .courtVariantId(variantId)
                        .status(status)
                        .startTime(startTime)
                        .endTime(endTime)
                        .bookedTimes(List.of()) // Không có khung giờ nào
                        .build();
            }

            // Lấy các booking xung đột trong khung giờ yêu cầu
            List<Booking> conflicts = bookingRepository.findTimeConflictsForHourly(
                    court.getId(), date, startTime, endTime
            );
            logger.debug("Court {} conflicts found: {}", court.getName(), conflicts.size());

            // Xác định trạng thái sân
            status = conflicts.isEmpty() ? StatusCourt.AVAILABLE : StatusCourt.BOOKED_OR_IN_USE;

            // Chuyển đổi conflicts → List<BookingRequest.TimeSlot>
            List<BookingRequest.TimeSlot> bookedTimes = conflicts.stream()
                    .map(b -> {
                        BookingRequest.TimeSlot slot = new BookingRequest.TimeSlot();
                        slot.setStartTime(b.getHourlyStartTime());
                        slot.setEndTime(b.getHourlyEndTime());
                        return slot;
                    })
                    .collect(Collectors.toList());

            // Tính giá ước lượng
            BigDecimal estimatedPrice = null;
            try {
                estimatedPrice = calculatePrice(variantId, date, startTime, endTime);
            } catch (Exception e) {
                logger.error("Error calculating price for court {}: {}", court.getName(), e.getMessage());
                estimatedPrice = new BigDecimal("300000");
            }

            // Trả về DTO đầy đủ
            return CourtAvailabilityDTO.builder()
                    .courtId(court.getId())
                    .courtName(court.getName())
                    .courtVariantId(variantId)
                    .status(status)
                    .startTime(startTime)
                    .endTime(endTime)
                    .estimatedPrice(estimatedPrice)
                    .bookedTimes(bookedTimes) // TRẢ VỀ KHUNG GIỜ ĐÃ ĐẶT
                    .build();

        }).collect(Collectors.toList());
    }

    // Trong BookingService.java

    @Override
    @Transactional
    public Booking createBooking(BookingRequest request, String paymentStatus, String transactionId) throws Exception {
        if (request.getCourtId() == null || request.getBookingTypeId() == null || request.getSpecificDate() == null) {
            throw new IllegalArgumentException("Dữ liệu không đầy đủ");
        }

        if (!"PAID".equals(paymentStatus)) {
            throw new IllegalStateException("Thanh toán chưa thành công");
        }

        // === ƯU TIÊN 1: DÙNG userId TỪ REQUEST (AN TOÀN NHẤT CHO CALLBACK) ===
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy userId: " + request.getUserId()));
            logger.info("Loaded user from request.userId = {}", request.getUserId());
        }
        // === ƯU TIÊN 2: MỚI DÙNG JWT (chỉ khi gọi từ API nội bộ, không phải callback) ===
        else {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                logger.error("No valid user in JWT and no userId in request. txnId={}", transactionId);
                throw new IllegalStateException("Không thể xác định người dùng. Vui lòng thử lại.");
            }
            String username = auth.getName();
            user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user: " + username));
            logger.info("Loaded user from JWT: {}", username);
        }

        // === TIẾP TỤC NHƯ CŨ ===
        List<BookingRequest.TimeSlot> slots = request.getTimeSlots();
        if (slots == null || slots.isEmpty()) {
            throw new IllegalArgumentException("Chưa chọn khung giờ");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Booking> createdBookings = new ArrayList<>();

        for (BookingRequest.TimeSlot slot : slots) {
            List<Booking> conflicts = bookingRepository.findTimeConflictsForHourly(
                    request.getCourtId(), request.getSpecificDate(), slot.getStartTime(), slot.getEndTime()
            );
            if (!conflicts.isEmpty()) {
                throw new IllegalStateException("Khung giờ " + slot.getStartTime() + " - " + slot.getEndTime() + " đã được đặt");
            }

            BigDecimal price = calculatePrice(
                    courtRepository.findById(request.getCourtId()).get().getCourtVariant().getId(),
                    request.getSpecificDate(),
                    slot.getStartTime(),
                    slot.getEndTime()
            );
            totalAmount = totalAmount.add(price);

            Booking booking = new Booking();
            booking.setCourt(courtRepository.findById(request.getCourtId()).orElseThrow());
            booking.setBookingType(bookingTypeRepository.findById(request.getBookingTypeId()).orElseThrow());
            booking.setUser(user);
            booking.setBookingDate(LocalDateTime.now());
            booking.setTotalAmount(price);
            booking.setPaymentStatus("PAID");
            booking.setSpecificDate(request.getSpecificDate());
            booking.setHourlyStartTime(slot.getStartTime());
            booking.setHourlyEndTime(slot.getEndTime());
            booking.setNote(request.getNote());

            Booking saved = bookingRepository.save(booking);
            createdBookings.add(saved);
        }

        Payment payment = new Payment();
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(PaymentMethod.VNPAY);
        payment.setStatus(PaymentStatus.PAID);
        payment.setUser(user);
        payment.setBooking(createdBookings.get(0));
        paymentRepository.save(payment);

        Court court = courtRepository.findById(request.getCourtId()).orElseThrow();
        emailService.sendBookingConfirmationEmail(
                user.getEmail(),
                user.getUsername(),
                createdBookings.stream().map(b -> b.getId().toString()).collect(Collectors.joining(", ")),
                court.getName(),
                request.getSpecificDate().toString(),
                slots.stream().map(s -> s.getStartTime() + "-" + s.getEndTime()).collect(Collectors.joining(", ")),
                totalAmount,
                "PAID"
        );

        return createdBookings.get(0);
    }

    @Override
    @Transactional
    public Booking createMonthlyBooking(BookingRequest request) {
        LocalDate start = request.getContractStartDate();
        LocalDate end = request.getContractEndDate();
        DayOfWeekType repeatDayType = request.getRepeatDay();
        if (repeatDayType == null || repeatDayType.getJavaDayOfWeek() == null) {
            throw new IllegalArgumentException("Repeat day không hợp lệ.");
        }

        List<LocalDate> repeatDates = new ArrayList<>();
        LocalDate firstRepeatDate = start.with(TemporalAdjusters.nextOrSame(repeatDayType.getJavaDayOfWeek()));
        for (LocalDate date = firstRepeatDate; !date.isAfter(end); date = date.plusWeeks(1)) {
            repeatDates.add(date);
        }
        if (repeatDates.isEmpty()) {
            throw new IllegalArgumentException("Không có ngày lặp nào hợp lệ.");
        }

        for (LocalDate date : repeatDates) {
            boolean conflict = bookingRepository.existsConflict(
                    request.getCourtId(), date, request.getHourlyStartTime(), request.getHourlyEndTime()
            );
            if (conflict) {
                throw new IllegalArgumentException("Sân đã được đặt vào ngày " + date);
            }
        }

        Court court = courtRepository.findById(request.getCourtId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sân"));
        CourtVariant variant = court.getCourtVariant();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (LocalDate date : repeatDates) {
            BigDecimal price = calculatePrice(
                    variant.getId(), date, request.getHourlyStartTime(), request.getHourlyEndTime()
            );
            totalAmount = totalAmount.add(price);
        }

        String contractCode = "MONTHLY-" + System.currentTimeMillis();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user từ token: " + username));

        for (LocalDate date : repeatDates) {
            Booking booking = new Booking();
            booking.setBookingDate(LocalDateTime.now());
            booking.setTotalAmount(calculatePrice(
                    variant.getId(), date, request.getHourlyStartTime(), request.getHourlyEndTime()
            ));
            booking.setPaymentStatus("UNPAID");
            booking.setBookingType(bookingTypeRepository.findById(request.getBookingTypeId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy BookingType")));
            booking.setCourt(court);
            booking.setUser(user);
            booking.setSpecificDate(date);
            booking.setRepeatDay(repeatDayType);
            booking.setContractStartDate(start);
            booking.setContractEndDate(end);
            booking.setMonthlyFixedStartTime(request.getHourlyStartTime());
            booking.setMonthlyFixedEndTime(request.getHourlyEndTime());
            booking.setContractCode(contractCode);
            booking.setNote(request.getNote());
            bookingRepository.save(booking);
        }

        return bookingRepository.findFirstByContractCode(contractCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking vừa tạo"));
    }

    @Override
    @Transactional
    public Booking updatePaymentStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại."));
        if (status.equals("PAID")) {
            booking.setPaymentStatus("PAID");
        } else if (status.equals("CANCELLED")) {
            booking.setPaymentStatus("CANCELLED");
        }
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> searchByFieldName(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return bookingRepository.findAll();
        }
        return bookingRepository.searchByFieldName(keyword.trim());
    }

    @Override
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}