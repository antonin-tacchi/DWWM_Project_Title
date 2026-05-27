package com.antonintacchi.movies.controller;

import com.antonintacchi.movies.dto.tmdb.TmdbDetailResponse;
import com.antonintacchi.movies.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tv")
@RequiredArgsConstructor
public class TvController {

    private final TmdbService tmdbService;

    @GetMapping("/{tmdbId}")
    public ResponseEntity<TmdbDetailResponse> tvDetails(
            @PathVariable Long tmdbId,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbDetailResponse response = tmdbService.getDetail(tmdbId, "tv", language);
        return ResponseEntity.status(200).body(response);
    }
}
