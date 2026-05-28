package com.antonintacchi.dbservice.repository;

import com.antonintacchi.dbservice.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    boolean existsByUserIdAndTmdbIdAndMediaType(Long userId, Long tmdbId, String mediaType);
    @Transactional
    void deleteByUserIdAndTmdbIdAndMediaType(Long userId, Long tmdbId, String mediaType);
}
