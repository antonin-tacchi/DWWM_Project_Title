package com.antonintacchi.social.client;

import com.antonintacchi.social.dto.comment.CommentDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "db-service", contextId = "dbCommentClient")
public interface DbCommentClient {

    @GetMapping("/db/comments")
    List<CommentDto> findByMedia(@RequestParam Long tmdbId, @RequestParam String mediaType);

    @GetMapping("/db/comments/{id}")
    CommentDto findById(@PathVariable Long id);

    @PostMapping("/db/comments")
    CommentDto save(@RequestBody Map<String, Object> comment);

    @PutMapping("/db/comments/{id}")
    CommentDto update(@PathVariable Long id, @RequestBody Map<String, Object> patch);

    @DeleteMapping("/db/comments/{id}")
    void delete(@PathVariable Long id);

    /* ── Likes ───────────────────────────────────────────────────── */

    @GetMapping("/db/comments/likes/exists")
    Boolean likeExists(@RequestParam Long userId, @RequestParam Long commentId);

    @PostMapping("/db/comments/likes")
    void addLike(@RequestBody Map<String, Object> like);

    @DeleteMapping("/db/comments/likes/by-key")
    void removeLike(@RequestParam Long userId, @RequestParam Long commentId);

}
