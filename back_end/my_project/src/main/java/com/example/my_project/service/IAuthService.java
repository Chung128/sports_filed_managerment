package com.example.my_project.service;

import com.example.my_project.entity.User;
import com.example.my_project.record.LoginRequest;

public interface IAuthService {
    String register(String name, String username, String email, String password,
                    String phone, String address, String avatarUrl);
    String login(LoginRequest req);
    User getCurrentUser();
    User updateCurrentUser(User updatedUser);
    String loginWithGoogle(String idToken);
    void changePassword(Long userId ,String newPassword,String oldPassword);
}
