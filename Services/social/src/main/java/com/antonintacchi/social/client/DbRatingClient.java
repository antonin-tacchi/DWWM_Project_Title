package com.antonintacchi.social.client;

import com.antonintacchi.social.dto.rating.RatingDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "db-service", contextId = "dbRatingClient")
public interface DbRatingClient {

    @GetMapping("/db/ratings")
    List<RatingDto> findByMedia(@RequestParam Long tmdbId, @RequestParam String mediaType);

    @GetMapping("/db/ratings/{id}")
    RatingDto findById(@PathVariable Long id);

    @GetMapping("/db/ratings/exists")
    Boolean exists(@RequestParam Long userId,
                   @RequestParam Long tmdbId,
                   @RequestParam String mediaType);

    @PostMapping("/db/ratings")
    RatingDto save(@RequestBody Map<String, Object> rating);

    @PutMapping("/db/ratings/{id}")
    RatingDto update(@PathVariable Long id, @RequestBody Map<String, Object> patch);

    @DeleteMapping("/db/ratings/{id}")
    void delete(@PathVariable Long id);

}
