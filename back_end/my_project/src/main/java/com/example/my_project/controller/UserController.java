package com.example.my_project.controller;

import com.example.my_project.entity.User;
import com.example.my_project.service.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

    @RequestMapping("api/users")
@RestController
public class UserController {
    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @GetMapping("")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    // Lấy thông tin 1 user theo id
    @GetMapping("/{id}/add")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tạo user mới
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.save(user));
    }

    // Cập nhật user
    @PutMapping("/{id}/update")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.findById(id)
                .map(u -> {
                    user.setId(id);
                    return ResponseEntity.ok(userService.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    // Xóa mềm user
    @DeleteMapping("/{id}/delete_soft")
    public ResponseEntity<Void> deleteSoftUser(@PathVariable Long id) {
        userService.deleteSoft(id);
        return ResponseEntity.noContent().build();
    }

    // Xóa mềm user
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
