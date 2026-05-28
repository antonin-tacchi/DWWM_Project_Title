package com.antonintacchi.movies.service;

import com.antonintacchi.movies.client.DbHistoryClient;
import com.antonintacchi.movies.dto.history.AddHistoryRequest;
import com.antonintacchi.movies.dto.history.HistoryEntryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final DbHistoryClient dbHistoryClient;

    public List<HistoryEntryDto> getHistory(Long userId) {
        return dbHistoryClient.findByUser(userId);
    }

    public HistoryEntryDto addToHistory(Long userId, AddHistoryRequest request) {
        // Vérifie que l'entrée n'existe pas déjà
        if (Boolean.TRUE.equals(dbHistoryClient.exists(userId, request.getTmdbId(), request.getMediaType()))) {
            return null;
        }

        // Envoie l'entrée à db-service
        Map<String, Object> body = Map.of(
                "userId",    userId,
                "tmdbId",    request.getTmdbId(),
                "mediaType", request.getMediaType()
        );

        return dbHistoryClient.save(body);
    }

}
