package com.antonintacchi.social.service;

import com.antonintacchi.social.dto.rating.CreateRatingRequest;
import com.antonintacchi.social.dto.rating.RatingDto;
import com.antonintacchi.social.dto.rating.UpdateRatingRequest;
import com.antonintacchi.social.entity.Rating;
import com.antonintacchi.social.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;

    public List<RatingDto> getRatings(Long tmdbId, String mediaType) {
        return ratingRepository.findByTmdbIdAndMediaType(tmdbId, mediaType)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public RatingDto createRating(Long userId, CreateRatingRequest request) {
        if (ratingRepository.existsByUserIdAndTmdbIdAndMediaType(userId, request.getTmdbId(), request.getMediaType())) {
            throw new IllegalStateException("Rating already exists");
        }
        Rating rating = Rating.builder()
                .userId(userId)
                .tmdbId(request.getTmdbId())
                .mediaType(request.getMediaType())
                .score(request.getScore())
                .build();
        Rating saved = ratingRepository.save(rating);
        return toDto(saved);
    }

    public RatingDto updateRating(Long userId, Long ratingId, UpdateRatingRequest request) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new NoSuchElementException("Rating not found"));
        if (!rating.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your rating");
        }
        rating.setScore(request.getScore());
        return toDto(ratingRepository.save(rating));
    }

    public void deleteRating(Long userId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new NoSuchElementException("Rating not found"));
        if (!rating.getUserId().equals(userId)) {
            throw new IllegalStateException("Not your rating");
        }
        ratingRepository.delete(rating);
    }

    private RatingDto toDto(Rating rating) {
        return RatingDto.builder()
                .id(rating.getId())
                .userId(rating.getUserId())
                .tmdbId(rating.getTmdbId())
                .mediaType(rating.getMediaType())
                .score(rating.getScore())
                .createdAt(rating.getCreatedAt())
                .build();
    }

}
