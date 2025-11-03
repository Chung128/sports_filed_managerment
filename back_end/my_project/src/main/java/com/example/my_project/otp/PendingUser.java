package com.example.my_project.otp;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import jakarta.persistence.*;


@Getter
@Setter
@Entity
public class PendingUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String username;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String avatarUrl;
    private String otp;
    private LocalDateTime createdAt = LocalDateTime.now();

    public PendingUser() {}

    public PendingUser(String name, String username, String email, String password,
                       String phone, String address, String avatarUrl, String otp) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.avatarUrl = avatarUrl;
        this.otp = otp;
    }

}