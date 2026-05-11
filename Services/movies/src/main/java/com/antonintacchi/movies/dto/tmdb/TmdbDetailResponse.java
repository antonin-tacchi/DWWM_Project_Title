package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbDetailResponse {

    private Long id;
    private String title;
    private String name;
    private String overview;

    @JsonProperty("poster_path")
    private String posterPath;

    @JsonProperty("backdrop_path")
    private String backdropPath;

    @JsonProperty("release_date")
    private String releaseDate;

    @JsonProperty("first_air_date")
    private String firstAirDate;

    @JsonProperty("vote_average")
    private Double voteAverage;

    @JsonProperty("media_type")
    private String mediaType;

    private List<TmdbGenre> genres;
    private Integer runtime;
    private String status;
    private String tagline;

    @JsonProperty("vote_count")
    private Integer voteCount;

    @JsonProperty("original_language")
    private String originalLanguage;

    @JsonProperty("number_of_seasons")
    private Integer numberOfSeasons;

    @JsonProperty("number_of_episodes")
    private Integer numberOfEpisodes;
}
