package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbImagesResponse {

    private Long id;
    private List<TmdbBackdrop> backdrops;
    private List<TmdbBackdrop> posters;

}
