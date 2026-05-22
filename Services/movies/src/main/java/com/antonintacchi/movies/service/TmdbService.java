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
    @Cacheable("tmdb-upcoming")
    public TmdbPageResponse getUpcoming(String mediaType) {
        // movie → /movie/upcoming   |   tv → /tv/on_the_air
        String path = "movie".equals(mediaType) ? "/movie/upcoming" : "/tv/on_the_air";
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(path)
                        .queryParam("api_key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(TmdbPageResponse.class)
                .block();
    }

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackPageResponse")
    @Cacheable("tmdb-similar")
    public TmdbPageResponse getSimilar(String mediaType, Long tmdbId) {
        // Try /recommendations first (user-behaviour based → far more relevant)
        TmdbPageResponse recs = tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/{mediaType}/{tmdbId}/recommendations")
                        .queryParam("api_key", apiKey)
                        .build(mediaType, tmdbId))
                .retrieve()
                .bodyToMono(TmdbPageResponse.class)
                .block();

        if (recs != null && recs.getResults() != null && !recs.getResults().isEmpty()) {
            return recs;
        }

        // Fallback to /similar if recommendations is empty (e.g. very new release)
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

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackPersonCreditsResponse")
    @Cacheable("tmdb-person-credits")
    public TmdbPersonCreditsResponse getPersonCredits(Long personId) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/person/{personId}/combined_credits")
                        .queryParam("api_key", apiKey)
                        .build(personId))
                .retrieve()
                .bodyToMono(TmdbPersonCreditsResponse.class)
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

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackCreditsResponse")
    @Cacheable("tmdb-credits")
    public TmdbCreditsResponse getCredits(Long tmdbId, String mediaType) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/{mediaType}/{tmdbId}/credits")
                        .queryParam("api_key", apiKey)
                        .build(mediaType, tmdbId))
                .retrieve()
                .bodyToMono(TmdbCreditsResponse.class)
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

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackImagesResponse")
    @Cacheable("tmdb-images")
    public TmdbImagesResponse getImages(Long tmdbId, String mediaType) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/{mediaType}/{tmdbId}/images")
                        .queryParam("api_key", apiKey)
                        // include_image_language=null fetches all languages (more backdrops)
                        .queryParam("include_image_language", "null,en")
                        .build(mediaType, tmdbId))
                .retrieve()
                .bodyToMono(TmdbImagesResponse.class)
                .block();
    }

    @CircuitBreaker(name = "tmdb", fallbackMethod = "fallbackPageResponse")
    public TmdbPageResponse discover(String mediaType, String genres, Double maxRating,
                                     Integer maxYear, String language, String providers, int page) {
        return tmdbWebClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder
                            .path("/discover/{mediaType}")
                            .queryParam("api_key", apiKey)
                            .queryParam("page", page)
                            .queryParam("include_adult", false)
                            .queryParam("sort_by", "popularity.desc");

                    if (genres != null && !genres.isBlank()) {
                        builder.queryParam("with_genres", genres);
                    }
                    if (maxRating != null && maxRating < 10) {
                        builder.queryParam("vote_average.lte", maxRating);
                    }
                    if (maxYear != null) {
                        String dateLimit = maxYear + "-12-31";
                        if ("movie".equals(mediaType)) {
                            builder.queryParam("primary_release_date.lte", dateLimit);
                        } else {
                            builder.queryParam("first_air_date.lte", dateLimit);
                        }
                    }
                    if (language != null && !language.isBlank()) {
                        builder.queryParam("with_original_language", language);
                    }
                    if (providers != null && !providers.isBlank()) {
                        builder.queryParam("with_watch_providers", providers);
                        builder.queryParam("watch_region", "FR");
                    }
                    return builder.build(mediaType);
                })
                .retrieve()
                .bodyToMono(TmdbPageResponse.class)
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

    private TmdbPersonCreditsResponse fallbackPersonCreditsResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

    private TmdbVideoResponse fallbackVideoResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

    private TmdbCreditsResponse fallbackCreditsResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

    private TmdbProviderResponse fallbackProviderResponse(Throwable ex) {
        throw new ServiceUnavailableException("Tmdb service unavailable, please try again later.", ex);
    }

    private TmdbImagesResponse fallbackImagesResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

    private TmdbResult fallbackRandomResponse(Throwable ex) {
        throw new ServiceUnavailableException("TMDB service unavailable, please try again later.", ex);
    }

}
