package com.antonintacchi.notifications.service;

import com.antonintacchi.notifications.dto.CreateNotificationRequest;
import com.antonintacchi.notifications.dto.NotificationDto;
import com.antonintacchi.notifications.entity.Notification;
import com.antonintacchi.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationDto> getNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public NotificationDto createNotification(CreateNotificationRequest  request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .message(request.getMessage())
                .isRead(false)
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        return toDto(savedNotification);

    }

    public NotificationDto markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found"));
        if (!notification.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your notification");
        }
        notification.setIsRead(Boolean.TRUE);
        notificationRepository.save(notification);
        return toDto(notification);
    }

    public void deleteNotification(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found"));
        if (!notification.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your notification");
        }
        notificationRepository.delete(notification);
    }


    private NotificationDto toDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

}
