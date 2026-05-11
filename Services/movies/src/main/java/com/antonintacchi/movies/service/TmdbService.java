package com.antonintacchi.movies.service;

import com.antonintacchi.movies.dto.tmdb.TmdbDetailResponse;
import com.antonintacchi.movies.dto.tmdb.TmdbPageResponse;
import com.antonintacchi.movies.exception.ServiceUnavailableException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class TmdbService {

    private final WebClient tmdbWebClient;

    @Value("${tmdb.api-key}")
    private String apiKey;

    public TmdbService(WebClient tmdbWebClient) {
        this.tmdbWebClient = tmdbWebClient;
    }

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackPageResponse")
    @Cacheable("tmdb-search")
    public TmdbPageResponse searchMulti(String query, int page) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/multi")
                        .queryParam("api_key", apiKey)
                        .queryParam("query", query)
                        .queryParam("page", page)
                        .queryParam("include_adult", false)
                        .build())
                .retrieve()
                .bodyToMono(TmdbPageResponse.class)
                .block();
    }

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackPageResponse")
    @Cacheable("tmdb-trending")
    public TmdbPageResponse getTrending(String mediaType, String timeWindow) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/trending/{mediaType}/{timeWindow}")
                        .queryParam("api_key", apiKey)
                        .build(mediaType, timeWindow))
                .retrieve()
                .bodyToMono(TmdbPageResponse.class)
                .block();
    }

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackDetailResponse")
    @Cacheable("tmdb-detail")
    public TmdbDetailResponse getDetail(Long tmdbId, String mediaType) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/{mediaType}/{tmdbId}")
                        .queryParam("api_key", apiKey)
                        .build(mediaType, tmdbId))
                .retrieve()
                .bodyToMono(TmdbDetailResponse.class)
                .block();
    }

    private TmdbPageResponse fallbackPageResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

    private TmdbDetailResponse fallbackDetailResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

}
