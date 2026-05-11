package com.antonintacchi.movies.controller;

import com.antonintacchi.movies.dto.history.AddHistoryRequest;
import com.antonintacchi.movies.dto.history.HistoryEntryDto;
import com.antonintacchi.movies.service.HistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping
    public ResponseEntity<List<HistoryEntryDto>> getHistory(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok().body(historyService.getHistory(userId));
    }

    @PostMapping
    public ResponseEntity<HistoryEntryDto> addToHistory(@RequestHeader("X-User-Id") Long userId, @Valid @RequestBody AddHistoryRequest request) {
        return ResponseEntity.status(201).body(historyService.addToHistory(userId, request));
    }

}
