package com.antonintacchi.notifications.controller;

import com.antonintacchi.notifications.dto.CreateNotificationRequest;
import com.antonintacchi.notifications.dto.NotificationDto;
import com.antonintacchi.notifications.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getAllNotifications(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.status(200).body(notificationService.getNotifications(userId));
    }

    @PostMapping
    public ResponseEntity<NotificationDto> addNotification(@Valid @RequestBody CreateNotificationRequest  createNotificationRequest) {
        return ResponseEntity.status(201).body(notificationService.createNotification(createNotificationRequest));
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDto> readNotification(@RequestHeader("X-User-Id") Long userId, @PathVariable Long notificationId) {
        return ResponseEntity.ok(notificationService.markAsRead(userId, notificationId));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@RequestHeader("X-User-Id") Long userId, @PathVariable Long notificationId) {
        notificationService.deleteNotification(userId, notificationId);
        return ResponseEntity.noContent().build();
    }

}
