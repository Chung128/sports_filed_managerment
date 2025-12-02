package com.example.my_project.service.imp;

import com.example.my_project.entity.Booking;
import com.example.my_project.entity.Court;
import com.example.my_project.enums.StatusCourt;
import com.example.my_project.repository.IBookingRepository;
import com.example.my_project.repository.ICourtRepository;
import com.example.my_project.service.ICourtService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
public class CourtService implements ICourtService {
    private final ICourtRepository courtRepository;
    private final IBookingRepository bookingRepository;

    public CourtService(ICourtRepository courtRepository, IBookingRepository bookingRepository) {
        this.courtRepository = courtRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<Court> getCourtsByVariant(Long variantId) {
        return courtRepository.findByCourtVariantId(variantId);
    }


    @Override
    public ResponseEntity<?> toggleStatus(Long id, StatusCourt newStatus) {

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court not found"));

        if (court.getStatus() == newStatus) {
            return ResponseEntity.ok(Map.of(
                    "message", "Trạng thái đã đúng, không cần cập nhật."
            ));
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<Booking> activeBookings = bookingRepository.findActiveBookingsByCourtId(id);

        boolean hasFutureBooking = activeBookings.stream().anyMatch(booking -> {

            //  Booking theo giờ (Hourly)
            if (booking.getSpecificDate() != null) {

                // Booking trong quá khứ hoàn toàn → KHÔNG chặn
                if (booking.getSpecificDate().isBefore(today)) return false;

                // Booking hôm nay → cần kiểm tra giờ
                if (booking.getSpecificDate().isEqual(today)) {
                    return booking.getHourlyEndTime() != null &&
                            booking.getHourlyEndTime().isAfter(now); // endTime > now → CHẶN
                }

                // Booking ngày tương lai → CHẶN
                return booking.getSpecificDate().isAfter(today);
            }

            return false;
        });

        if (hasFutureBooking) {
            return ResponseEntity.status(409).body(Map.of(
                    "message", "Sân đang có lịch đặt sắp diễn ra hoặc trong tương lai, không thể đổi trạng thái."
            ));
        }

        court.setStatus(newStatus);
        courtRepository.save(court);

        return ResponseEntity.ok(Map.of(
                "message", "Cập nhật trạng thái sân thành công!",
                "newStatus", newStatus
        ));
    }


}