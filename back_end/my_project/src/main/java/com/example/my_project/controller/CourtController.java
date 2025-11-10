package com.example.my_project.controller;


import com.example.my_project.dto.admin.CourtResponseDTO;
import com.example.my_project.entity.CourtType;
import com.example.my_project.service.ICourtService;
import com.example.my_project.service.ICourtTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fields")
public class CourtController {

    private final ICourtService courtService;
    private final ICourtTypeService courtTypeService;

    public CourtController(ICourtService courtService, ICourtTypeService courtTypeService) {
        this.courtService = courtService;
        this.courtTypeService = courtTypeService;
    }

    @GetMapping
    public List<CourtResponseDTO> getAllCourts() {
        return courtService.getAllCourts();
    }

    @GetMapping("types")
    public List<CourtType> getAllCourtTypes() {
        return courtTypeService.getAllCourtTypes();
    }

    @GetMapping("/{id}")
    public CourtResponseDTO getCourtById(@PathVariable Long id) {
        return courtService.getCourtById(id);
    }
}