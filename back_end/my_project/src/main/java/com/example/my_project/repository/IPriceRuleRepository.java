package com.example.my_project.repository;

import com.example.my_project.entity.PriceRule;
import com.example.my_project.enums.DayOfWeekType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface IPriceRuleRepository extends JpaRepository<PriceRule, Long> {
    /**
     * Truy vấn luật giá theo loại sân, thời gian và nhóm ngày.
     * Logic nghiệp vụ về ưu tiên sẽ được xử lý ở tầng Service.
     */
    @Query("SELECT pr FROM PriceRule pr WHERE pr.courtVariant.id = :variantId AND pr.isActive = true " +
            "AND pr.startTime <= :time AND pr.endTime > :time AND pr.dayType IN :dayTypes")
    List<PriceRule> findApplicablePriceRules(
            @Param("variantId") Long variantId,
            @Param("time") LocalTime time,
            @Param("dayTypes") List<DayOfWeekType> dayTypes
    );

    @Query("SELECT p FROM PriceRule p " +
            "WHERE p.courtVariant.id = :variantId " +
            "AND p.dayType = :dayType " +
            "AND :startTime >= p.startTime " +
            "AND :endTime <= p.endTime " +
            "AND p.isActive = true")
    Optional<PriceRule> findMatchingRule(
            @Param("variantId") Long variantId,
            @Param("dayType") DayOfWeekType dayType,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

}
