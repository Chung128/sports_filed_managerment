package com.example.my_project.controller;

import com.example.my_project.dto.admin.UserDetailDTO;
import com.example.my_project.entity.User;
import com.example.my_project.service.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequestMapping("/api")
@RestController
public class UserController {
    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    //Lấy thông tin user
    @GetMapping("/admin/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }


    // Lấy thông tin 1 user theo id
    @GetMapping("/admin/{id}/add")
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
    @PutMapping("/admin/{id}/update")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.findById(id)
                .map(u -> {
                    user.setId(id);
                    return ResponseEntity.ok(userService.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Xóa mềm user
    @DeleteMapping("/admin/{id}/delete_soft")
    public ResponseEntity<Void> deleteSoftUser(@PathVariable Long id) {
        userService.deleteSoft(id);
        return ResponseEntity.noContent().build();
    }

    // Xóa mềm user
    @DeleteMapping("/admin/{id}/delete")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{id}/detail")
    public ResponseEntity<UserDetailDTO> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserDetail(id));
    }
}
