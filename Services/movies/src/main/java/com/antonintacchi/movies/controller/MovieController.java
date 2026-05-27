package com.antonintacchi.movies.controller;

import com.antonintacchi.movies.dto.tmdb.*;
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
    public ResponseEntity<TmdbPageResponse> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbPageResponse response = tmdbService.searchMulti(query, page, language);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/trending")
    public ResponseEntity<TmdbPageResponse> trending(
            @RequestParam(defaultValue = "movie") String mediaType,
            @RequestParam(defaultValue = "week") String timeWindow,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbPageResponse response = tmdbService.getTrending(mediaType, timeWindow, language);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/{tmdbId}")
    public ResponseEntity<TmdbDetailResponse> details(
            @PathVariable Long tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbDetailResponse response = tmdbService.getDetail(tmdbId, mediaType, language);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/popular")
    public ResponseEntity<TmdbPageResponse> popular(
            @RequestParam(defaultValue = "movie") String mediaType,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbPageResponse response = tmdbService.getPopular(mediaType, language);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<TmdbPageResponse> upcoming(
            @RequestParam(defaultValue = "movie") String mediaType,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbPageResponse response = tmdbService.getUpcoming(mediaType, language);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/{tmdbId}/similar")
    public ResponseEntity<TmdbPageResponse> similar(
            @PathVariable Long tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbPageResponse response = tmdbService.getSimilar(mediaType, tmdbId, language);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/{tmdbId}/trailer")
    public ResponseEntity<TmdbVideoResponse> trailer(
            @PathVariable Long tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbVideoResponse response = tmdbService.getTrailer(tmdbId, mediaType, language);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/{tmdbId}/credits")
    public ResponseEntity<TmdbCreditsResponse> credits(
            @PathVariable Long tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbCreditsResponse response = tmdbService.getCredits(tmdbId, mediaType, language);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/{tmdbId}/providers")
    public ResponseEntity<TmdbProviderResponse> providers(
            @PathVariable Long tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType) {

        TmdbProviderResponse response = tmdbService.getProvider(tmdbId, mediaType);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/{tmdbId}/images")
    public ResponseEntity<TmdbImagesResponse> images(
            @PathVariable Long tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType) {

        TmdbImagesResponse response = tmdbService.getImages(tmdbId, mediaType);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/discover")
    public ResponseEntity<TmdbPageResponse> discover(
            @RequestParam(defaultValue = "movie")  String  mediaType,
            @RequestParam(required = false)        String  genres,
            @RequestParam(required = false)        Double  maxRating,
            @RequestParam(required = false)        Integer maxYear,
            @RequestParam(required = false)        String  language,
            @RequestParam(required = false)        String  providers,
            @RequestParam(defaultValue = "1")      int     page,
            @RequestParam(defaultValue = "fr-FR")  String  uiLanguage) {

        TmdbPageResponse response = tmdbService.discover(mediaType, genres, maxRating, maxYear, language, providers, page, uiLanguage);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/discover/random")
    public ResponseEntity<TmdbResult> random(
            @RequestParam(defaultValue = "movie") String mediaType,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbResult result = tmdbService.getRandom(mediaType, language);
        return ResponseEntity.status(200).body(result);
    }

}
