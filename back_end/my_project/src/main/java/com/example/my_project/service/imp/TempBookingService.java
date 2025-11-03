package com.example.my_project.service.imp;


import com.example.my_project.dto.BookingRequest;
import com.example.my_project.entity.TempBooking;
import com.example.my_project.repository.ITempBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TempBookingService {

    private final ITempBookingRepository tempRepo;
    private final SimpMessagingTemplate messagingTemplate;

    // Trong TempBookingService.java
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

            // TẠO TEMP VỚI createdAt = now()
            TempBooking temp = TempBooking.builder()
                    .courtId(request.getCourtId())
                    .specificDate(request.getSpecificDate())
                    .startTime(slot.getStartTime())
                    .endTime(slot.getEndTime())
                    .userId(request.getUserId())
                    .txnRef(txnRef)
                    .createdAt(LocalDateTime.now()) // GÁN RÕ RÀNG
                    .build();
            tempRepo.save(temp);
        }

        // GỬI REALTIME
        Map<String, Object> payload = new HashMap<>();
        payload.put("courtId", request.getCourtId());
        payload.put("date", request.getSpecificDate().toString());
        payload.put("slots", request.getTimeSlots());
        payload.put("action", "LOCK");

        messagingTemplate.convertAndSend("/topic/court/" + request.getCourtId(), payload);
    }

    @Transactional
    public void unlockSlots(String txnRef) {
        var temps = tempRepo.findByTxnRef(txnRef);
        tempRepo.deleteAll(temps);

        if (!temps.isEmpty()) {
            Map<String, Object> payload = new HashMap<>();
            payload.put("courtId", temps.get(0).getCourtId());
            payload.put("date", temps.get(0).getSpecificDate().toString());
            payload.put("action", "UNLOCK");
            messagingTemplate.convertAndSend("/topic/court/" + temps.get(0).getCourtId(), payload);
        }
    }

    @Scheduled(fixedRate = 300000) // 5 phút
    @Transactional
    public void cleanupExpired() {
        tempRepo.deleteByCreatedAtBefore(LocalDateTime.now().minusMinutes(10));
    }
}