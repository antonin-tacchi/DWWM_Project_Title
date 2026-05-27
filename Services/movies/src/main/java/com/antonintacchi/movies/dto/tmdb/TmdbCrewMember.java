package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbCrewMember {

    private Long id;
    private String name;
    private String job;
    private String department;

    @JsonProperty("profile_path")
    private String profilePath;

}
