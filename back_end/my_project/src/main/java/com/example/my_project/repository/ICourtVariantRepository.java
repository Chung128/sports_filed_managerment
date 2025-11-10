package com.example.my_project.repository;

import com.example.my_project.entity.CourtVariant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICourtVariantRepository extends JpaRepository<CourtVariant,Long> {
}
