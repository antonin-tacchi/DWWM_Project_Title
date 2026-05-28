package com.antonintacchi.social.client;

import com.antonintacchi.social.dto.favorite.FavoriteDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "db-service", contextId = "dbFavoriteClient")
public interface DbFavoriteClient {

    @GetMapping("/db/favorites")
    List<FavoriteDto> findByUser(@RequestParam Long userId);

    @GetMapping("/db/favorites/{id}")
    FavoriteDto findById(@PathVariable Long id);

    @GetMapping("/db/favorites/exists")
    Boolean exists(@RequestParam Long userId,
                   @RequestParam Long tmdbId,
                   @RequestParam String mediaType);

    @PostMapping("/db/favorites")
    FavoriteDto save(@RequestBody Map<String, Object> favorite);

    @DeleteMapping("/db/favorites/{id}")
    void deleteById(@PathVariable Long id);

    @DeleteMapping("/db/favorites/by-key")
    void deleteByKey(@RequestParam Long userId,
                     @RequestParam Long tmdbId,
                     @RequestParam String mediaType);

}
