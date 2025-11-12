package com.example.my_project.entity;

import com.example.my_project.enums.StatusCourt;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "courts")
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Enumerated(EnumType.STRING)
    private StatusCourt status;


    @ManyToOne
    @JoinColumn(name = "variant_id", nullable = false)
    private CourtVariant courtVariant;
}
