package com.example.my_project.service.imp;

import com.example.my_project.entity.CourtVariant;
import com.example.my_project.repository.ICourtVariantRepository;
import com.example.my_project.service.ICourtVariantService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourtVariantService implements ICourtVariantService {
    private final ICourtVariantRepository repository;

    public CourtVariantService(ICourtVariantRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<CourtVariant> getAllCourtVariants() {
        return repository.findAll();
    }
}
