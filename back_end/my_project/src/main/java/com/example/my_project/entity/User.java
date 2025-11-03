package com.example.my_project.entity;


import com.example.my_project.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private  String name;
    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Pattern(
            regexp = "^[a-z0-9]{4,20}$",
            message = "Tên đăng nhập phải từ 4 đến 20 ký tự, chỉ bao gồm chữ thường chữ số và không có ký tự đặc biệt"
    )
    private String username;

    private String avatar;
    private String phone;
    private String address;

    private String password;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    private boolean softDelete;

    private boolean enabled = false;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
}
