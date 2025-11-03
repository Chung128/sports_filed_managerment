package com.example.my_project.repository;

import com.example.my_project.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ICourtRepository extends JpaRepository<Court, Long> {
    // 1. Tìm sân theo loại (variant)
    List<Court> findByCourtVariantId(Long variantId);
}