package com.example.my_project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "conversations")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    private boolean adminRead = true;  // Admin đã đọc?
    private boolean userRead = true;   // User đã đọc?

    @OneToOne
    @JoinColumn
    private User user;

    private LocalDateTime createdAt=LocalDateTime.now();

    private String lastMessageContent;
    private Date lastMessageTime;
    private Integer unreadCount = 0;
}
