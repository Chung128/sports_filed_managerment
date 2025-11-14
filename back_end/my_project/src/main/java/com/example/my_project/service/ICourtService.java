package com.example.my_project.service;

import com.example.my_project.dto.admin.CourtResponseDTO;
import com.example.my_project.entity.Court;
import com.example.my_project.enums.StatusCourt;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ICourtService {
    List<Court> getCourtsByVariant(Long variantId);
    ResponseEntity<?> toggleStatus(Long id, StatusCourt newStatus);
}
