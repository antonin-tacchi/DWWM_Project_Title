package com.antonintacchi.movies.controller;

import com.antonintacchi.movies.dto.watchlist.AddToWatchlistRequest;
import com.antonintacchi.movies.dto.watchlist.WatchlistEntryDto;
import com.antonintacchi.movies.service.WatchlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<List<WatchlistEntryDto>> getWatchlist(
            @RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.ok(watchlistService.getWatchlist(userEmail));
    }

    @PostMapping
    public ResponseEntity<WatchlistEntryDto> addToWatchlist(
            @RequestHeader("X-User-Email") String userEmail,
            @Valid @RequestBody AddToWatchlistRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(watchlistService.addToWatchlist(userEmail, request));
    }

    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<Void> removeFromWatchlist(
            @RequestHeader("X-User-Email") String userEmail,
            @PathVariable Long tmdbId,
            @RequestParam(defaultValue = "movie") String mediaType) {
        watchlistService.removeFromWatchlist(userEmail, tmdbId, mediaType);
        return ResponseEntity.noContent().build();
    }

}
