package com.antonintacchi.movies.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class History {

    @PrePersist
    public void prePersist() {
        this.consultedAt = LocalDateTime.now();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long tmdbId;

    @Column(columnDefinition = "ENUM('movie', 'tv')")
    private String mediaType;

    private LocalDateTime consultedAt;

}
