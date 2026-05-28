package com.antonintacchi.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Représentation d'un utilisateur reçue depuis db-service.
 * Identique aux champs de l'entité User, mais sans annotations JPA.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {

    private Long id;
    private String username;
    private String email;
    private String passwordHash;
    private String avatarUrl;
    private String bio;
    private String language;
    private String theme;
    private Integer level;
    private Integer xp;
    private Long bannerTmdbId;
    private String bannerMediaType;
    private String bannerBackdropPath;
    private LocalDateTime createdAt;
    private String role;

}
