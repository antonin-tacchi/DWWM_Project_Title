package com.antonintacchi.social.service;

import com.antonintacchi.social.client.DbFavoriteClient;
import com.antonintacchi.social.dto.favorite.AddFavoriteRequest;
import com.antonintacchi.social.dto.favorite.FavoriteDto;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final DbFavoriteClient dbFavoriteClient;

    public List<FavoriteDto> getFavorites(Long userId) {
        return dbFavoriteClient.findByUser(userId);
    }

    public FavoriteDto addFavorite(Long userId, AddFavoriteRequest request) {
        if (Boolean.TRUE.equals(dbFavoriteClient.exists(userId, request.getTmdbId(), request.getMediaType()))) {
            throw new IllegalStateException("Already in favorites");
        }
        Map<String, Object> body = Map.of(
                "userId",    userId,
                "tmdbId",    request.getTmdbId(),
                "mediaType", request.getMediaType()
        );
        return dbFavoriteClient.save(body);
    }

    public void removeFavorite(Long userId, Long favoriteId) {
        FavoriteDto favorite;
        try {
            favorite = dbFavoriteClient.findById(favoriteId);
        } catch (FeignException.NotFound e) {
            throw new NoSuchElementException("Favorite not found");
        }
        if (!favorite.getUserId().equals(userId)) {
            throw new IllegalStateException("Is not in your favorite");
        }
        dbFavoriteClient.deleteById(favoriteId);
    }

}
