package com.antonintacchi.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient(name = "db-service", contextId = "dbStatsClient")
public interface DbStatsClient {

    @GetMapping("/db/stats")
    Map<String, Long> getStats();

}
