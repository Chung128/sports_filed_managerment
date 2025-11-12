package com.example.my_project.service;

import com.example.my_project.dto.admin.CourtResponseDTO;
import com.example.my_project.entity.Court;

import java.util.List;

public interface ICourtService {
    List<CourtResponseDTO> getAllCourts();
    CourtResponseDTO getCourtById(Long id);
    List<Court> getCourtsByVariant(Long variantId);
}
