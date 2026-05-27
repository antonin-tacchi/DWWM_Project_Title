package com.antonintacchi.movies.controller;

import com.antonintacchi.movies.dto.tmdb.TmdbPersonCreditsResponse;
import com.antonintacchi.movies.dto.tmdb.TmdbPersonResponse;
import com.antonintacchi.movies.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/actors")
@RequiredArgsConstructor
public class ActorController {

    private final TmdbService tmdbService;

    @GetMapping("/{actorId}")
    public ResponseEntity<TmdbPersonResponse> getActor(
            @PathVariable Long actorId,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbPersonResponse tmdbPersonResponse = tmdbService.getPerson(actorId, language);
        return ResponseEntity.status(200).body(tmdbPersonResponse);
    }

    @GetMapping("/{actorId}/credits")
    public ResponseEntity<TmdbPersonCreditsResponse> getActorCredits(
            @PathVariable Long actorId,
            @RequestParam(defaultValue = "fr-FR") String language) {

        TmdbPersonCreditsResponse credits = tmdbService.getPersonCredits(actorId, language);
        return ResponseEntity.ok(credits);
    }

}
