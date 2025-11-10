//package com.example.my_project.service.vnpay;
//
//import com.example.my_project.config.vnpay.VNPayConfig;
//import com.example.my_project.dto.users.BookingRequest;
//import com.example.my_project.entity.TempBookingRequest;
//import com.example.my_project.repository.ITempBookingRequestRepository;
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Service;
//
//import javax.crypto.Mac;
//import javax.crypto.spec.SecretKeySpec;
//import java.math.BigDecimal;
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//import java.time.LocalDateTime;
//import java.util.Map;
//import java.util.TreeMap;
//
//@Service
//public class VNPAYService {
//
//    private static final Logger logger = LoggerFactory.getLogger(VNPAYService.class);
//    private final VNPayConfig vnPayConfig;
//    private final ITempBookingRequestRepository tempBookingRequestRepository;
//    private final ObjectMapper objectMapper;
//
//    public VNPAYService(VNPayConfig vnPayConfig, ITempBookingRequestRepository tempBookingRequestRepository, ObjectMapper objectMapper) {
//        this.vnPayConfig = vnPayConfig;
//        this.tempBookingRequestRepository = tempBookingRequestRepository;
//        this.objectMapper = objectMapper;
//    }
//
//    public void saveBookingRequestToTempStorage(String txnRef, BookingRequest request) throws JsonProcessingException {
//        TempBookingRequest temp = new TempBookingRequest();
//        temp.setTxnRef(txnRef);
//        temp.setRequestJson(objectMapper.writeValueAsString(request)); // Lưu JSON có timeSlots
//        tempBookingRequestRepository.save(temp);
//    }
//
////    public String generateVnpayUrl(BigDecimal amount, BookingRequest request, String vnp_TxnRef) {
////        Map<String, String> vnp_Params = new TreeMap<>();
////        vnp_Params.put("vnp_Version", vnPayConfig.getVnpVersion());
////        vnp_Params.put("vnp_Command", vnPayConfig.getVnpCommand());
////        vnp_Params.put("vnp_TmnCode", vnPayConfig.getVnpTmnCode());
////        vnp_Params.put("vnp_Amount", String.valueOf(amount.multiply(new BigDecimal("100")).longValue()));
////        vnp_Params.put("vnp_CurrCode", "VND");
////        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
////        vnp_Params.put("vnp_OrderInfo", "Thanh toan dat san: " + request.getCourtId());
////        vnp_Params.put("vnp_OrderType", vnPayConfig.getVnpOrderType());
////        vnp_Params.put("vnp_Locale", "vn");
////        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
////        vnp_Params.put("vnp_IpAddr", "127.0.0.1");
////        vnp_Params.put("vnp_CreateDate", LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
////
////        StringBuilder query = new StringBuilder();
////        for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
////            query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
////                    .append("=")
////                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8))
////                    .append("&");
////        }
////        String queryString = query.toString();
////        String signData = queryString.substring(0, queryString.length() - 1);
////        String vnp_SecureHash = HmacSHA512(signData, vnPayConfig.getVnpHashSecret());
////        queryString = queryString.substring(0, queryString.length() - 1) + "&vnp_SecureHash=" + vnp_SecureHash;
////
////        // Lưu BookingRequest vào DB
////        try {
////            String requestJson = objectMapper.writeValueAsString(request);
////            TempBookingRequest tempRequest = new TempBookingRequest(vnp_TxnRef, requestJson, LocalDateTime.now());
////            tempBookingRequestRepository.save(tempRequest);
////            logger.info("Saved BookingRequest to DB with txnRef: {}", vnp_TxnRef);
////        } catch (Exception e) {
////            logger.error("Failed to save BookingRequest to DB: {}", e.getMessage());
////            throw new RuntimeException("Không thể lưu thông tin đặt sân vào DB", e);
////        }
////
////        return vnPayConfig.getVnpUrl() + "?" + queryString;
////    }
//
//    public String generateVnpayUrl(BigDecimal amount, BookingRequest request, String vnp_TxnRef) {
//        // Tạo URL trước
//        Map<String, String> vnp_Params = new TreeMap<>();
//        // ... (giữ nguyên phần tạo URL)
//
//        StringBuilder query = new StringBuilder();
//        for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
//            query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
//                    .append("=")
//                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8))
//                    .append("&");
//        }
//        String queryString = query.toString();
//        String signData = queryString.substring(0, queryString.length() - 1);
//        String vnp_SecureHash = HmacSHA512(signData, vnPayConfig.getVnpHashSecret());
//        queryString = queryString.substring(0, queryString.length() - 1) + "&vnp_SecureHash=" + vnp_SecureHash;
//
//        // === CHỈ LƯU 1 LẦN TẠI ĐÂY ===
//        TempBookingRequest tempRequest = new TempBookingRequest();
//        try {
//            tempRequest.setTxnRef(vnp_TxnRef);
//            tempRequest.setRequestJson(objectMapper.writeValueAsString(request));
//            tempRequest.setCreatedAt(LocalDateTime.now());
//            tempBookingRequestRepository.save(tempRequest);
//            logger.info("Saved BookingRequest to temp storage: {}", vnp_TxnRef);
//        } catch (Exception e) {
//            logger.error("Failed to save temp booking request: {}", e.getMessage());
//            throw new RuntimeException("Lưu thông tin đặt sân thất bại", e);
//        }
//
//        return vnPayConfig.getVnpUrl() + "?" + queryString;
//    }
//
//    public BookingRequest retrieveBookingRequestFromTempStorage(String txnRef) {
//        try {
//            TempBookingRequest tempRequest = tempBookingRequestRepository.findById(txnRef)
//                    .orElseThrow(() -> new IllegalStateException("Không tìm thấy thông tin đặt sân cho giao dịch: " + txnRef));
//            logger.info("Retrieved BookingRequest from DB with txnRef: {}", txnRef);
//            return objectMapper.readValue(tempRequest.getRequestJson(), BookingRequest.class);
//        } catch (Exception e) {
//            logger.error("Failed to retrieve BookingRequest from DB: {}", e.getMessage());
//            throw new RuntimeException("Không thể lấy thông tin đặt sân từ DB", e);
//        }
//    }
//
//    public void deleteBookingRequestFromTempStorage(String txnRef) {
//        try {
//            tempBookingRequestRepository.deleteById(txnRef);
//            logger.info("Deleted BookingRequest from DB for txnRef: {}", txnRef);
//        } catch (Exception e) {
//            logger.warn("Failed to delete BookingRequest from DB: {}", e.getMessage());
//            throw new RuntimeException("Không thể xóa thông tin đặt sân từ DB", e);
//        }
//    }
//
//    private String HmacSHA512(String data, String key) {
//        try {
//            Mac mac = Mac.getInstance("HmacSHA512");
//            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
//            mac.init(secretKey);
//            byte[] hmacData = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
//            StringBuilder sb = new StringBuilder();
//            for (byte b : hmacData) {
//                sb.append(String.format("%02x", b));
//            }
//            return sb.toString();
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to generate HMAC SHA512", e);
//        }
//    }
//}

