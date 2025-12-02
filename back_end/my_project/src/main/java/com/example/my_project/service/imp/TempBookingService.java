//package com.example.my_project.service.imp;
//
//
//import com.example.my_project.dto.users.BookingRequest;
//import com.example.my_project.entity.TempBooking;
//import com.example.my_project.repository.ITempBookingRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//@RequiredArgsConstructor
//public class TempBookingService {
//
//    private final ITempBookingRepository tempRepo;
//    private final SimpMessagingTemplate messagingTemplate;
//
//    // Trong TempBookingService.java
//    @Transactional
//    public void lockSlots(BookingRequest request, String txnRef) {
//        for (var slot : request.getTimeSlots()) {
//            var conflicts = tempRepo.findConflicts(
//                    request.getCourtId(),
//                    request.getSpecificDate(),
//                    slot.getStartTime(),
//                    slot.getEndTime()
//            );
//
//            boolean lockedByOthers = conflicts.stream()
//                    .anyMatch(t -> !t.getTxnRef().equals(txnRef));
//
//            if (lockedByOthers) {
//                throw new IllegalStateException(
//                        "Khung giờ " + slot.getStartTime() + " - " + slot.getEndTime() + " đã có người đặt!"
//                );
//            }
//
//            // TẠO TEMP VỚI createdAt = now()
//            TempBooking temp = TempBooking.builder()
//                    .courtId(request.getCourtId())
//                    .specificDate(request.getSpecificDate())
//                    .startTime(slot.getStartTime())
//                    .endTime(slot.getEndTime())
//                    .userId(request.getUserId())
//                    .txnRef(txnRef)
//                    .createdAt(LocalDateTime.now()) // GÁN RÕ RÀNG
//                    .build();
//            tempRepo.save(temp);
//        }
//
//        // GỬI REALTIME
//        Map<String, Object> payload = new HashMap<>();
//        payload.put("courtId", request.getCourtId());
//        payload.put("date", request.getSpecificDate().toString());
//        payload.put("slots", request.getTimeSlots());
//        payload.put("action", "LOCK");
//
//        messagingTemplate.convertAndSend("/topic/court/" + request.getCourtId(), payload);
//    }
//
//    @Transactional
//    public void unlockSlots(String txnRef) {
//        var temps = tempRepo.findByTxnRef(txnRef);
//        tempRepo.deleteAll(temps);
//
//        if (!temps.isEmpty()) {
//            Map<String, Object> payload = new HashMap<>();
//            payload.put("courtId", temps.get(0).getCourtId());
//            payload.put("date", temps.get(0).getSpecificDate().toString());
//            payload.put("action", "UNLOCK");
//            messagingTemplate.convertAndSend("/topic/court/" + temps.get(0).getCourtId(), payload);
//        }
//    }
//
//    @Scheduled(fixedRate = 300000) // 5 phút
//    @Transactional
//    public void cleanupExpired() {
//        tempRepo.deleteByCreatedAtBefore(LocalDateTime.now().minusMinutes(10));
//    }
//}
        package com.example.my_project.service.imp;

