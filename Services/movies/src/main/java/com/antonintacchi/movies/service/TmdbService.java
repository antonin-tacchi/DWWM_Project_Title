package com.antonintacchi.movies.service;

import com.antonintacchi.movies.dto.tmdb.*;
import com.antonintacchi.movies.exception.ServiceUnavailableException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Random;

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

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackPageResponse")
    @Cacheable("tmdb-popular")
    public TmdbPageResponse getPopular(String mediaType) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/{mediaType}/popular")
                        .queryParam("api_key", apiKey)
                        .build(mediaType))
                .retrieve()
                .bodyToMono(TmdbPageResponse.class)
                .block();
    }

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackPageResponse")
    @Cacheable("tmdb-similar")
    public TmdbPageResponse getSimilar(String mediaType, Long tmdbId) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/{mediaType}/{tmdbId}/similar")
                        .queryParam("api_key", apiKey)
                        .build(mediaType, tmdbId))
                .retrieve()
                .bodyToMono(TmdbPageResponse.class)
                .block();
    }

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackPersonResponse")
    @Cacheable("tmdb-person")
    public TmdbPersonResponse getPerson(Long personId) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/person/{personId}")
                        .queryParam("api_key", apiKey)
                        .build(personId))
                .retrieve()
                .bodyToMono(TmdbPersonResponse.class)
                .block();
    }

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackVideoResponse")
    @Cacheable("tmdb-trailer")
    public TmdbVideoResponse getTrailer(Long tmdbId, String mediaType) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/{mediaType}/{tmdbId}/videos")
                        .queryParam("api_key", apiKey)
                        .build(mediaType, tmdbId))
                .retrieve()
                .bodyToMono(TmdbVideoResponse.class)
                .block();
    }

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackProviderResponse")
    @Cacheable("tmdb-provider")
    public TmdbProviderResponse getProvider(Long tmdbId, String mediaType) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/{mediaType}/{tmdbId}/watch/providers")
                        .queryParam("api_key", apiKey)
                        .build(mediaType, tmdbId))
                .retrieve()
                .bodyToMono(TmdbProviderResponse.class)
                .block();
    }

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackRandomResponse")
    public TmdbResult getRandom(String mediaType) {
        int page = new Random().nextInt(10) + 1;

        TmdbPageResponse response = tmdbWebClient.get()
                                        .uri(uriBuilder -> uriBuilder
                                                .path("/discover/{mediaType}")
                                                .queryParam("api_key", apiKey)
                                                .queryParam("page", page)
                                                .build(mediaType))
                                        .retrieve()
                                        .bodyToMono(TmdbPageResponse.class)
                                        .block();

        List<TmdbResult> results = response.getResults();
        return results.get(new Random().nextInt(results.size()));
    }

    private TmdbPageResponse fallbackPageResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

    private TmdbDetailResponse fallbackDetailResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

    private TmdbPersonResponse fallbackPersonResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

    private TmdbVideoResponse fallbackVideoResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

    private TmdbProviderResponse fallbackProviderResponse(Throwable ex) {
        throw new ServiceUnavailableException("Tmdb service unavailable, please try again later.", ex);
    }

    private TmdbResult fallbackRandomResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

}
