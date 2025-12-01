package com.example.my_project.repository;

import com.example.my_project.entity.User;
import com.example.my_project.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String username);

    // Lấy tất cả user chưa bị xóa mềm
    List<User> findBySoftDeleteFalse();

    // Lấy tất cả user có role USER và chưa bị xóa mềm
    List<User> findByRoleAndSoftDeleteFalse(Role role);
}
