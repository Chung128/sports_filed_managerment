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

        private String variantName;

        private Integer capacity;

        private String description;
    }