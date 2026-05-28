package com.antonintacchi.dbservice.entity;

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
    private String language;
    private String theme;
    private Integer level;
    private Integer xp;
    private Long bannerTmdbId;
    private String bannerMediaType;
    private String bannerBackdropPath;
    private LocalDateTime createdAt;
    private String role;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.level == null)     this.level = 1;
        if (this.xp == null)        this.xp = 0;
        if (this.language == null)  this.language = "fr";
        if (this.theme == null)     this.theme = "dark";
        if (this.role == null)      this.role = "user";
    }

}
