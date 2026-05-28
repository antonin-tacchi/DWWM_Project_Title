package com.antonintacchi.dbservice.controller;

import com.antonintacchi.dbservice.entity.Favorite;
import com.antonintacchi.dbservice.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/db/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;

    @GetMapping
    public ResponseEntity<List<Favorite>> findByUser(@RequestParam Long userId) {
        return ResponseEntity.ok(favoriteRepository.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Favorite> findById(@PathVariable Long id) {
        return favoriteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> exists(
            @RequestParam Long userId,
            @RequestParam Long tmdbId,
            @RequestParam String mediaType) {
        return ResponseEntity.ok(
                favoriteRepository.existsByUserIdAndTmdbIdAndMediaType(userId, tmdbId, mediaType));
    }

    @PostMapping
    public ResponseEntity<Favorite> save(@RequestBody Favorite favorite) {
        favorite.setId(null);
        return ResponseEntity.ok(favoriteRepository.save(favorite));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (!favoriteRepository.existsById(id)) return ResponseEntity.notFound().build();
        favoriteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/by-key")
    public ResponseEntity<Void> deleteByKey(
            @RequestParam Long userId,
            @RequestParam Long tmdbId,
            @RequestParam String mediaType) {
        favoriteRepository.deleteByUserIdAndTmdbIdAndMediaType(userId, tmdbId, mediaType);
        return ResponseEntity.noContent().build();
    }

}
