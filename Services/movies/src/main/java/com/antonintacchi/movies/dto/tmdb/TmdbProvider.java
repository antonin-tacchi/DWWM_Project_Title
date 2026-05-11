package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbProvider {

    @JsonProperty("provider_name")
    private String providerName;

    @JsonProperty("logo_path")
    private String logoPath;

}
