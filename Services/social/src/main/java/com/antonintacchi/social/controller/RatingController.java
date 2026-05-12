package com.antonintacchi.social.controller;

import com.antonintacchi.social.dto.rating.CreateRatingRequest;
import com.antonintacchi.social.dto.rating.RatingDto;
import com.antonintacchi.social.dto.rating.UpdateRatingRequest;
import com.antonintacchi.social.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @GetMapping
    public ResponseEntity<List<RatingDto>> getAllRatings(@RequestParam Long tmdbId, @RequestParam String mediaType) {
        return ResponseEntity.ok(ratingService.getRatings(tmdbId, mediaType));
    }

    @PostMapping
    public ResponseEntity<RatingDto> addRating(@RequestHeader("X-User-Id") Long userId, @Valid @RequestBody CreateRatingRequest createRatingRequest) {
        return ResponseEntity.status(201).body(ratingService.createRating(userId, createRatingRequest));
    }

    @PutMapping("/{ratingId}")
    public ResponseEntity<RatingDto> updateRating(@RequestHeader("X-User-Id") Long userId, @PathVariable Long ratingId, @Valid @RequestBody UpdateRatingRequest updateRatingRequest) {
        return ResponseEntity.status(200).body(ratingService.updateRating(userId, ratingId, updateRatingRequest));
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@RequestHeader("X-User-Id") Long userId, @PathVariable Long ratingId) {
        ratingService.deleteRating(userId, ratingId);
        return ResponseEntity.noContent().build();
    }
}
