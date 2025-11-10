package com.example.my_project.service;

import com.example.my_project.dto.admin.CourtResponseDTO;

import java.util.List;

public interface ICourtService {
    List<CourtResponseDTO> getAllCourts();
    CourtResponseDTO getCourtById(Long id);
}
