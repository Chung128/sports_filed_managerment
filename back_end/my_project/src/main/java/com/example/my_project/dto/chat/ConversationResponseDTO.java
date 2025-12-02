package com.example.my_project.dto.chat;

import com.example.my_project.entity.Message;
import com.example.my_project.entity.User;
import lombok.Data;

@Data
public class ConversationResponseDTO {
    private Long id;
    private User user;
    private Message lastMessage;
    private long unreadCount;
}