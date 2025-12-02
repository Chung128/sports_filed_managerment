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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private CourtVariant courtVariant;


    private LocalTime startTime;
    private LocalTime endTime;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeekType dayType;


    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String description;

    private boolean isActive = true;
}