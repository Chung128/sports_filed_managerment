package com.example.my_project.service.imp;

import com.example.my_project.entity.User;
import com.example.my_project.enums.Role;
import com.example.my_project.record.LoginRequest;
import com.example.my_project.repository.IUserRepository;
import com.example.my_project.security_config.JwtTokenProvider;
import com.example.my_project.service.IAuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService implements IAuthService {
    private final IUserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(IUserRepository userRepository, JwtTokenProvider jwtTokenProvider, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String register(String name, String username, String email, String password,
                           String phone, String address, String avatarUrl) {

        if (userRepository.existsByUsername(username)) {

            throw new RuntimeException("Tên người dùng đã tồn tại.");
        }

        if (userRepository.existsByEmail(email)) {
            System.out.println("Email này đã có người dùng");
            throw new RuntimeException("Email này đã có người dùng.");
        }

        User user = new User();
        user.setName(name);
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setAddress(address);
        user.setAvatar(avatarUrl);
        user.setRole(Role.USER);

        userRepository.save(user);
        return "Register successful";
    }

    @Override
    public String login(LoginRequest req) {
        System.out.println("LOGIN REQUEST: " + req.username());
        User user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new RuntimeException("User not found: " + req.username()));

        System.out.println("FOUND USER: " + user.getUsername());
        boolean match = passwordEncoder.matches(req.password(), user.getPassword());
        System.out.println("PASSWORD MATCH: " + match);

        if (!match) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.generateToken(user); // Sử dụng JwtTokenProvider
        System.out.println("GENERATED TOKEN: " + token);
        return token;
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("User not authenticated");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User updateCurrentUser(User updatedUser) {
        User user = getCurrentUser();
        user.setName(updatedUser.getName());
        user.setPhone(updatedUser.getPhone());
        user.setAvatar(updatedUser.getAvatar());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(user);
    }

//    @Override
//    public String loginWithGoogle(String idToken) {
//        try {
//            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier
//                    .Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
//                    .setAudience(Collections.singletonList("372998325078-1rtdln50u6o3apfgm294icrpru8itp5b.apps.googleusercontent.com")) // ⚠️ FE OAuth Client ID
//                    .build();
//
//            GoogleIdToken googleIdToken = verifier.verify(idToken);
//
//            if (googleIdToken == null) {
//                throw new RuntimeException("Invalid Google ID Token");
//            }
//
//            GoogleIdToken.Payload payload = googleIdToken.getPayload();
//
//            String email = payload.getEmail();
//            String name = (String) payload.get("name");
//            String avatar = (String) payload.get("picture");
//
//            // Kiểm tra user đã tồn tại chưa?
//            User user = userRepository.findByEmail(email).orElse(null);
//
//            if (user == null) {
//                // Tạo user mới
//                user = new User();
//                user.setUsername(email); // username = email
//                user.setEmail(email);
//                user.setName(name);
//                user.setAvatar(avatar);
//                user.setRole(Role.USER);
//                user.setPassword(passwordEncoder.encode("GOOGLE_USER")); // Fake password
//                userRepository.save(user);
//            }
//
//            // Generate JWT
//            return jwtTokenProvider.generateToken(user);
//
//        } catch (Exception e) {
//            throw new RuntimeException("Google login failed: " + e.getMessage());
//        }
//    }
@Override
public String loginWithGoogle(String idToken) {
    try {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier
                .Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList("372998325078-1rtdln50u6o3apfgm294icrpru8itp5b.apps.googleusercontent.com"))
                .build();

        GoogleIdToken googleIdToken = verifier.verify(idToken);

        if (googleIdToken == null) {
            throw new RuntimeException("Invalid Google ID Token");
        }

        GoogleIdToken.Payload payload = googleIdToken.getPayload();

        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String avatar = (String) payload.get("picture");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {

            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setAvatar(avatar);
            user.setRole(Role.USER);
            user.setPassword(passwordEncoder.encode("GOOGLE_USER"));

            // ⛔ DON'T USE email as username (violates @Pattern)
            //user.setUsername(email);

            // ✔ Create random username
            user.setUsername("user" + System.currentTimeMillis());

            // Google user enabled luôn
            user.setEnabled(true);

            userRepository.save(user);
        }

        return jwtTokenProvider.generateToken(user);

    } catch (Exception e) {
        throw new RuntimeException("Google login failed: " + e.getMessage());
    }
}

    @Override
    public void changePassword(Long UserId, String oldPassword, String newPassword) {
        User user=userRepository.findById(UserId)
                .orElseThrow(() -> new RuntimeException("Người dừng không tồn tại"));
        if (!passwordEncoder.matches(oldPassword,user.getPassword())){
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }
        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }
}