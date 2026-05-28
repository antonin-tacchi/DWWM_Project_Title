package com.antonintacchi.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name = "db-service", contextId = "dbRatingAdminClient")
public interface DbRatingAdminClient {

    @GetMapping("/db/ratings/all")
    List<Map<String, Object>> findAll();

    @DeleteMapping("/db/ratings/{id}")
    void delete(@PathVariable Long id);
}
