package com.antonintacchi.movies.service;

import com.antonintacchi.movies.dto.watchlist.AddToWatchlistRequest;
import com.antonintacchi.movies.dto.watchlist.WatchlistEntryDto;
import com.antonintacchi.movies.entity.WatchlistEntry;
import com.antonintacchi.movies.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;

    public List<WatchlistEntryDto> getWatchlist(String userEmail) {
        return watchlistRepository.findByUserEmailOrderByAddedAtDesc(userEmail)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public WatchlistEntryDto addToWatchlist(String userEmail, AddToWatchlistRequest request) {
        if (watchlistRepository.existsByUserEmailAndTmdbIdAndMediaType(
                userEmail, request.getTmdbId(), request.getMediaType())) {
            throw new RuntimeException("Already in watchlist");
        }
        WatchlistEntry entry = WatchlistEntry.builder()
                .userEmail(userEmail)
                .tmdbId(request.getTmdbId())
                .mediaType(request.getMediaType())
                .build();
        return toDto(watchlistRepository.save(entry));
    }

    public void removeFromWatchlist(String userEmail, Long tmdbId, String mediaType) {
        WatchlistEntry entry = watchlistRepository
                .findByUserEmailAndTmdbIdAndMediaType(userEmail, tmdbId, mediaType)
                .orElseThrow(() -> new RuntimeException("Entry not found in watchlist"));
        watchlistRepository.delete(entry);
    }

    private WatchlistEntryDto toDto(WatchlistEntry entry) {
        return WatchlistEntryDto.builder()
                .id(entry.getId())
                .tmdbId(entry.getTmdbId())
                .mediaType(entry.getMediaType())
                .addedAt(entry.getAddedAt())
                .build();
    }

}
