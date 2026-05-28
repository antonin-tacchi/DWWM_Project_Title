package com.antonintacchi.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@FeignClient(name = "db-service", contextId = "dbAdminLogClient")
public interface DbAdminLogClient {

    @GetMapping("/db/admin-logs")
    List<Map<String, Object>> findAll();

    @PostMapping("/db/admin-logs")
    Map<String, Object> save(@RequestBody Map<String, Object> log);
}
