package com.example.my_project.service.imp;

import com.example.my_project.entity.User;
import com.example.my_project.repository.IUserRepository;
import com.example.my_project.service.IUserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {
    private final IUserRepository userRepository;

    public UserService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findBySoftDeleteFalse();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteSoft(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setSoftDelete(true);
            userRepository.save(user);
        });
    }
    @Override
    public void delete(Long id) {
        userRepository.findById(id);
    }

    @Override
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new IllegalStateException("Người dùng chưa đăng nhập");
        }
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user: " + username));
    }
}
