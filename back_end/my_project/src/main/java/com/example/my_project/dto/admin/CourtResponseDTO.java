package com.example.my_project.dto.admin;

import com.example.my_project.enums.StatusCourt;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourtResponseDTO {
    private Long id;
    private String name;
    private String type; // ví dụ: "5v5" | "7v7" | "11v11"
    private Double pricePerHour;
    private StatusCourt status;
    private String image;
    private String description;
}