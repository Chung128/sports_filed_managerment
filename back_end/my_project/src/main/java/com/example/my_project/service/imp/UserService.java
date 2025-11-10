package com.example.my_project.service.imp;

import com.example.my_project.dto.admin.UserDetailDTO;
import com.example.my_project.entity.Booking;
import com.example.my_project.entity.User;
import com.example.my_project.enums.Role;
import com.example.my_project.repository.IUserRepository;
import com.example.my_project.service.IBookingService;
import com.example.my_project.service.IUserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {
    private final IUserRepository userRepository;
    private final IBookingService bookingService;

    public UserService(IUserRepository userRepository, IBookingService bookingService) {
        this.userRepository = userRepository;
        this.bookingService = bookingService;
    }

    //lấy cả admin và user chưa bị xóa mềm
    @Override
    public List<User> findAll() {
        return userRepository.findByRoleAndSoftDeleteFalse(Role.USER);
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


    @Override
    public UserDetailDTO getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        List<Booking> bookings = bookingService.getBookingsByUserId(userId);

        List<UserDetailDTO.BookingInfo> bookingHistory = bookings.stream().map(b ->
                new UserDetailDTO.BookingInfo(
                        b.getId(),
                        b.getCourt().getName(),
                        b.getSpecificDate(),
                        b.getHourlyStartTime() + "-" + b.getHourlyEndTime(),
                        b.getPaymentStatus().equalsIgnoreCase("PAID") ? "completed" : "confirmed",
                        b.getTotalAmount()
                )
        ).toList();

        BigDecimal totalSpent = bookings.stream()
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new UserDetailDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatar(),
                user.getAddress(),
                bookings.size(),
                totalSpent,
                bookingHistory
        );
    }

}
