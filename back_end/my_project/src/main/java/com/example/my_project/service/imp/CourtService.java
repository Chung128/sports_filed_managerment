package com.example.my_project.service.imp;


import com.example.my_project.dto.admin.CourtResponseDTO;
import com.example.my_project.entity.Court;
import com.example.my_project.repository.ICourtRepository;
import com.example.my_project.service.ICourtService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourtService implements ICourtService {
    private final ICourtRepository courtRepository;

    public CourtService(ICourtRepository courtRepository) {
        this.courtRepository = courtRepository;
    }

    @Override
    public List<CourtResponseDTO> getAllCourts() {
        return courtRepository.findAll().stream().map(court -> {
            CourtResponseDTO dto = new CourtResponseDTO();
            dto.setId(court.getId());
            dto.setName(court.getName());
            dto.setType(court.getCourtVariant().getVariantName());
            dto.setDescription(court.getCourtVariant().getDescription());
            dto.setStatus(court.getStatus());
            dto.setPricePerHour(getPriceByVariant(court.getCourtVariant().getVariantName())); // giả lập giá
            dto.setImage(getImageByVariant(court.getCourtVariant().getVariantName())); // giả lập ảnh
            return dto;
        }).toList();
    }

    @Override
    public CourtResponseDTO getCourtById(Long id) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sân"));
        return new CourtResponseDTO(
                court.getId(),
                court.getName(),
                court.getCourtVariant().getVariantName(),
                getPriceByVariant(court.getCourtVariant().getVariantName()),
                court.getStatus(),
                getImageByVariant(court.getCourtVariant().getVariantName()),
                court.getCourtVariant().getDescription()
        );
    }

    // Giả lập giá theo loại sân
    private Double getPriceByVariant(String variant) {
        if (variant.contains("5")) return 350000.0;
        if (variant.contains("7")) return 500000.0;
        if (variant.contains("11")) return 900000.0;
        return 400000.0;
    }

    // Giả lập ảnh minh họa theo loại sân
    private String getImageByVariant(String variant) {
        if (variant.contains("5"))
            return "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400";
        if (variant.contains("7"))
            return "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400";
        if (variant.contains("11"))
            return "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400";
        return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400";
    }
}