package com.antonintacchi.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String passwordHash;
    private String avatarUrl;
    private String bio;
    @Column(columnDefinition = "ENUM('fr', 'en')")
    private String language;

    @Column(columnDefinition = "ENUM('light', 'dark')")
    private String theme;

    private Integer level;
    private Integer xp;
    private Long bannerTmdbId;

    @Column(columnDefinition = "ENUM('movie', 'tv')")
    private String bannerMediaType;

    private LocalDateTime createdAt;

}
