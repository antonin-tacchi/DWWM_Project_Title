package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbGenre {

    private Long id;
    private String name;

}
