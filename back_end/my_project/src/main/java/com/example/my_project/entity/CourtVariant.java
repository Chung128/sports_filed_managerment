    package com.example.my_project.entity;

    import jakarta.persistence.*;
    import lombok.*;

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    @Entity
    @Table(name = "court_variant")
    public class CourtVariant {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "court_type_id", nullable = false)
        private CourtType courtType;

        // Ví dụ: "Sân 5 người", "Sân 11 người", "Sân Tennis cứng"
        private String variantName;

        // Số lượng người chơi tối đa/tiêu chuẩn (ví dụ: 5, 7, 11)
        private Integer capacity;

        private String description;
    }