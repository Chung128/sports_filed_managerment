package com.example.my_project.dto.chat;

import com.example.my_project.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private Long id;
    private Long conversationId;
    private User sender;
    private String content;
    private LocalDateTime createdAt;
}
