package com.antonintacchi.social.service;

import com.antonintacchi.social.client.DbCommentClient;
import com.antonintacchi.social.client.DbUserClient;
import com.antonintacchi.social.dto.comment.CommentDto;
import com.antonintacchi.social.dto.comment.CreateCommentRequest;
import com.antonintacchi.social.dto.comment.UpdateCommentRequest;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final DbCommentClient dbCommentClient;
    private final DbUserClient   dbUserClient;

    public List<CommentDto> getComments(Long tmdbId, String mediaType) {
        return dbCommentClient.findByMedia(tmdbId, mediaType);
    }

    public CommentDto createComment(Long userId, CreateCommentRequest request) {
        Map<String, Object> body = Map.of(
                "userId",    userId,
                "tmdbId",    request.getTmdbId(),
                "mediaType", request.getMediaType(),
                "content",   request.getContent()
        );
        CommentDto saved = dbCommentClient.save(body);
        try { dbUserClient.awardXp(userId, 10); } catch (Exception ignored) {}
        return saved;
    }

    public CommentDto updateComment(Long userId, Long commentId, UpdateCommentRequest request) {
        CommentDto comment = findCommentOrThrow(commentId);
        if (!comment.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your comment");
        }
        return dbCommentClient.update(commentId, Map.of("content", request.getContent()));
    }

    public void deleteComment(Long userId, Long commentId) {
        CommentDto comment = findCommentOrThrow(commentId);
        if (!comment.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your comment");
        }
        dbCommentClient.delete(commentId);
    }

    public void likeComment(Long userId, Long commentId) {
        // Vérifie que le commentaire existe
        findCommentOrThrow(commentId);

        if (Boolean.TRUE.equals(dbCommentClient.likeExists(userId, commentId))) {
            throw new IllegalStateException("Comment Already Liked");
        }
        dbCommentClient.addLike(Map.of("userId", userId, "commentId", commentId));
    }

    public void unlikeComment(Long userId, Long commentId) {
        dbCommentClient.removeLike(userId, commentId);
    }

    /* ── Helpers ─────────────────────────────────────────────────── */

    private CommentDto findCommentOrThrow(Long commentId) {
        try {
            return dbCommentClient.findById(commentId);
        } catch (FeignException.NotFound e) {
            throw new NoSuchElementException("Comment not found");
        }
    }

}
