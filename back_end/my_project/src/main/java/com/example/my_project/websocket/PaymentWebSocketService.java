package com.example.my_project.websocket;

import com.example.my_project.dto.users.BookingResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentWebSocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public void notifyPaymentSuccess(String txnRef, BookingResponseDTO booking) {
        messagingTemplate.convertAndSend("/topic/payment/" + txnRef, booking);
    }
}