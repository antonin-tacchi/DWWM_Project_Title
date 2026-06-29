package com.antonintacchi.dbservice.repository;

import com.antonintacchi.dbservice.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTmdbIdAndMediaType(Long tmdbId, String mediaType);
    long countByUserId(Long userId);
}
