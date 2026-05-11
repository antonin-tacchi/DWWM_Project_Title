package com.antonintacchi.movies.repository;

import com.antonintacchi.movies.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {

    List<History> findByUserIdOrderByConsultedAtDesc(Long userId);
    Boolean existsByUserIdAndTmdbIdAndMediaType(Long userId, Long tmdbId, String mediaType);

}
