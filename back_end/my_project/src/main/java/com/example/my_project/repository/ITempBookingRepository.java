package com.example.my_project.repository;

import com.example.my_project.entity.TempBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ITempBookingRepository extends JpaRepository<TempBooking,Long> {
    @Query("""
        SELECT t FROM TempBooking t 
        WHERE t.courtId = :courtId 
          AND t.specificDate = :date 
          AND t.startTime < :endTime 
          AND t.endTime > :startTime
        """)
    List<TempBooking> findConflicts(Long courtId, LocalDate date, LocalTime startTime, LocalTime endTime);

    List<TempBooking> findByTxnRef(String txnRef);
    void deleteByCreatedAtBefore(java.time.LocalDateTime expiry);
    @Query("""
    SELECT t FROM TempBooking t 
    WHERE t.txnRef = :sessionId 
      AND t.courtId = :courtId 
      AND t.specificDate = :date
    """)
    List<TempBooking> findBySessionIdAndCourtIdAndDate(
            String sessionId,
            Long courtId,
            LocalDate date
    );
}
