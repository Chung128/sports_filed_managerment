package com.example.my_project.service.imp;

import com.example.my_project.entity.CourtType;
import com.example.my_project.repository.ICourtTypeRepository;
import com.example.my_project.service.ICourtTypeService;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CourtTypeService implements ICourtTypeService {
    private final ICourtTypeRepository courtTypeRepository;

    public CourtTypeService(ICourtTypeRepository courtTypeRepository) {
        this.courtTypeRepository = courtTypeRepository;
    }

    @Override
    public List<CourtType> getAllCourtTypes() {
        return courtTypeRepository.findAll();
    }
}
