package com.antonintacchi.social.repository;

import com.antonintacchi.social.entity.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    Boolean existsByUserIdAndCommentId(Long userId, Long commentId);
    @Transactional
    void deleteByUserIdAndCommentId(Long userId, Long commentId);

}
