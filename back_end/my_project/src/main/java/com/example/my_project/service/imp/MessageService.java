package com.example.my_project.service.imp;

import com.example.my_project.dto.chat.MessageDTO;
import com.example.my_project.dto.chat.MessageMapper;
import com.example.my_project.entity.Conversation;
import com.example.my_project.entity.Message;
import com.example.my_project.entity.User;
import com.example.my_project.repository.IConversationRepository;
import com.example.my_project.repository.IMessageRepository;
import com.example.my_project.repository.IUserRepository;
import com.example.my_project.service.IMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService implements IMessageService {

    private final IUserRepository userRepository;
    private final IMessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final IConversationRepository conversationRepository;

    // ============================================================
    // USER SEND MESSAGE
    // ============================================================
    @Override
    @Transactional
    public Message send(Conversation conversation, Long senderId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(content);
        // createdAt đã được set mặc định trong entity = LocalDateTime.now()
        // Không cần set lại

        Message saved = messageRepository.saveAndFlush(message);

        MessageDTO dto = MessageMapper.toDTO(saved);

        // Gửi cập nhật danh sách cho admin
        messagingTemplate.convertAndSend("/topic/support.conversations", dto);

        // Gửi realtime cho user
        Long userId = conversation.getUser().getId();
        messagingTemplate.convertAndSend("/topic/support.conversation." + userId, dto);

        return saved;
    }

    // ============================================================
    // GET MESSAGE HISTORY
    // ============================================================
    @Override
    public List<Message> getMessages(Long conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    // ============================================================
    // ADMIN SEND MESSAGE – HOÀN CHỈNH, DÙNG LocalDateTime
    // ============================================================
    @Override
    @Transactional
    public Message sendAsAdmin(Long userId, String content, Long adminId) {

        // 1. Tìm hoặc tạo conversation
        Conversation c = conversationRepository.findByUser_Id(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found: " + userId));
                    Conversation newConv = new Conversation();
                    newConv.setUser(user);
                    newConv.setUserRead(false);
                    newConv.setAdminRead(true);
                    newConv.setUnreadCount(0);
                    newConv.setLastMessageContent("Bắt đầu hỗ trợ");
                    newConv.setLastMessageTime(new Date());
                    return conversationRepository.saveAndFlush(newConv);
                });

        // 2. Lấy admin
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + adminId));

        // 3. Cập nhật conversation
        c.setUserRead(false);
        c.setAdminRead(true);
        Integer currentUnread = c.getUnreadCount();
        c.setUnreadCount(currentUnread != null ? currentUnread + 1 : 1);
        c.setLastMessageContent(content);
        c.setLastMessageTime(new Date());

        conversationRepository.saveAndFlush(c);

        // 4. Tạo tin nhắn từ admin
        Message msg = new Message();
        msg.setConversation(c);
        msg.setSender(admin);
        msg.setContent(content);
        // createdAt sẽ tự động được gán LocalDateTime.now() nhờ default trong entity

        Message saved = messageRepository.saveAndFlush(msg);

        // 5. Chuyển sang DTO
        MessageDTO dto = MessageMapper.toDTO(saved);

        // 6. Gửi realtime
        messagingTemplate.convertAndSend("/topic/support.conversations", dto);
        messagingTemplate.convertAndSend("/topic/support.conversation." + userId, dto);
        messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/messages", dto);

        return saved;
    }
}