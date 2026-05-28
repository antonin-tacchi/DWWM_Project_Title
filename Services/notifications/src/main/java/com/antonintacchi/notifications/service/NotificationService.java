package com.antonintacchi.notifications.service;

import com.antonintacchi.notifications.client.DbNotificationClient;
import com.antonintacchi.notifications.dto.CreateNotificationRequest;
import com.antonintacchi.notifications.dto.NotificationDto;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final DbNotificationClient dbNotificationClient;

    public List<NotificationDto> getNotifications(Long userId) {
        return dbNotificationClient.findByUser(userId);
    }

    public NotificationDto createNotification(CreateNotificationRequest request) {
        Map<String, Object> body = Map.of(
                "userId",  request.getUserId(),
                "type",    request.getType(),
                "message", request.getMessage(),
                "isRead",  false
        );
        return dbNotificationClient.save(body);
    }

    public NotificationDto markAsRead(Long userId, Long notificationId) {
        NotificationDto notification = findOrThrow(notificationId);
        if (!notification.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your notification");
        }
        return dbNotificationClient.markAsRead(notificationId);
    }

    public void deleteNotification(Long userId, Long notificationId) {
        NotificationDto notification = findOrThrow(notificationId);
        if (!notification.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your notification");
        }
        dbNotificationClient.delete(notificationId);
    }

    /* ── Helpers ─────────────────────────────────────────────────── */

    private NotificationDto findOrThrow(Long id) {
        try {
            return dbNotificationClient.findById(id);
        } catch (FeignException.NotFound e) {
            throw new NoSuchElementException("Notification not found");
        }
    }

}
