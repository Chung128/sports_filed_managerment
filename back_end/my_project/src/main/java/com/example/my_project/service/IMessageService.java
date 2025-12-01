package com.example.my_project.service;

import com.example.my_project.entity.Conversation;
import com.example.my_project.entity.Message;

import java.util.List;

public interface IMessageService {
    Message send(Conversation conversation, Long senderId, String content);
    List<Message> getMessages(Long conversationId);
    Message sendAsAdmin(Long userId, String content, Long adminId);
}
