package com.example.my_project.repository;

import com.example.my_project.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IConversationRepository extends JpaRepository<Conversation,Long> {
    Optional<Conversation> findByUser_Id(Long userId);
}
