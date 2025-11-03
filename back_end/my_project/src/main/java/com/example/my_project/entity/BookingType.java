package com.example.my_project.entity;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "booking_type")
public class BookingType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ví dụ: "HOURLY", "MONTHLY_FIXED", "EVENT_PACKAGE"
    @Column(unique = true)
    private String code;

    // Tên hiển thị (Ví dụ: "Đặt theo giờ", "Hợp đồng tháng cố định")
    private String name;

    private String description;
}