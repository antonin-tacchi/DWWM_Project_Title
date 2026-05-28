package com.antonintacchi.dbservice.repository;

import com.antonintacchi.dbservice.entity.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    boolean existsByUserIdAndCommentId(Long userId, Long commentId);
    @Transactional
    void deleteByUserIdAndCommentId(Long userId, Long commentId);
}
