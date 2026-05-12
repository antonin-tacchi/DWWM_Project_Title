package com.antonintacchi.social.service;

import com.antonintacchi.social.dto.favorite.AddFavoriteRequest;
import com.antonintacchi.social.dto.favorite.FavoriteDto;
import com.antonintacchi.social.entity.Favorite;
import com.antonintacchi.social.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public List<FavoriteDto> getFavorites(Long userId){
        return favoriteRepository.findByUserId(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public FavoriteDto addFavorite(Long userId, AddFavoriteRequest request) {
        if (favoriteRepository.existsByUserIdAndTmdbIdAndMediaType(userId, request.getTmdbId(), request.getMediaType())) {
            throw new IllegalStateException("Already in favorites");
        }
        Favorite favorite = Favorite.builder()
                .userId(userId)
                .tmdbId(request.getTmdbId())
                .mediaType(request.getMediaType())
                .build();
        Favorite savedFavorite = favoriteRepository.save(favorite);
        return toDto(savedFavorite);
    }

    public void removeFavorite(Long userId, Long favoriteId) {
        Favorite favorite = favoriteRepository.findById(favoriteId)
                .orElseThrow(() -> new NoSuchElementException("Favorite not found"));
        if (!favorite.getUserId().equals(userId)) {
            throw new IllegalStateException("Is not in your favorite");
        }
        favoriteRepository.delete(favorite);
    }

    private FavoriteDto toDto(Favorite favorite){
        return FavoriteDto.builder()
                .id(favorite.getId())
                .userId(favorite.getUserId())
                .tmdbId(favorite.getTmdbId())
                .mediaType(favorite.getMediaType())
                .addedAt(favorite.getAddedAt())
                .build();
    }

}
