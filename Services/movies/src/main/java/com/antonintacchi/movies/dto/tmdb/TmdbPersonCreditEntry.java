package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbPersonCreditEntry {

    private Long id;

    /** Movie title */
    private String title;

    /** TV show name */
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

    @JsonProperty("vote_count")
    private Integer voteCount;

    @JsonProperty("media_type")
    private String mediaType;

    /** Cast field: character played */
    private String character;

    /** Cast field: order of appearance in credits */
    private Integer order;

    /** Crew field: job title (e.g. "Director", "Producer") */
    private String job;

    /** Crew field: department (e.g. "Directing", "Production") */
    private String department;

    /** Convenience: returns title for movies, name for TV */
    public String getDisplayTitle() {
        return title != null ? title : name;
    }

    /** Convenience: returns release date for movies, first_air_date for TV */
    public String getDisplayDate() {
        return releaseDate != null ? releaseDate : firstAirDate;
    }
}
