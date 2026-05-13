package com.antonintacchi.notifications.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDto {

    private Long id;
    private Long userId;
    private String type;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;

}
