package com.example.my_project.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalTime;
import com.example.my_project.enums.DayOfWeekType; // Đã sửa đổi

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "price_rules")
public class PriceRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với loại sân chi tiết (Sân 5 người, Sân Tennis chuẩn, v.v.)
    // Đây là yếu tố định giá CƠ BẢN.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private CourtVariant courtVariant;

    // Khung giờ áp dụng
    // Ví dụ: 18:00 (Giờ cao điểm)
    private LocalTime startTime;
    // Ví dụ: 22:00
    private LocalTime endTime;

    // Ngày trong tuần áp dụng (MONDAY, WEEKDAY, WEEKEND, ALL_DAYS)
    // Đây là yếu tố định giá THỜI GIAN
    @Enumerated(EnumType.STRING)
    @Column(nullable = false) // Đảm bảo luôn có loại ngày áp dụng
    private DayOfWeekType dayType;

    // Giá thuê (BigDecimal là chuẩn mực cho tiền tệ)
    @Column(nullable = false, precision = 10, scale = 2) // Giả sử precision 10, scale 2
    private BigDecimal price;

    private String description; // Ví dụ: "Giá Giờ Cao Điểm Mùa Hè"

    // Có thể thêm trường isActive để bật/tắt luật giá dễ dàng
    private boolean isActive = true;
}