import com.example.my_project.dto.users.BookingRequest;
import com.example.my_project.entity.Booking;
import com.example.my_project.entity.TempBooking;
import com.example.my_project.repository.ITempBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TempBookingService {

    private final ITempBookingRepository tempRepo;
    private final ApplicationEventPublisher eventPublisher;
    private final SimpMessagingTemplate messagingTemplate;

    // KHÓA SLOT
    @Transactional
    public void lockSlots(BookingRequest request, String txnRef) {
        for (var slot : request.getTimeSlots()) {
            var conflicts = tempRepo.findConflicts(
                    request.getCourtId(),
                    request.getSpecificDate(),
                    slot.getStartTime(),
                    slot.getEndTime()
            );

            boolean lockedByOthers = conflicts.stream()
                    .anyMatch(t -> !t.getTxnRef().equals(txnRef));

            if (lockedByOthers) {
                throw new IllegalStateException(
                        "Khung giờ " + slot.getStartTime() + " - " + slot.getEndTime() + " đã có người đặt!"
                );
            }

            TempBooking temp = TempBooking.builder()
                    .courtId(request.getCourtId())
                    .specificDate(request.getSpecificDate())
                    .startTime(slot.getStartTime())
                    .endTime(slot.getEndTime())
                    .userId(request.getUserId())
                    .txnRef(txnRef)
                    .createdAt(LocalDateTime.now())
                    .build();

            tempRepo.save(temp);
        }

        eventPublisher.publishEvent(new BookingEvent(
                request.getCourtId(),
                request.getSpecificDate(),
                "LOCK",
                request.getTimeSlots()
        ));
    }

    //  MỞ KHÓA SLOT (dùng khi payment thất bại hoặc request không tồn tại)
    @Transactional
    public void unlockSlots(String txnRef) {
        List<TempBooking> temps = tempRepo.findByTxnRef(txnRef);
        if (temps.isEmpty()) return;

        Long courtId = temps.get(0).getCourtId();
        LocalDate date = temps.get(0).getSpecificDate();

        tempRepo.deleteAll(temps);

        // Publish UNLOCK event (AFTER commit)
        eventPublisher.publishEvent(new BookingEvent(courtId, date, "UNLOCK", temps));
    }

    //  XÓA TEMPS SAU KHI ĐÃ TẠO BOOKING THẬT
    @Transactional
    public void deleteTempsAndPublishBooked(String txnRef, Booking booking) {
        List<TempBooking> temps = tempRepo.findByTxnRef(txnRef);
        if (temps.isEmpty()) return;

        Long courtId = temps.get(0).getCourtId();
        LocalDate date = temps.get(0).getSpecificDate();


        tempRepo.deleteAll(temps);

        // Prepare payload slots as simple maps
        List<Map<String, String>> slots = new ArrayList<>();
        for (TempBooking t : temps) {
            slots.add(Map.of(
                    "startTime", t.getStartTime().toString(),
                    "endTime", t.getEndTime().toString()
            ));
        }

        eventPublisher.publishEvent(new BookingEventWithMeta(courtId, date, "BOOKED", slots, booking.getId()));
    }

    //  XÓA HẾT BOOKING QUÁ HẠN
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void cleanupExpired() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(10);
        List<TempBooking> expired = tempRepo.findByCreatedAtBefore(cutoff);
        if (expired.isEmpty()) return;

        Map<String, List<TempBooking>> grouped = new HashMap<>();
        for (TempBooking t : expired) {
            String key = t.getCourtId() + "_" + t.getSpecificDate();
            grouped.computeIfAbsent(key, k -> new ArrayList<>()).add(t);
        }

        tempRepo.deleteAll(expired);

        for (List<TempBooking> group : grouped.values()) {
            eventPublisher.publishEvent(new BookingEvent(
                    group.get(0).getCourtId(),
                    group.get(0).getSpecificDate(),
                    "UNLOCK",
                    group
            ));
        }
    }

    //  XỬ LÝ EVENT SAU KHI COMMIT -> gửi WebSocket
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleBookingEvent(Object evt) {
        // We accept two event types: BookingEvent (raw slots as TimeSlot or TempBooking)
        // and BookingEventWithMeta (pre-formatted slots + bookingId).
        Map<String, Object> payload = new HashMap<>();
        Long courtId = null;

        if (evt instanceof BookingEvent be) {
            courtId = be.courtId();
            payload.put("courtId", courtId);
            payload.put("date", be.date().toString());
            payload.put("action", be.action());

            List<Map<String, String>> slots = new ArrayList<>();
            for (Object item : be.slots()) {
                if (item instanceof BookingRequest.TimeSlot ts) {
                    slots.add(Map.of(
                            "startTime", ts.getStartTime().toString(),
                            "endTime", ts.getEndTime().toString()
                    ));
                } else if (item instanceof TempBooking tb) {
                    slots.add(Map.of(
                            "startTime", tb.getStartTime().toString(),
                            "endTime", tb.getEndTime().toString()
                    ));
                }
            }
            payload.put("slots", slots);
        } else if (evt instanceof BookingEventWithMeta bem) {
            courtId = bem.courtId();
            payload.put("courtId", courtId);
            payload.put("date", bem.date().toString());
            payload.put("action", bem.action());
            payload.put("slots", bem.slots());
            payload.put("bookingId", bem.bookingId()); // optional meta useful for FE
        } else {

            return;
        }


        messagingTemplate.convertAndSend("/topic/court/" + courtId, payload);
    }

    //  API gọi từ Controller -> trả về List<Map<String,String>> (FE đang dùng kiểu này)
    public List<Map<String, String>> getLockedSlots(Long courtId, LocalDate date) {
        List<TempBooking> temps = tempRepo.findByCourtIdAndSpecificDate(courtId, date);
        List<Map<String, String>> slots = new ArrayList<>();
        for (TempBooking t : temps) {
            slots.add(Map.of(
                    "startTime", t.getStartTime().toString(),
                    "endTime", t.getEndTime().toString()
            ));
        }
        return slots;
    }


    public record BookingEvent(Long courtId, LocalDate date, String action, List<?> slots) {}
    public record BookingEventWithMeta(Long courtId, LocalDate date, String action, List<Map<String,String>> slots, Long bookingId) {}
}
