package com.antonintacchi.social.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "db-service", contextId = "dbUserClient")
public interface DbUserClient {

    @PostMapping("/db/users/{id}/xp")
    void awardXp(@PathVariable Long id, @RequestParam int amount);

}
