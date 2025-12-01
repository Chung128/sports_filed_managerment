package com.example.my_project.service;

import com.example.my_project.entity.Conversation;

import java.util.List;

public interface IConversationService {
    Conversation getOrCreateConversation(Long UserId);

    List<Conversation> getAllConversations();
    Conversation markRead(Long conversationId, boolean isAdmin);
}
