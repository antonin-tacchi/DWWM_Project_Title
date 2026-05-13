package com.antonintacchi.social.controller;

import com.antonintacchi.social.dto.favorite.AddFavoriteRequest;
import com.antonintacchi.social.dto.favorite.FavoriteDto;
import com.antonintacchi.social.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<FavoriteDto>> getFavorites(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.status(200).body(favoriteService.getFavorites(userId));
    }

    @PostMapping
    public ResponseEntity<FavoriteDto> addFavorite(@RequestHeader("X-User-Id") Long userId, @Valid @RequestBody AddFavoriteRequest addFavoriteRequest) {
        return ResponseEntity.status(201).body(favoriteService.addFavorite(userId, addFavoriteRequest));
    }

    @DeleteMapping("/{favoriteId}")
    public ResponseEntity<Void> deleteFavorite(@RequestHeader("X-User-Id") Long userId, @PathVariable("favoriteId") Long favoriteId) {
        favoriteService.removeFavorite(userId, favoriteId);
        return ResponseEntity.noContent().build();
    }
}
