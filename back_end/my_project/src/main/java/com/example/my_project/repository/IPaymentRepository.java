package com.example.my_project.repository;

import com.example.my_project.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPaymentRepository extends JpaRepository<Payment,Long> {
}
