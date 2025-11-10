package com.example.my_project.repository;

import com.example.my_project.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface IBookingRepository extends JpaRepository<Booking, Long> {

    // Lấy tất cả booking của user (chưa bị xóa mềm nếu có cột softDelete)
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.specificDate DESC, b.hourlyStartTime ASC")
    List<Booking> findByUserId(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.court.id = :courtId AND b.specificDate = :date " +
            "AND (b.hourlyStartTime < :endTime AND b.hourlyEndTime > :startTime)")
    List<Booking> findTimeConflictsForHourly(Long courtId, LocalDate date, LocalTime startTime, LocalTime endTime);

    @Query("""
    SELECT COUNT(b) > 0 FROM Booking b
    WHERE b.court.id = :courtId
      AND b.specificDate = :date
      AND (
            (b.hourlyStartTime < :endTime AND b.hourlyEndTime > :startTime)
            OR
            (b.monthlyFixedStartTime < :endTime AND b.monthlyFixedEndTime > :startTime)
          )
""")
    boolean existsConflict(
            @Param("courtId") Long courtId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    Optional<Booking> findFirstByContractCode(String contractCode);


}
