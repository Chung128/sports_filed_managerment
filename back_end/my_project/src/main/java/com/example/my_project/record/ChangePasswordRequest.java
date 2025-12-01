package com.example.my_project.record;

public record ChangePasswordRequest(
        String oldPassword,
        String newPassword
) {}