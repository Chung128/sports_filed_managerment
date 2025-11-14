package com.example.my_project.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import com.example.my_project.enums.DayOfWeekType; // Enum cho ngày lặp lại

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //  Trường chung
    // @ManyToOne(fetch = FetchType.LAZY) private User user;
    private LocalDateTime bookingDate;
    private BigDecimal totalAmount;
    private String paymentStatus;

    // Phân loại Đặt sân ---
    @ManyToOne
    @JoinColumn(name = "booking_type_id", nullable = false)
    private BookingType bookingType; // Liên kết tới bảng BookingType

    // Sân vật lý được đặt (chủ yếu là 1 sân/booking)
    @ManyToOne
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    @ManyToOne
    @JoinColumn(name = "user_id") // Tên cột Foreign Key trong bảng 'bookings'
    private User user;

    // Trường cho Đặt theo GIỜ (Hourly) ---
    // Ngày cụ thể đặt sân
    private LocalDate specificDate;
    // Giờ bắt đầu
    private LocalTime hourlyStartTime;
    // Giờ kết thúc
    private LocalTime hourlyEndTime;

    // Trường cho Đặt theo THÁNG CỐ ĐỊNH (Monthly) ---
    // Ngày lặp lại trong tuần (ví dụ: MONDAY, WEDNESDAY) - Chỉ dùng cho loại MONTHLY
    @Enumerated(EnumType.STRING)
    private DayOfWeekType repeatDay;

    // Phạm vi áp dụng của hợp đồng
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    // Khung giờ cố định hàng tuần (lặp lại)
    private LocalTime monthlyFixedStartTime;
    private LocalTime monthlyFixedEndTime;

    //các trường này có thể NULL (không ràng buộc NOT NULL)
    // vì chúng chỉ được sử dụng cho một loại booking cụ thể.

    //Thêm contractCode để gom các booking theo hợp đồng
    @Column(length = 50)
    private String contractCode;
    private String note;
}