package com.antonintacchi.movies.controller;

import com.antonintacchi.movies.cache.TmdbCacheRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Endpoints de gestion du cache TMDB MongoDB.
 * Accessibles uniquement via la Gateway (header X-User-Role=admin).
 */
@RestController
@RequestMapping("/movies/cache")
@RequiredArgsConstructor
public class CacheController {

    private final TmdbCacheRepository cacheRepository;

    /** Retourne le nombre d'entrées actuellement dans le cache MongoDB. */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        long count = cacheRepository.count();
        return ResponseEntity.ok(Map.of(
                "entries", count,
                "collection", "tmdb_cache",
                "ttlHours", 24,
                "description", "MongoDB persistent cache for TMDB API responses"
        ));
    }

    /** Vide entièrement le cache (force un rafraîchissement depuis TMDB). */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> clear() {
        long before = cacheRepository.count();
        cacheRepository.deleteAll();
        return ResponseEntity.ok(Map.of(
                "deleted", before,
                "message", "Cache cleared. Next requests will fetch from TMDB."
        ));
    }
}
