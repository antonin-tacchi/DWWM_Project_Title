package com.antonintacchi.auth.client;

import com.antonintacchi.auth.model.UserModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "db-service", contextId = "dbUserClient")
public interface DbUserClient {

    @GetMapping("/db/users")
    List<UserModel> findAll();

    @GetMapping("/db/users/{id}")
    UserModel findById(@PathVariable Long id);

    @GetMapping("/db/users/by-email")
    UserModel findByEmail(@RequestParam String email);

    @GetMapping("/db/users/by-username")
    UserModel findByUsername(@RequestParam String username);

    @GetMapping("/db/users/exists/email")
    Boolean existsByEmail(@RequestParam String email);

    @PostMapping("/db/users")
    UserModel save(@RequestBody UserModel user);

    @PutMapping("/db/users/{id}")
    UserModel update(@PathVariable Long id, @RequestBody UserModel user);

    @DeleteMapping("/db/users/{id}")
    void delete(@PathVariable Long id);

}
