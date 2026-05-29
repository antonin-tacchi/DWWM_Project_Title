package com.antonintacchi.auth.controller;

import com.antonintacchi.auth.client.DbAdminLogClient;
import com.antonintacchi.auth.client.DbCommentAdminClient;
import com.antonintacchi.auth.client.DbRatingAdminClient;
import com.antonintacchi.auth.client.DbStatsClient;
import com.antonintacchi.auth.client.DbUserClient;
import com.antonintacchi.auth.client.NotificationsClient;
import com.antonintacchi.auth.dto.AuthResponse;
import com.antonintacchi.auth.mapper.UserMapper;
import com.antonintacchi.auth.model.UserModel;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

/**
 * Endpoints réservés aux administrateurs.
 * La Gateway vérifie que X-User-Role == "admin" avant de laisser passer.
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DbUserClient         dbUserClient;
    private final DbStatsClient        dbStatsClient;
    private final DbCommentAdminClient dbCommentAdminClient;
    private final DbRatingAdminClient  dbRatingAdminClient;
    private final DbAdminLogClient     dbAdminLogClient;
    private final NotificationsClient  notificationsClient;
    private final UserMapper           userMapper;

    /* ── Users ───────────────────────────────────────────────────── */

    @GetMapping("/users")
    public ResponseEntity<List<AuthResponse>> getAllUsers() {
        List<AuthResponse> users = dbUserClient.findAll()
                .stream()
                .map(userMapper::toAuthResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<AuthResponse> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-User-Id", required = false) Long adminId) {

        String newRole = body.get("role");
        if (newRole == null || (!newRole.equals("user") && !newRole.equals("admin"))) {
            return ResponseEntity.badRequest().build();
        }

        UserModel user;
        try {
            user = dbUserClient.findById(id);
        } catch (FeignException.NotFound e) {
            throw new NoSuchElementException("User not found");
        }

        String oldRole = user.getRole();
        user.setRole(newRole);
        UserModel updated = dbUserClient.update(id, user);

        log(adminId, "CHANGE_ROLE", "user", id,
                user.getUsername() + " : " + oldRole + " → " + newRole);

        return ResponseEntity.ok(userMapper.toAuthResponse(updated));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long adminId) {

        UserModel user;
        try {
            user = dbUserClient.findById(id);
        } catch (FeignException.NotFound e) {
            return ResponseEntity.notFound().build();
        }

        dbUserClient.delete(id);
        log(adminId, "DELETE_USER", "user", id, user.getUsername() + " (" + user.getEmail() + ")");
        return ResponseEntity.noContent().build();
    }

    /* ── Comments ────────────────────────────────────────────────── */

    @GetMapping("/comments")
    public ResponseEntity<List<Map<String, Object>>> getAllComments() {
        return ResponseEntity.ok(dbCommentAdminClient.findAll());
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long adminId) {

        try {
            dbCommentAdminClient.delete(id);
            log(adminId, "DELETE_COMMENT", "comment", id, "Comment #" + id);
            return ResponseEntity.noContent().build();
        } catch (FeignException.NotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    /* ── Ratings ─────────────────────────────────────────────────── */

    @GetMapping("/ratings")
    public ResponseEntity<List<Map<String, Object>>> getAllRatings() {
        return ResponseEntity.ok(dbRatingAdminClient.findAll());
    }

    @DeleteMapping("/ratings/{id}")
    public ResponseEntity<Void> deleteRating(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long adminId) {

        try {
            dbRatingAdminClient.delete(id);
            log(adminId, "DELETE_RATING", "rating", id, "Rating #" + id);
            return ResponseEntity.noContent().build();
        } catch (FeignException.NotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    /* ── Logs ────────────────────────────────────────────────────── */

    @GetMapping("/logs")
    public ResponseEntity<List<Map<String, Object>>> getLogs() {
        return ResponseEntity.ok(dbAdminLogClient.findAll());
    }

    /* ── Stats ───────────────────────────────────────────────────── */

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(dbStatsClient.getStats());
    }

    /* ── Notifications ───────────────────────────────────────────── */

    /**
     * Envoie une notification à un utilisateur spécifique.
     * Body : { "userId": 42, "type": "info", "message": "..." }
     */
    @PostMapping("/notifications/send")
    public ResponseEntity<Map<String, Object>> sendNotification(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "X-User-Id", required = false) Long adminId) {

        Long userId  = Long.valueOf(body.get("userId").toString());
        String type    = body.getOrDefault("type", "info").toString();
        String message = body.getOrDefault("message", "").toString();

        Map<String, Object> payload = new HashMap<>();
        payload.put("userId",  userId);
        payload.put("type",    type);
        payload.put("message", message);

        Map<String, Object> result = notificationsClient.send(payload);
        log(adminId, "SEND_NOTIFICATION", "user", userId, "type=" + type);
        return ResponseEntity.ok(result);
    }

    /**
     * Envoie une notification à tous les utilisateurs (broadcast).
     * Body : { "type": "info", "message": "..." }
     */
    @PostMapping("/notifications/broadcast")
    public ResponseEntity<Map<String, Object>> broadcastNotification(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "X-User-Id", required = false) Long adminId) {

        String type    = body.getOrDefault("type", "info").toString();
        String message = body.getOrDefault("message", "").toString();

        List<UserModel> users = dbUserClient.findAll();
        List<Long> failed = new ArrayList<>();

        for (UserModel user : users) {
            try {
                Map<String, Object> payload = new HashMap<>();
                payload.put("userId",  user.getId());
                payload.put("type",    type);
                payload.put("message", message);
                notificationsClient.send(payload);
            } catch (Exception e) {
                failed.add(user.getId());
            }
        }

        log(adminId, "BROADCAST_NOTIFICATION", "all", null,
                "type=" + type + " | sent=" + (users.size() - failed.size()) + "/" + users.size());

        Map<String, Object> result = new HashMap<>();
        result.put("total",  users.size());
        result.put("sent",   users.size() - failed.size());
        result.put("failed", failed.size());
        return ResponseEntity.ok(result);
    }

    /* ── Helper ──────────────────────────────────────────────────── */

    private void log(Long adminId, String action, String targetType, Long targetId, String details) {
        try {
            dbAdminLogClient.save(Map.of(
                    "adminId",    adminId != null ? adminId : 0L,
                    "action",     action,
                    "targetType", targetType,
                    "targetId",   targetId,
                    "details",    details != null ? details : ""
            ));
        } catch (Exception ignored) {
            // Ne pas faire échouer l'action principale si le log échoue
        }
    }
}
