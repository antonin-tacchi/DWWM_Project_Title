package com.antonintacchi.dbservice.controller;

import com.antonintacchi.dbservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/db/stats")
@RequiredArgsConstructor
public class StatsController {

    private final UserRepository         userRepository;
    private final CommentRepository      commentRepository;
    private final RatingRepository       ratingRepository;
    private final FavoriteRepository     favoriteRepository;
    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(Map.of(
                "users",         userRepository.count(),
                "comments",      commentRepository.count(),
                "ratings",       ratingRepository.count(),
                "favorites",     favoriteRepository.count(),
                "notifications", notificationRepository.count()
        ));
    }

}
