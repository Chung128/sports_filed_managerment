package com.example.my_project.service.imp;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendBookingConfirmationEmail(
            String to,
            String userName,
            String bookingId,
            String courtName,
            String specificDate,
            String timeRange,
            BigDecimal amount,
            String paymentStatus
    ) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // 🔹 Chuyển đổi trạng thái thanh toán sang tiếng Việt
        String paymentStatusText;
        switch (paymentStatus) {
            case "PAID" -> paymentStatusText = "Đã thanh toán thành công";
            case "FAILED" -> paymentStatusText = "Thanh toán thất bại";
            case "PENDING" -> paymentStatusText = " Đang chờ thanh toán";
            case "REFUNDED" -> paymentStatusText = " Đã hoàn tiền";
            default -> paymentStatusText = "Không xác định";
        }

        // Gắn các biến vào template
        Context context = new Context();
        context.setVariable("userName", userName);
        context.setVariable("bookingId", bookingId);
        context.setVariable("courtName", courtName);
        context.setVariable("specificDate", specificDate);
        context.setVariable("timeRange", timeRange);
        context.setVariable("amount", amount.toPlainString());
        context.setVariable("paymentStatusText", paymentStatusText);

        // Render HTML từ template
        String htmlContent = templateEngine.process("email_booking_court", context);

        helper.setTo(to);
        helper.setSubject("Xác nhận đặt sân thành công");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}
