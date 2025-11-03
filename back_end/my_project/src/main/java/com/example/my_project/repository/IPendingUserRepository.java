package com.example.my_project.repository;

import com.example.my_project.otp.PendingUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IPendingUserRepository extends JpaRepository<PendingUser, Long> {
    Optional<PendingUser> findByEmail(String email);
}

