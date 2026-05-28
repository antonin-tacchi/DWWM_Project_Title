package com.antonintacchi.dbservice.controller;

import com.antonintacchi.dbservice.entity.Rating;
import com.antonintacchi.dbservice.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/db/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingRepository ratingRepository;

    @GetMapping
    public ResponseEntity<List<Rating>> findByMedia(
            @RequestParam Long tmdbId,
            @RequestParam String mediaType) {
        return ResponseEntity.ok(ratingRepository.findByTmdbIdAndMediaType(tmdbId, mediaType));
    }

    @GetMapping("/by-user")
    public ResponseEntity<Rating> findByUser(
            @RequestParam Long userId,
            @RequestParam Long tmdbId,
            @RequestParam String mediaType) {
        return ratingRepository.findByUserIdAndTmdbIdAndMediaType(userId, tmdbId, mediaType)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rating> findById(@PathVariable Long id) {
        return ratingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> exists(
            @RequestParam Long userId,
            @RequestParam Long tmdbId,
            @RequestParam String mediaType) {
        return ResponseEntity.ok(
                ratingRepository.existsByUserIdAndTmdbIdAndMediaType(userId, tmdbId, mediaType));
    }

    @PostMapping
    public ResponseEntity<Rating> save(@RequestBody Rating rating) {
        rating.setId(null);
        return ResponseEntity.ok(ratingRepository.save(rating));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rating> update(@PathVariable Long id, @RequestBody Rating patch) {
        return ratingRepository.findById(id).map(r -> {
            r.setScore(patch.getScore());
            return ResponseEntity.ok(ratingRepository.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!ratingRepository.existsById(id)) return ResponseEntity.notFound().build();
        ratingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
