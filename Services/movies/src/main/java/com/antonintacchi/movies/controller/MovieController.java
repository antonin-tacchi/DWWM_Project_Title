package com.antonintacchi.movies.controller;

import com.antonintacchi.movies.dto.tmdb.TmdbDetailResponse;
import com.antonintacchi.movies.dto.tmdb.TmdbPageResponse;
import com.antonintacchi.movies.dto.tmdb.TmdbVideoResponse;
import com.antonintacchi.movies.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
public class MovieController {

    private final TmdbService tmdbService;

    @GetMapping("/search")
    public ResponseEntity<TmdbPageResponse> search(@RequestParam String query, @RequestParam(defaultValue = "1") int page) {

        TmdbPageResponse response = tmdbService.searchMulti(query, page);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/trending")
    public ResponseEntity<TmdbPageResponse> trending(@RequestParam(defaultValue = "movie") String mediaType, @RequestParam(defaultValue = "week") String timeWindow) {

        TmdbPageResponse response = tmdbService.getTrending(mediaType, timeWindow);
        return ResponseEntity.status(200).body(response);

    }

    @GetMapping("/{tmdbId}")
    public ResponseEntity<TmdbDetailResponse> details(@PathVariable Long tmdbId, @RequestParam(defaultValue = "movie") String mediaType) {

        TmdbDetailResponse response = tmdbService.getDetail(tmdbId, mediaType);
        return ResponseEntity.status(200).body(response);

    }

    @GetMapping("/popular")
    public ResponseEntity<TmdbPageResponse> popular(@RequestParam(defaultValue = "movie") String mediaType) {
        TmdbPageResponse response = tmdbService.getPopular(mediaType);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/{tmdbId}/similar")
    public ResponseEntity<TmdbPageResponse>  similar(@PathVariable Long tmdbId, @RequestParam(defaultValue = "movie") String mediaType) {
        TmdbPageResponse response = tmdbService.getSimilar(mediaType, tmdbId);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/{tmdbId}/trailer")
    public ResponseEntity<TmdbVideoResponse> trailer(@PathVariable Long tmdbId, @RequestParam(defaultValue = "movie") String mediaType) {
        TmdbVideoResponse response = tmdbService.getTrailer(tmdbId, mediaType);
        return ResponseEntity.status(200).body(response);
    }

}
