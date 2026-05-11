package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbVideo {

    private String key;
    private String site;
    private String type;
    private String name;

}
