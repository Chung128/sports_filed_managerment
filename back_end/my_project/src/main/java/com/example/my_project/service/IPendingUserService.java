package com.example.my_project.service;

import com.example.my_project.entity.User;
import com.example.my_project.otp.PendingUser;

import java.util.Optional;

public interface IPendingUserService {
    Optional<PendingUser> findByEmail(String email);
    PendingUser save(PendingUser pendingUser);
    void delete(Long id);
}
