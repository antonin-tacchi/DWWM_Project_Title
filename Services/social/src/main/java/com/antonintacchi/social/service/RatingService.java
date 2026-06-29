package com.antonintacchi.social.service;

import com.antonintacchi.social.client.DbRatingClient;
import com.antonintacchi.social.client.DbUserClient;
import com.antonintacchi.social.dto.rating.CreateRatingRequest;
import com.antonintacchi.social.dto.rating.RatingDto;
import com.antonintacchi.social.dto.rating.UpdateRatingRequest;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final DbRatingClient dbRatingClient;
    private final DbUserClient   dbUserClient;

    public List<RatingDto> getRatings(Long tmdbId, String mediaType) {
        return dbRatingClient.findByMedia(tmdbId, mediaType);
    }

    public RatingDto createRating(Long userId, CreateRatingRequest request) {
        if (Boolean.TRUE.equals(dbRatingClient.exists(userId, request.getTmdbId(), request.getMediaType()))) {
            throw new IllegalStateException("Rating already exists");
        }
        Map<String, Object> body = Map.of(
                "userId",    userId,
                "tmdbId",    request.getTmdbId(),
                "mediaType", request.getMediaType(),
                "score",     request.getScore()
        );
        RatingDto saved = dbRatingClient.save(body);
        try { dbUserClient.awardXp(userId, 5); } catch (Exception ignored) {}
        return saved;
    }

    public RatingDto updateRating(Long userId, Long ratingId, UpdateRatingRequest request) {
        RatingDto rating = findRatingOrThrow(ratingId);
        if (!rating.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your rating");
        }
        return dbRatingClient.update(ratingId, Map.of("score", request.getScore()));
    }

    public void deleteRating(Long userId, Long ratingId) {
        RatingDto rating = findRatingOrThrow(ratingId);
        if (!rating.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your rating");
        }
        dbRatingClient.delete(ratingId);
    }

    /* ── Helpers ─────────────────────────────────────────────────── */

    private RatingDto findRatingOrThrow(Long ratingId) {
        try {
            return dbRatingClient.findById(ratingId);
        } catch (FeignException.NotFound e) {
            throw new NoSuchElementException("Rating not found");
        }
    }

}
