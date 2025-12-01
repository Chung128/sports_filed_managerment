package com.example.my_project.controller;

import com.example.my_project.details.CustomUserDetails;
import com.example.my_project.dto.chat.AdminSendRequestDTO;
import com.example.my_project.dto.chat.MessageDTO;
import com.example.my_project.dto.chat.MessageMapper;
import com.example.my_project.dto.chat.SendMessageRequestDTO;
import com.example.my_project.entity.Conversation;
import com.example.my_project.entity.Message;
import com.example.my_project.service.IConversationService;
import com.example.my_project.service.IMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportChatController {

    private final IConversationService conversationService;
    private final IMessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    // ============================================================
    // USER SEND MESSAGE
    // ============================================================
    @PostMapping("/send")
    public MessageDTO send(@RequestBody SendMessageRequestDTO req) {

        Conversation c = conversationService.getOrCreateConversation(req.getUserId());

        Message saved = messageService.send(c, req.getSenderId(), req.getContent());

        return MessageMapper.toDTO(saved);
    }

    // ============================================================
    // GET HISTORY
    // ============================================================
    @GetMapping("/history/{userId}")
    public List<MessageDTO> getHistory(@PathVariable Long userId) {

        Conversation c = conversationService.getOrCreateConversation(userId);

        return messageService.getMessages(c.getId())
                .stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // ADMIN — GET ALL CONVERSATIONS
    // ============================================================
    @GetMapping("/conversations")
    public List<Conversation> getAllConversations() {
        return conversationService.getAllConversations();
    }

    // ============================================================
    // STOMP SEND MESSAGE
    // ============================================================
    @MessageMapping("/chat.send")
    public void handleMessage(@Payload SendMessageRequestDTO dto) {
        Conversation c = conversationService.getOrCreateConversation(dto.getUserId());
        Message saved = messageService.send(c, dto.getSenderId(), dto.getContent());

        MessageDTO dtoMsg = MessageMapper.toDTO(saved);

        // Gửi cập nhật danh sách
        messagingTemplate.convertAndSend("/topic/support.conversations", dtoMsg);

        // Gửi realtime theo userId (không phải conversationId)
        messagingTemplate.convertAndSend("/topic/support.conversation." + dto.getUserId(), dtoMsg);
    }

    // ============================================================
    // ADMIN SEND MESSAGE
    // ============================================================
//    @PostMapping("/send-admin")
//    public ResponseEntity<MessageDTO> sendAsAdmin(@RequestBody AdminSendRequestDTO req) {
//
//        Message saved = messageService.sendAsAdmin(req.getUserId(), req.getContent());
//
//        MessageDTO dto = MessageMapper.toDTO(saved);
//
//        messagingTemplate.convertAndSend("/topic/support.conversations", dto);
//
//        messagingTemplate.convertAndSend(
//                "/topic/support.conversation." + saved.getConversation().getId(),
//                dto
//        );
//
//        return ResponseEntity.ok(dto);
//    }
    @PostMapping("/send-admin")
    public ResponseEntity<MessageDTO> sendAsAdmin(
            @RequestBody AdminSendRequestDTO req,
            @AuthenticationPrincipal CustomUserDetails adminDetails) {

        Long adminId = adminDetails.getId(); // Lấy từ token

        Message saved = messageService.sendAsAdmin(
                req.getUserId(),
                req.getContent(),
                adminId    // truyền vào đây
        );

        return ResponseEntity.ok(MessageMapper.toDTO(saved));
    }

    // ============================================================
    // MARK AS READ
    // ============================================================
    @PostMapping("/{id}/mark-read")
    public ResponseEntity<Conversation> markRead(
            @PathVariable Long id,
            Principal principal
    ) {
        boolean isAdmin = principal != null && principal.getName().equals("admin");

        Conversation c = conversationService.markRead(id, isAdmin);

        return ResponseEntity.ok(c);
    }
}
