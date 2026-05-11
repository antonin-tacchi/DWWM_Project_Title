package com.antonintacchi.movies.repository;

import com.antonintacchi.movies.entity.WatchlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<WatchlistEntry, Long> {
    List<WatchlistEntry> findByUserEmailOrderByAddedAtDesc(String email);
    Optional<WatchlistEntry> findByUserEmailAndTmdbIdAndMediaType(String userEmail, Long tmdbId, String mediaType);
    Boolean existsByUserEmailAndTmdbIdAndMediaType(String userEmail, Long tmdbId, String mediaType);
}
