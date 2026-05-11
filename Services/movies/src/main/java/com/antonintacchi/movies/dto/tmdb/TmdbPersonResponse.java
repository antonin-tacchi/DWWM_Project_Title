package com.antonintacchi.movies.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbPersonResponse {

    private Integer id;
    private String name;
    private String biography;

    @JsonProperty("profile_path")
    private String profilePath;

    private String birthday;

    @JsonProperty("known_for_department")
    private String knownForDepartment;

}
