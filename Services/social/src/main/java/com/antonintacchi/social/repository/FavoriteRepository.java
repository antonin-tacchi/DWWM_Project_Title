package com.antonintacchi.social.repository;

import com.antonintacchi.social.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserId(Long id);
    Boolean existsByUserIdAndTmdbIdAndMediaType(Long userId, Long tmdbId, String mediaType);
    void deleteByUserIdAndTmdbIdAndMediaType(Long userId, Long tmdbId, String mediaType);

}
