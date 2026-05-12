package com.antonintacchi.social.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorites")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Favorite {

    @PrePersist
    public void prePersist() {
        this.addedAt = LocalDateTime.now();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long tmdbId;
    private String mediaType;
    private LocalDateTime addedAt;

}
