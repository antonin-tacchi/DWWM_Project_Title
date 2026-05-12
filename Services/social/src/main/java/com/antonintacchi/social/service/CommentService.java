package com.antonintacchi.social.service;

import com.antonintacchi.social.dto.comment.CommentDto;
import com.antonintacchi.social.dto.comment.CreateCommentRequest;
import com.antonintacchi.social.dto.comment.UpdateCommentRequest;
import com.antonintacchi.social.entity.Comment;
import com.antonintacchi.social.entity.CommentLike;
import com.antonintacchi.social.repository.CommentLikeRepository;
import com.antonintacchi.social.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    private final CommentLikeRepository commentLikeRepository;

    public List<CommentDto> getComments(Long tmdbId, String mediaType) {
        return commentRepository.findByTmdbIdAndMediaType(tmdbId, mediaType)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CommentDto createComment(Long userId, CreateCommentRequest request) {
        Comment comment = Comment.builder()
                .userId(userId)
                .tmdbId(request.getTmdbId())
                .mediaType(request.getMediaType())
                .content(request.getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);
        return toDto(savedComment);
    }

    public CommentDto updateComment(Long userId, Long commentId, UpdateCommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("comment not found"));
        if (!comment.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your comment");
        }
        comment.setContent(request.getContent());
        return toDto(commentRepository.save(comment));
    }

    public void deleteComment(Long userId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));
        if (!comment.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your comment");
        }
        commentRepository.delete(comment);
    }

    private CommentDto toDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .userId(comment.getUserId())
                .tmdbId(comment.getTmdbId())
                .mediaType(comment.getMediaType())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    public void likeComment(Long userId, Long commentId) {
        commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));
        if (commentLikeRepository.existsByUserIdAndCommentId(userId, commentId)) {
            throw new IllegalStateException("Comment Already Liked");
        }

        CommentLike like = CommentLike.builder()
                .commentId(commentId)
                .userId(userId)
                .build();

        commentLikeRepository.save(like);
    }

    public void unlikeComment(Long userId, Long commentId) {
        commentLikeRepository.deleteByUserIdAndCommentId(userId, commentId);
    }

}


