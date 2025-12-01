package com.example.my_project.dto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminSendRequestDTO {
    private Long userId;
    private String content;
}