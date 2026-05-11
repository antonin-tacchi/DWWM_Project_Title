package com.antonintacchi.movies.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class TmdbConfig {

    @Value("${tmdb.base-url}")
    private String tmdbBaseUrl;

    @Bean
    public WebClient tmdbWebClient() {
        WebClient.Builder builder = WebClient.builder();
        builder.baseUrl(tmdbBaseUrl).defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        return builder.build();
    }

}
