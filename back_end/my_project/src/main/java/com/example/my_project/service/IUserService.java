package com.example.my_project.service;

import com.example.my_project.entity.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<User> findAll();
    Optional<User> findById(Long id);
    User save(User user);
    void deleteSoft(Long id);
    void delete(Long id);
    public User getCurrentUser();
}
