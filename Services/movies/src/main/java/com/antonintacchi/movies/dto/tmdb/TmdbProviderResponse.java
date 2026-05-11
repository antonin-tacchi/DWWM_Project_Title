package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbProviderResponse {

    private Map<String, TmdbCountryProvider> results;

}
