package com.antonintacchi.movies.service;

import com.antonintacchi.movies.dto.history.AddHistoryRequest;
import com.antonintacchi.movies.dto.history.HistoryEntryDto;
import com.antonintacchi.movies.entity.History;
import com.antonintacchi.movies.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    public List<HistoryEntryDto> getHistory(Long userId) {
        return historyRepository.findByUserIdOrderByConsultedAtDesc(userId)
                .stream()
                .map(history -> HistoryEntryDto.builder()
                        .id(history.getId())
                        .tmdbId(history.getTmdbId())
                        .mediaType(history.getMediaType())
                        .consultedAt(history.getConsultedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public HistoryEntryDto addToHistory(Long userId, AddHistoryRequest request) {
        if (historyRepository.existsByUserIdAndTmdbIdAndMediaType(
                userId, request.getTmdbId(), request.getMediaType())) {
            return null;
        }

        History history = History.builder()
                .userId(userId)
                .tmdbId(request.getTmdbId())
                .mediaType(request.getMediaType())
                .build();
        History saved = historyRepository.save(history);

        return HistoryEntryDto.builder()
                .id(saved.getId())
                .tmdbId(saved.getTmdbId())
                .mediaType(saved.getMediaType())
                .consultedAt(saved.getConsultedAt())
                .build();
    }

}
