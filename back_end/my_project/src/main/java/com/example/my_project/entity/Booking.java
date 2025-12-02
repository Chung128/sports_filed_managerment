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


    @ManyToOne
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    private LocalDate specificDate;

    private LocalTime hourlyStartTime;

    private LocalTime hourlyEndTime;


    @Enumerated(EnumType.STRING)
    private DayOfWeekType repeatDay;

    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private LocalTime monthlyFixedStartTime;
    private LocalTime monthlyFixedEndTime;


    @Column(length = 50)
    private String contractCode;
    private String note;
}