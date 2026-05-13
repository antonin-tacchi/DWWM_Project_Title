package com.antonintacchi.social.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment_likes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentLike {

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long commentId;
    private LocalDateTime createdAt;

}
