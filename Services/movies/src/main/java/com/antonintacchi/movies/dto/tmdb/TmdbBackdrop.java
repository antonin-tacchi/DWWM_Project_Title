package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbBackdrop {

    @JsonProperty("file_path")
    private String filePath;

    private Integer width;
    private Integer height;

    @JsonProperty("vote_average")
    private Double voteAverage;

}
