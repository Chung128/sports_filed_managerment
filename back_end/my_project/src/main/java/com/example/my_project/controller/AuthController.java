package com.example.my_project.controller;

import com.example.my_project.entity.User;
import com.example.my_project.otp.PendingUser;
import com.example.my_project.record.AuthResponse;
import com.example.my_project.record.ChangePasswordRequest;
import com.example.my_project.record.GoogleLoginRequest;
import com.example.my_project.record.LoginRequest;
import com.example.my_project.repository.IUserRepository;
import com.example.my_project.service.IAuthService;
import com.example.my_project.service.IPendingUserService;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.security.Principal;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final IUserRepository userRepository;
    private final IAuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final IPendingUserService pendingUserService;
    private final ResourceLoader resourceLoader; // Inject ResourceLoader

    public AuthController(IUserRepository userRepository, IAuthService authService, PasswordEncoder passwordEncoder, JavaMailSender mailSender, IPendingUserService pendingUserService, ResourceLoader resourceLoader) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.pendingUserService = pendingUserService;
        this.resourceLoader = resourceLoader;
    }

    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<?> register(
            @RequestParam("name") String name,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar
    ) {
        try {
            String avatarUrl = null;
            if (avatar != null && !avatar.isEmpty()) {
                String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
                File uploadFolder = new File(uploadDir);
                if (!uploadFolder.exists()) uploadFolder.mkdirs();

                String filePath = uploadDir + File.separator + avatar.getOriginalFilename();
                avatar.transferTo(new File(filePath));
                avatarUrl = "/uploads/" + avatar.getOriginalFilename();
            }

            // Tạo mã OTP ngẫu nhiên
            String otp = String.format("%06d", (int) (Math.random() * 1000000));

            //  Lưu tạm thông tin vào một bảng trung gian (hoặc cache tạm)
            PendingUser pending = new PendingUser(name, username, email, password, phone, address, avatarUrl, otp);
            pendingUserService.save(pending);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Lấy nội dung HTML đã được định dạng
            String htmlContent = generateOtpEmailHtml(otp, name); // Gọi hàm tạo HTML

            helper.setTo(email);
            helper.setSubject("Xác thực tài khoản");
            helper.setText(htmlContent, true); // <--- Tham số TRUE là BẮT BUỘC cho HTML

            mailSender.send(message);

            return ResponseEntity.ok("Đã gửi OTP về email, vui lòng xác thực để hoàn tất đăng ký!");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Lỗi upload ảnh: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi gửi OTP: " + e.getMessage());
        }
    }

    //hàm lấy trang html
    private String generateOtpEmailHtml(String otp, String userName) throws IOException {

        // 1. ĐỊNH NGHĨA VỊ TRÍ FILE TRONG RESOURCES
        Resource resource = resourceLoader.getResource("classpath:templates/otp_email_template.html");

        // 2. ĐỌC NỘI DUNG FILE VÀO STRING
        String templateContent;
        try (InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            // Sử dụng FileCopyUtils để dễ dàng đọc toàn bộ nội dung stream thành String
            templateContent = FileCopyUtils.copyToString(reader);
        } catch (IOException e) {
            // Xử lý lỗi nếu không tìm thấy file hoặc lỗi đọc file
            throw new IOException("Không thể đọc template email OTP: " + e.getMessage(), e);
        }

        // 3. THAY THẾ PLACEHOLDER
        String htmlContent = templateContent
                .replace("{{userName}}", userName)
                .replace("{{otpCode}}", otp);

        return htmlContent;
    }


    @PostMapping("/verify_otp")
    public ResponseEntity<?> verifyOtp(
            @RequestParam("email") String email,
            @RequestParam("otp") String otp
    ) {
        try {
            PendingUser pending = pendingUserService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin đăng ký tạm"));

            if (!pending.getOtp().equals(otp)) {
                return ResponseEntity.badRequest().body("Mã OTP không đúng");
            }

            // Gọi hàm register như bạn yêu cầu
            authService.register(
                    pending.getName(),
                    pending.getUsername(),
                    pending.getEmail(),
                    pending.getPassword(),
                    pending.getPhone(),
                    pending.getAddress(),
                    pending.getAvatarUrl()
            );

            // Xóa bản ghi tạm sau khi xác thực thành công
            pendingUserService.delete(pending.getId());

            return ResponseEntity.ok("Xác thực thành công, tài khoản đã được tạo!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xác thực OTP: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        try {
            String token = authService.login(req);
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            logger.error("Lỗi đăng nhập: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(null));
        }
    }

    //    @GetMapping("/me")
//    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
//        if (authentication == null || authentication.getName() == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
//        }
//        String username = authentication.getName();
//        try {
//            User user = userRepository.findByUsername(username)
//                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
//            return ResponseEntity.ok(user);
//        } catch (RuntimeException e) {
//            logger.error("Lỗi lấy thông tin user: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
//        }
//    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        // ⚠️ Nếu không có token hoặc token sai, không ném lỗi → chỉ trả về "anonymous"
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.ok("anonymous");
        }

        String username = authentication.getName();
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            logger.error("Lỗi lấy thông tin user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        }
    }

    @PutMapping(value = "/me", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateCurrentUser(
            @RequestParam("name") String name,
            @RequestParam("phone") String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "softDelete", required = false) Boolean softDelete
    ) {
        try {
            User user = authService.getCurrentUser();

            user.setName(name);
            user.setPhone(phone);
            user.setAddress(address);

            if (password != null && !password.isEmpty()) {
                user.setPassword(passwordEncoder.encode(password));
            }

            if (softDelete != null) {
                user.setSoftDelete(softDelete);
            }

            // nếu có ảnh thì lưu lại
            if (avatar != null && !avatar.isEmpty()) {
                String fileName = avatar.getOriginalFilename();
                String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                File dest = new File(uploadDir + File.separator + fileName);
                avatar.transferTo(dest);

                user.setAvatar("/uploads/" + fileName);
            }

            userRepository.save(user);
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Lỗi cập nhật user: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public  ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal principal) {
        try {
            String username=principal.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
            authService.changePassword(user.getId(),request.oldPassword(),request.newPassword());

            return ResponseEntity.ok("Đổi mật khẩu thành công");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        try {
            String token = authService.loginWithGoogle(request.idToken());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            e.printStackTrace(); // thêm để xem lỗi thật
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null));
        }
    }

}