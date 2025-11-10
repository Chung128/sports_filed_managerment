//package com.example.my_project.controller;
//import com.example.my_project.dto.users.BookingRequest;
//import com.example.my_project.service.imp.TempBookingService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.messaging.handler.annotation.DestinationVariable;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.stereotype.Controller;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Controller
//@RequiredArgsConstructor
//public class WebSocketController {
//
//    private final TempBookingService tempBookingService;
//
//    record LockMessage(
//            LocalDate date,
//            List<BookingRequest.TimeSlot> slots,
//            String sessionId
//    ) {}
//
//    @MessageMapping("/court/{courtId}/lock")
//    public void lock(@DestinationVariable Long courtId, LockMessage msg) {
//        tempBookingService.lockSlotsRealtime(courtId, msg.date(), msg.slots(), msg.sessionId());
//    }
//
//    @MessageMapping("/court/{courtId}/unlock")
//    public void unlock(@DestinationVariable Long courtId, LockMessage msg) {
//        tempBookingService.unlockSlotsRealtime(courtId, msg.date(), msg.slots(), msg.sessionId());
//    }
//}
