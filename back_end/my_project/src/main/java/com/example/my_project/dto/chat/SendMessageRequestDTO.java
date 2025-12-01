package com.example.my_project.dto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendMessageRequestDTO {
    private Long userId;
    private Long senderId; // user hoặc admin
    private String content;
}
