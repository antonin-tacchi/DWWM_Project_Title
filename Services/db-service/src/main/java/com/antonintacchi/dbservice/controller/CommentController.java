package com.antonintacchi.dbservice.controller;

import com.antonintacchi.dbservice.entity.Comment;
import com.antonintacchi.dbservice.entity.CommentLike;
import com.antonintacchi.dbservice.repository.CommentLikeRepository;
import com.antonintacchi.dbservice.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/db/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentRepository    commentRepository;
    private final CommentLikeRepository commentLikeRepository;

    /* ── Comments ────────────────────────────────────────────────── */

    @GetMapping
    public ResponseEntity<List<Comment>> findByMedia(
            @RequestParam Long tmdbId,
            @RequestParam String mediaType) {
        return ResponseEntity.ok(commentRepository.findByTmdbIdAndMediaType(tmdbId, mediaType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> findById(@PathVariable Long id) {
        return commentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Comment> save(@RequestBody Comment comment) {
        comment.setId(null);
        return ResponseEntity.ok(commentRepository.save(comment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> update(@PathVariable Long id, @RequestBody Comment patch) {
        return commentRepository.findById(id).map(c -> {
            c.setContent(patch.getContent());
            return ResponseEntity.ok(commentRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!commentRepository.existsById(id)) return ResponseEntity.notFound().build();
        commentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ── Comment Likes ───────────────────────────────────────────── */

    @GetMapping("/likes/exists")
    public ResponseEntity<Boolean> likeExists(
            @RequestParam Long userId,
            @RequestParam Long commentId) {
        return ResponseEntity.ok(
                commentLikeRepository.existsByUserIdAndCommentId(userId, commentId));
    }

    @PostMapping("/likes")
    public ResponseEntity<CommentLike> addLike(@RequestBody CommentLike like) {
        like.setId(null);
        return ResponseEntity.ok(commentLikeRepository.save(like));
    }

    @DeleteMapping("/likes/by-key")
    public ResponseEntity<Void> removeLike(
            @RequestParam Long userId,
            @RequestParam Long commentId) {
        commentLikeRepository.deleteByUserIdAndCommentId(userId, commentId);
        return ResponseEntity.noContent().build();
    }

}
