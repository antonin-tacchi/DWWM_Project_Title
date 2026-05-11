package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbCountryProvider {

    private List<TmdbProvider> flatrate;
    private List<TmdbProvider> rent;
    private List<TmdbProvider> buy;

}
