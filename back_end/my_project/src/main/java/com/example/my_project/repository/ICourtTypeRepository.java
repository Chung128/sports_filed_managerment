package com.example.my_project.repository;

import com.example.my_project.entity.CourtType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICourtTypeRepository extends JpaRepository<CourtType,Long> {
}
