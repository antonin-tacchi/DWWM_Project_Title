package com.antonintacchi.notifications.client;

import com.antonintacchi.notifications.dto.NotificationDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "db-service", contextId = "dbNotificationClient")
public interface DbNotificationClient {

    @GetMapping("/db/notifications")
    List<NotificationDto> findByUser(@RequestParam Long userId);

    @GetMapping("/db/notifications/unread")
    List<NotificationDto> findUnread(@RequestParam Long userId);

    @GetMapping("/db/notifications/{id}")
    NotificationDto findById(@PathVariable Long id);

    @PostMapping("/db/notifications")
    NotificationDto save(@RequestBody Map<String, Object> notification);

    @PatchMapping("/db/notifications/{id}/read")
    NotificationDto markAsRead(@PathVariable Long id);

    @DeleteMapping("/db/notifications/{id}")
    void delete(@PathVariable Long id);

}
