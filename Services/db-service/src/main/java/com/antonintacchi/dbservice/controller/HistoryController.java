package com.antonintacchi.dbservice.controller;

import com.antonintacchi.dbservice.entity.History;
import com.antonintacchi.dbservice.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/db/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryRepository historyRepository;

    @GetMapping
    public ResponseEntity<List<History>> findByUser(@RequestParam Long userId) {
        return ResponseEntity.ok(historyRepository.findByUserIdOrderByConsultedAtDesc(userId));
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> exists(
            @RequestParam Long userId,
            @RequestParam Long tmdbId,
            @RequestParam String mediaType) {
        return ResponseEntity.ok(
                historyRepository.existsByUserIdAndTmdbIdAndMediaType(userId, tmdbId, mediaType));
    }

    @PostMapping
    public ResponseEntity<History> save(@RequestBody History history) {
        history.setId(null);
        return ResponseEntity.ok(historyRepository.save(history));
    }

}
