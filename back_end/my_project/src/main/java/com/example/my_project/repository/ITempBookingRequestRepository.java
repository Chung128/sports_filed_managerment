package com.example.my_project.repository;

import com.example.my_project.entity.TempBookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ITempBookingRequestRepository extends JpaRepository<TempBookingRequest, String> { }
