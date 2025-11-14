package com.example.my_project.controller;


import com.example.my_project.entity.Court;
import com.example.my_project.entity.CourtVariant;
import com.example.my_project.enums.StatusCourt;
import com.example.my_project.service.ICourtService;

import com.example.my_project.service.ICourtVariantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields")
public class CourtController {

    private final ICourtService courtService;
    private final ICourtVariantService courtVariantService;

    public CourtController(ICourtService courtService, ICourtVariantService courtVariantService) {
        this.courtService = courtService;
        this.courtVariantService = courtVariantService;
    }

    //đổi trang thái sân
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateCourtStatus(
            @PathVariable Long id,
            @RequestParam("status") StatusCourt status
    ) {
        return courtService.toggleStatus(id, status);
    }



    @GetMapping("/variant/{variantId}")
    public ResponseEntity<List<Court>> getCourtsByVariant(@PathVariable Long variantId) {
        List<Court> courts = courtService.getCourtsByVariant(variantId);
        return ResponseEntity.ok(courts);
    }

    @GetMapping("types")
    public List<CourtVariant> getAllCourtTypes() {
        return courtVariantService.getAllCourtVariants();
    }

}