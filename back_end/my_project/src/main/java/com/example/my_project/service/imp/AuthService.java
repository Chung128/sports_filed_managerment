package com.example.my_project.service.imp;

import com.example.my_project.entity.User;
import com.example.my_project.enums.Role;
import com.example.my_project.record.LoginRequest;
import com.example.my_project.repository.IUserRepository;
import com.example.my_project.security_config.JwtTokenProvider;
import com.example.my_project.service.IAuthService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
}