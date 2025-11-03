package com.example.my_project.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "temp_bookings", indexes = {
        @Index(name = "idx_court_date", columnList = "courtId, specificDate")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TempBooking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long courtId;
    private LocalDate specificDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long userId;
    private String txnRef;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}