package com.antonintacchi.social.controller;

import com.antonintacchi.social.dto.comment.CommentDto;
import com.antonintacchi.social.dto.comment.CreateCommentRequest;
import com.antonintacchi.social.dto.comment.UpdateCommentRequest;
import com.antonintacchi.social.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentDto>> getAllComments(@RequestParam Long tmdbId, @RequestParam String mediaType) {
        return ResponseEntity.ok(commentService.getComments(tmdbId, mediaType));
    }

    @PostMapping
    public ResponseEntity<CommentDto> addComment(@RequestHeader("X-User-Id") Long userId, @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.status(201).body(commentService.createComment(userId, request));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDto> updateComment(@RequestHeader("X-User-Id") Long userId, @PathVariable Long commentId, @Valid @RequestBody UpdateCommentRequest request) {
        return ResponseEntity.status(200).body(commentService.updateComment(userId, commentId, request));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@RequestHeader("X-User-Id") Long userId, @PathVariable Long commentId) {
        commentService.deleteComment(userId, commentId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<Void> addLike(@RequestHeader("X-User-Id") Long userId,  @PathVariable Long commentId) {
        commentService.likeComment(userId, commentId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{commentId}/like")
    public ResponseEntity<Void> unlikeComment(@RequestHeader("X-User-Id") Long userId,  @PathVariable Long commentId) {
        commentService.unlikeComment(userId, commentId);
        return ResponseEntity.noContent().build();
    }

}
