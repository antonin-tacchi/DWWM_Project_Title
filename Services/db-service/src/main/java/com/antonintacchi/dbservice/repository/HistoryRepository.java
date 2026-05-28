package com.antonintacchi.dbservice.repository;

import com.antonintacchi.dbservice.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findByUserIdOrderByConsultedAtDesc(Long userId);
    boolean existsByUserIdAndTmdbIdAndMediaType(Long userId, Long tmdbId, String mediaType);
}
