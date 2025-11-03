package com.example.my_project.service.imp;

import com.example.my_project.otp.PendingUser;
import com.example.my_project.repository.IPendingUserRepository;
import com.example.my_project.service.IPendingUserService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PendingUserService implements IPendingUserService {
    private IPendingUserRepository pendingUserRepository;

    public PendingUserService(IPendingUserRepository pendingUserRepository) {
        this.pendingUserRepository = pendingUserRepository;
    }

    @Override
    public Optional<PendingUser> findByEmail(String email) {
        return pendingUserRepository.findByEmail(email);
    }

    @Override
    public PendingUser save(PendingUser pendingUser) {
        return pendingUserRepository.save(pendingUser);
    }

    @Override
    public void delete(Long id) {
        pendingUserRepository.deleteById(id);
    }
}
