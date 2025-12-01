package com.example.my_project.service.imp;

import com.example.my_project.entity.Conversation;
import com.example.my_project.repository.IConversationRepository;
import com.example.my_project.repository.IUserRepository;
import com.example.my_project.service.IConversationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversationService implements IConversationService {
    private final IConversationRepository conversationRepository;
    private final IUserRepository userRepository;

    public ConversationService(IConversationRepository conversationRepository, IUserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Conversation getOrCreateConversation(Long userId) {
        return conversationRepository.findByUser_Id(userId)
                .orElseGet(() -> {
                    try {
                        // 2. Nếu chưa có → tạo mới
                        Conversation convo = new Conversation();
                        convo.setUser(userRepository.findById(userId).orElseThrow());
                        return conversationRepository.save(convo);

                    } catch (Exception e) {
                        // 3. Nếu 2 request chạy cùng lúc → bắt lỗi duplicate và lấy lại conversation
                        return conversationRepository.findByUser_Id(userId).orElseThrow();
                    }
                });
    }

    @Override
    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    /** Đánh dấu đã đọc */
    @Override
    public Conversation markRead(Long conversationId, boolean isAdmin) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (isAdmin) {
            c.setAdminRead(true);
        } else {
            c.setUserRead(true);
        }

        return conversationRepository.save(c);
    }

}
