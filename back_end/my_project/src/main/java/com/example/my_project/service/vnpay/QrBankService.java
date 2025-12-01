package com.example.my_project.service.vnpay;

import com.example.my_project.dto.users.BookingRequest;
import com.example.my_project.entity.TempBookingRequest;
import com.example.my_project.repository.ITempBookingRequestRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.Base64;


@Service
@RequiredArgsConstructor
public class QrBankService {

    private final ITempBookingRequestRepository tempBookingRequestRepository;
    private final ObjectMapper objectMapper;

    private final String BANK_ID = "970407";
    private final String ACCOUNT_NO = "9334142098";
    private final String ACCOUNT_NAME = "TRAN VAN CHUNG";
    private final String PREFIX = "SAN-";



    public String generateQrCode(BigDecimal amount, String txnRef) {
        try {
            String addInfo = PREFIX + txnRef;
            String url = "https://img.vietqr.io/image/" + BANK_ID + "-" + ACCOUNT_NO +
                    "-compact.png?amount=" + amount.longValue() +
                    "&addInfo=" + addInfo +
                    "&accountName=" + ACCOUNT_NAME.replace(" ", "%20");

            byte[] qrBytes = new URL(url).openStream().readAllBytes();
            return Base64.getEncoder().encodeToString(qrBytes);

        } catch (Exception e) {
            throw new RuntimeException("Không tạo được QR", e);
        }
    }

    // ✔ Lưu request vào bảng temp_booking_request
    public void storePendingPayment(String txnRef, BookingRequest req, BigDecimal amount) {
        try {
            TempBookingRequest temp = new TempBookingRequest();
            temp.setTxnRef(txnRef);
            temp.setRequestJson(objectMapper.writeValueAsString(req));
            temp.setAmount(amount);
            temp.setCreatedAt(LocalDateTime.now());

            tempBookingRequestRepository.save(temp);

        } catch (Exception e) {
            throw new RuntimeException("Lưu pending thất bại", e);
        }
    }

    // ✔ Lấy request từ DB
    public BookingRequest getPendingRequest(String txnRef) {
        return tempBookingRequestRepository.findById(txnRef)
                .map(temp -> {
                    try {
                        return objectMapper.readValue(temp.getRequestJson(), BookingRequest.class);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .orElse(null);
    }

    // ✔ Lấy amount từ DB
    public BigDecimal getPendingAmount(String txnRef) {
        return tempBookingRequestRepository.findById(txnRef)
                .map(TempBookingRequest::getAmount)
                .orElse(null);
    }

    // ✔ Xóa toàn bộ temp booking khi xử lý xong
    public void deleteTemp(String txnRef) {
        try {
            tempBookingRequestRepository.deleteById(txnRef);
        } catch (Exception ignored) {}
    }
}


