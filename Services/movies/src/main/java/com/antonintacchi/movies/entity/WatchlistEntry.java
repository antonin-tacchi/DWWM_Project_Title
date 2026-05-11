package com.antonintacchi.movies.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "watchlist_entries")
public class WatchlistEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private Long tmdbId;

    @Column(columnDefinition = "ENUM('movie', 'tv')")
    private String mediaType;

    private LocalDateTime addedAt;

    @PrePersist
    public void addedAt() {
        this.addedAt = LocalDateTime.now();
    }
}

