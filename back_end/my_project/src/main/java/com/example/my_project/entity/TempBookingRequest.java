package com.example.my_project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "temp_booking_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TempBookingRequest {
    @Id
    private String txnRef;

    @Column(columnDefinition = "TEXT")
    private String requestJson;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    private BigDecimal amount;
}