package com.antonintacchi.dbservice.repository;

import com.antonintacchi.dbservice.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByTmdbIdAndMediaType(Long tmdbId, String mediaType);
    Optional<Rating> findByUserIdAndTmdbIdAndMediaType(Long userId, Long tmdbId, String mediaType);
    boolean existsByUserIdAndTmdbIdAndMediaType(Long userId, Long tmdbId, String mediaType);
    long countByUserId(Long userId);
}
