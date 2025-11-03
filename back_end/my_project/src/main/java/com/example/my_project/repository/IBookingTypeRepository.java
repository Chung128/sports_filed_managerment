package com.example.my_project.repository;

import com.example.my_project.entity.BookingType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IBookingTypeRepository extends JpaRepository<BookingType, Long> {
    Optional<BookingType> findByCode(String code);
}