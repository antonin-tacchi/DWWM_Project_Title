package com.antonintacchi.movies.controller;

import com.antonintacchi.movies.dto.tmdb.TmdbDetailResponse;
import com.antonintacchi.movies.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tv")
@RequiredArgsConstructor
public class TvController {

    private final TmdbService tmdbService;

    @GetMapping("/{tmdbId}")
    public ResponseEntity<TmdbDetailResponse> tvDetails(@PathVariable Long tmdbId) {
        TmdbDetailResponse response = tmdbService.getDetail(tmdbId, "tv");
        return ResponseEntity.status(200).body(response);
    }
}