package com.example.my_project.service.vnpay;

import com.example.my_project.config.vnpay.VNPayConfig;
import com.example.my_project.dto.users.BookingRequest;
import com.example.my_project.entity.TempBookingRequest;
import com.example.my_project.repository.ITempBookingRequestRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TreeMap;

@Service
public class VNPAYService {

    private static final Logger logger = LoggerFactory.getLogger(VNPAYService.class);
    private final VNPayConfig vnPayConfig;
    private final ITempBookingRequestRepository tempBookingRequestRepository;
    private final ObjectMapper objectMapper;

    public VNPAYService(VNPayConfig vnPayConfig, ITempBookingRequestRepository tempBookingRequestRepository, ObjectMapper objectMapper) {
        this.vnPayConfig = vnPayConfig;
        this.tempBookingRequestRepository = tempBookingRequestRepository;
        this.objectMapper = objectMapper;
    }

    public String generateVnpayUrl(BigDecimal amount, BookingRequest request, String vnp_TxnRef) {
        if (vnp_TxnRef == null || vnp_TxnRef.trim().isEmpty()) {
            vnp_TxnRef = java.util.UUID.randomUUID().toString().replaceAll("-", "");
            logger.warn("vnp_TxnRef was null or empty. Generated new: {}", vnp_TxnRef);
        }

        Map<String, String> vnp_Params = new TreeMap<>();
        vnp_Params.put("vnp_Version", vnPayConfig.getVnpVersion());
        vnp_Params.put("vnp_Command", vnPayConfig.getVnpCommand());
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getVnpTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount.multiply(new BigDecimal("100")).longValue()));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Dat san " + request.getCourtId() + " ngay " + request.getSpecificDate());
        vnp_Params.put("vnp_OrderType", vnPayConfig.getVnpOrderType());
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
        vnp_Params.put("vnp_IpAddr", "127.0.0.1");

        // DÙNG ZonedDateTime ĐÚNG MÚI GIỜ VIỆT NAM
        String createDate = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        vnp_Params.put("vnp_CreateDate", createDate);

        // === TẠO QUERY STRING ===
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().trim().isEmpty()) {
                query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                        .append("=")
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8))
                        .append("&");
            }
        }

        // XÓA & CUỐI CÙNG
        String queryString = query.length() > 0 ? query.substring(0, query.length() - 1) : "";
        if (queryString.isEmpty()) {
            throw new IllegalStateException("Không thể tạo query string cho VNPAY");
        }

        // === TẠO CHỮ KÝ ===
        String vnp_SecureHash = HmacSHA512(queryString, vnPayConfig.getVnpHashSecret());
        String finalUrl = vnPayConfig.getVnpUrl() + "?" + queryString + "&vnp_SecureHash=" + vnp_SecureHash;

        // === LƯU TEMP BOOKING REQUEST ===
        try {
            TempBookingRequest temp = new TempBookingRequest();
            temp.setTxnRef(vnp_TxnRef);
            temp.setRequestJson(objectMapper.writeValueAsString(request));
            temp.setCreatedAt(LocalDateTime.now());
            tempBookingRequestRepository.save(temp);
            logger.info("Saved temp booking request: {}", vnp_TxnRef);
        } catch (Exception e) {
            logger.error("Failed to save temp booking: {}", e.getMessage(), e);
            throw new RuntimeException("Lưu thông tin đặt sân thất bại", e);
        }

        logger.info("Generated VNPAY URL: {}", finalUrl);
        return finalUrl;
    }

    public BookingRequest retrieveBookingRequestFromTempStorage(String txnRef) {
        try {
            TempBookingRequest temp = tempBookingRequestRepository.findById(txnRef)
                    .orElseThrow(() -> new IllegalStateException("Không tìm thấy giao dịch: " + txnRef));
            return objectMapper.readValue(temp.getRequestJson(), BookingRequest.class);
        } catch (Exception e) {
            logger.error("Failed to retrieve booking request: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể lấy thông tin đặt sân", e);
        }
    }

    public void deleteBookingRequestFromTempStorage(String txnRef) {
        try {
            tempBookingRequestRepository.deleteById(txnRef);
            logger.info("Deleted temp booking request: {}", txnRef);
        } catch (Exception e) {
            logger.warn("Failed to delete temp booking: {}", e.getMessage());
        }
    }

    private String HmacSHA512(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKey);
            byte[] hmacData = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hmacData) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo chữ ký VNPAY", e);
        }
    }
}