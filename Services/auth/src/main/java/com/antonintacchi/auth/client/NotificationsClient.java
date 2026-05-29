package com.antonintacchi.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "notifications-service", contextId = "notificationsClient")
public interface NotificationsClient {

    @PostMapping("/notifications")
    Map<String, Object> send(@RequestBody Map<String, Object> payload);
}
